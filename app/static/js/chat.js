// static/js/chat.js

// Initialize the chat
function initChat() {
    showLoading();
    
    // Get current user ID from session
    fetch('/api/user-data')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                currentUserId = data.data.user_id || data.data.uid || CURRENT_USER_ID;
                console.log('Current user ID:', currentUserId);
                loadMessages();
                setupEventListeners();
                checkAuth();
                setupMessagesListener();
            } else {
                console.error('Failed to get user data');
                showNotification('Please login again', 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            }
        })
        .catch(error => {
            console.error('Error getting user data:', error);
            showNotification('Error loading user data', 'error');
            hideLoading();
        });
}

// Show loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}

// Check authentication
function checkAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '/login';
        }
    });
}

// Load messages
async function loadMessages() {
    try {
        const response = await fetch(`/api/messages/${targetUserId}`);
        const data = await response.json();
        
        console.log('Messages API response:', data);
        
        if (data.status === 'success') {
            const loadingMessages = document.getElementById('loadingMessages');
            const noMessages = document.getElementById('noMessages');
            
            if (loadingMessages) loadingMessages.style.display = 'none';
            renderMessages(data.messages);
            
            // Update chat header with user info
            updateChatHeader(data.user_info);
            
        } else {
            const loadingMessages = document.getElementById('loadingMessages');
            if (loadingMessages) {
                loadingMessages.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading messages</p>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        const loadingMessages = document.getElementById('loadingMessages');
        if (loadingMessages) {
            loadingMessages.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading messages</p>
            `;
        }
    } finally {
        hideLoading();
    }
}

// Update chat header with user info
function updateChatHeader(userInfo) {
    if (userInfo && userInfo.name) {
        const chatUserName = document.getElementById('chatUserName');
        const chatUserAvatar = document.getElementById('chatUserAvatar');
        const viewProfileBtn = document.getElementById('viewProfileBtn');
        
        if (chatUserName) chatUserName.textContent = userInfo.name;
        if (chatUserAvatar) {
            chatUserAvatar.src = userInfo.photo_url || '/static/default-profile.png';
            chatUserAvatar.onerror = function() {
                this.src = '/static/default-profile.png';
            };
        }
        if (viewProfileBtn) {
            viewProfileBtn.onclick = () => {
                window.open(`/user/${targetUserId}`, '_blank');
            };
        }
    }
}

// Set up real-time listener for messages
function setupMessagesListener() {
    if (!targetUserId || !currentUserId) return;
    
    messagesListener = db.collection('messages')
        .where('senderId', 'in', [currentUserId, targetUserId])
        .where('receiverId', 'in', [currentUserId, targetUserId])
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            let hasNewMessages = false;
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const message = change.doc.data();
                    message.id = change.doc.id;
                    
                    // Format timestamp
                    if (message.timestamp) {
                        let date;
                        if (message.timestamp.toDate) {
                            date = message.timestamp.toDate();
                        } else if (message.timestamp.seconds) {
                            date = new Date(message.timestamp.seconds * 1000);
                        } else {
                            date = new Date();
                        }
                        
                        message.time_formatted = date.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                        message.datetime = date;
                    }
                    
                    // Hide loading/empty messages
                    const loadingMessages = document.getElementById('loadingMessages');
                    const noMessages = document.getElementById('noMessages');
                    const messagesContainer = document.getElementById('messagesContainer');
                    
                    if (loadingMessages && loadingMessages.style.display !== 'none') {
                        loadingMessages.style.display = 'none';
                    }
                    if (noMessages && noMessages.style.display !== 'none') {
                        noMessages.style.display = 'none';
                    }
                    
                    renderMessage(message);
                    hasNewMessages = true;
                    
                    // If message is from the other user, mark as read
                    if (message.senderId === targetUserId && message.receiverId === currentUserId) {
                        markMessageAsRead(message.id);
                    }
                }
            });
            
            if (hasNewMessages) {
                // Scroll to bottom
                setTimeout(() => {
                    const messagesContainer = document.getElementById('messagesContainer');
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }, 100);
            }
        }, (error) => {
            console.error('Error listening to messages:', error);
            showNotification('Connection error. Reconnecting...', 'error');
            
            // Try to reconnect after 5 seconds
            setTimeout(() => {
                setupMessagesListener();
            }, 5000);
        });
}

// Render a single message
function renderMessage(message) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messageWrapper = document.createElement('div');
    const isSent = message.senderId === currentUserId;
    messageWrapper.className = `message-wrapper ${isSent ? 'sent' : 'received'}`;
    
    const time = message.time_formatted || 'Just now';
    const status = isSent ? (message.read ? '✓✓' : '✓') : '';
    
    messageWrapper.innerHTML = `
        <div class="message ${isSent ? 'sent' : 'received'}">
            <div class="message-content">${escapeHtml(message.content)}</div>
            <div class="message-info">
                <span class="message-time">${time}</span>
                ${status ? `<span class="message-status">${status}</span>` : ''}
            </div>
        </div>
        ${isSent ? `
            <div class="message-actions">
                <button class="delete-message-btn" data-message-id="${message.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        ` : ''}
    `;
    
    // Add delete functionality for sent messages
    if (isSent) {
        const deleteBtn = messageWrapper.querySelector('.delete-message-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteMessage(message.id, messageWrapper);
        });
    }
    
    messagesContainer.appendChild(messageWrapper);
    
    // Add date divider if needed
    addDateDivider(message.datetime || new Date(message.timestamp));
}

// Add date divider between messages
function addDateDivider(date) {
    if (!date) return;
    
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const lastDivider = messagesContainer.querySelector('.message-date-divider:last-child');
    const lastMessage = messagesContainer.querySelector('.message-wrapper:last-child');
    
    let needsDivider = false;
    let dividerText = '';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for comparison
    const messageDate = date.toDateString();
    const todayDate = today.toDateString();
    const yesterdayDate = yesterday.toDateString();
    
    if (!lastDivider) {
        needsDivider = true;
    } else {
        const lastDividerDate = lastDivider.dataset.date;
        if (lastDividerDate !== messageDate) {
            needsDivider = true;
        }
    }
    
    if (needsDivider) {
        if (messageDate === todayDate) {
            dividerText = 'Today';
        } else if (messageDate === yesterdayDate) {
            dividerText = 'Yesterday';
        } else {
            dividerText = date.toLocaleDateString([], { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        const dateDivider = document.createElement('div');
        dateDivider.className = 'message-date-divider';
        dateDivider.dataset.date = messageDate;
        dateDivider.innerHTML = `<span>${dividerText}</span>`;
        
        if (lastMessage) {
            messagesContainer.insertBefore(dateDivider, lastMessage.nextSibling);
        } else {
            messagesContainer.appendChild(dateDivider);
        }
    }
}

// Render all messages
function renderMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    const noMessages = document.getElementById('noMessages');
    
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        if (noMessages) {
            noMessages.style.display = 'block';
            messagesContainer.appendChild(noMessages);
        }
        return;
    }
    
    if (noMessages) noMessages.style.display = 'none';
    
    // Group messages by date
    let currentDate = null;
    
    messages.forEach((message, index) => {
        let messageDate;
        if (message.datetime) {
            messageDate = new Date(message.datetime);
        } else if (message.timestamp) {
            messageDate = new Date(message.timestamp);
        } else {
            messageDate = new Date();
        }
        
        // Add date divider if date changed
        if (currentDate !== messageDate.toDateString()) {
            currentDate = messageDate.toDateString();
            addDateDivider(messageDate);
        }
        
        renderMessage(message);
    });
    
    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    if (!messageInput || !sendMessageBtn) return;
    
    const content = messageInput.value.trim();
    if (!content || !targetUserId) return;
    
    try {
        // Disable send button while sending
        sendMessageBtn.disabled = true;
        sendMessageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiverId: targetUserId,
                content: content
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendMessageBtn.disabled = true;
            
            // Create local message for immediate display
            const tempMessage = {
                id: 'temp_' + Date.now(),
                senderId: currentUserId,
                receiverId: targetUserId,
                content: content,
                timestamp: new Date().toISOString(),
                time_formatted: new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                read: false,
                type: 'text'
            };
            
            // Hide "no messages" if shown
            const noMessages = document.getElementById('noMessages');
            if (noMessages && noMessages.style.display !== 'none') {
                noMessages.style.display = 'none';
            }
            
            renderMessage(tempMessage, true);
            
            // Scroll to bottom
            setTimeout(() => {
                const messagesContainer = document.getElementById('messagesContainer');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 100);
            
            // Show sent notification
            showNotification('Message sent', 'success');
        } else {
            showNotification(data.message || 'Error sending message', 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
    } finally {
        // Re-enable send button
        sendMessageBtn.disabled = false;
        sendMessageBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

// Mark message as read
async function markMessageAsRead(messageId) {
    try {
        await fetch(`/api/mark-read/${messageId}`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}

// Delete message
async function deleteMessage(messageId, messageElement) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/delete-message/${messageId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Add delete animation
            messageElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
            
            showNotification('Message deleted', 'success');
        } else {
            showNotification(data.message || 'Error deleting message', 'error');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        showNotification('Error deleting message', 'error');
    }
}

// Clear chat
async function clearChat() {
    if (!targetUserId) return;
    
    if (!confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/clear-chat/${targetUserId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear local messages
            const messagesContainer = document.getElementById('messagesContainer');
            const noMessages = document.getElementById('noMessages');
            
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            if (noMessages) {
                noMessages.style.display = 'block';
                noMessages.textContent = 'Chat cleared';
                if (messagesContainer) {
                    messagesContainer.appendChild(noMessages);
                }
            }
            
            showNotification('Chat cleared successfully', 'success');
        } else {
            showNotification(data.message || 'Error clearing chat', 'error');
        }
    } catch (error) {
        console.error('Error clearing chat:', error);
        showNotification('Error clearing chat', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const attachBtn = document.getElementById('attachBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Message input auto-resize
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            
            // Enable/disable send button
            if (sendMessageBtn) {
                sendMessageBtn.disabled = !this.value.trim();
            }
        });
    }
    
    // Send message on Enter (Shift+Enter for new line)
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (messageInput.value.trim()) {
                    sendMessage();
                }
            }
        });
    }
    
    // Send button click
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    // Attach button (placeholder)
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            showNotification('Attachment feature coming soon!', 'info');
        });
    }
    
    // Clear chat button
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    // Mobile menu functionality
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenuBtn && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Auto-resize message input on window resize
    window.addEventListener('resize', () => {
        if (messageInput) {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
        }
    });
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                              type === 'success' ? 'check-circle' : 
                              'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#f8d7da' : 
                     type === 'success' ? '#d4edda' : 
                     '#d1ecf1'};
        border: 1px solid ${type === 'error' ? '#f5c6cb' : 
                           type === 'success' ? '#c3e6cb' : 
                           '#bee5eb'};
        border-radius: 10px;
        padding: 15px 20px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: ${type === 'error' ? '#721c24' : 
                type === 'success' ? '#155724' : 
                '#0c5460'};
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat);