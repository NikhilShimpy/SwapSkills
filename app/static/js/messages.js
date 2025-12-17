// static/js/messages.js - FIXED VERSION

// Global variables
let currentUserId = null;
let currentChatUserId = null;
let conversations = [];
let messagesListener = null;
let lastMessageDate = null;

// DOM elements
const loadingOverlay = document.getElementById('loadingOverlay');
const conversationsList = document.getElementById('conversationsList');
const searchConversations = document.getElementById('searchConversations');
const emptyChatState = document.getElementById('emptyChatState');
const activeChat = document.getElementById('activeChat');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatUserName = document.getElementById('chatUserName');
const chatUserAvatar = document.getElementById('chatUserAvatar');

// Initialize the messaging system
function initMessaging() {
    showLoading();
    
    // Get current user ID from session
    fetch('/api/user-data')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                currentUserId = data.data.user_id || data.data.uid || CURRENT_USER_ID;
                console.log('Current user ID:', currentUserId);
                loadConversations();
                setupEventListeners();
                checkAuth();
                
                // Check URL for direct chat parameter
                const urlParams = new URLSearchParams(window.location.search);
                const chatWith = urlParams.get('chat');
                if (chatWith && chatWith !== currentUserId) {
                    openChatFromUrl(chatWith);
                }
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
    if (loadingOverlay) loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.remove('active');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                          type === 'success' ? 'check-circle' : 
                          'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check authentication
function checkAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '/login';
        }
    });
}

// Load conversations - FIXED VERSION
async function loadConversations() {
    try {
        showLoading();
        
        const response = await fetch('/api/conversations');
        const data = await response.json();
        
        console.log('Conversations API response:', data);
        
        if (data.status === 'success') {
            conversations = data.conversations;
            renderConversations(conversations);
            
            if (conversations.length === 0) {
                conversationsList.innerHTML = `
                    <div class="no-conversations">
                        <i class="fas fa-comments"></i>
                        <h3>No conversations yet</h3>
                        <p>Start a conversation by searching for users</p>
                    </div>
                `;
            }
        } else {
            conversationsList.innerHTML = `
                <div class="no-conversations">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error loading conversations</h3>
                    <p>${data.message || 'Please try again'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
        conversationsList.innerHTML = `
            <div class="no-conversations">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error loading conversations</h3>
                <p>Please check your connection</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Render conversations list - FIXED VERSION
function renderConversations(conversationsToRender) {
    if (conversationsToRender.length === 0) {
        conversationsList.innerHTML = `
            <div class="no-conversations">
                <i class="fas fa-comments"></i>
                <h3>No conversations yet</h3>
                <p>Start a conversation by searching for users</p>
            </div>
        `;
        return;
    }
    
    conversationsList.innerHTML = '';
    
    conversationsToRender.forEach(conv => {
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation-item';
        conversationElement.dataset.userId = conv.user_id;
        
        // Determine message preview
        let messagePreview = conv.last_message || '';
        let messageClass = '';
        if (conv.is_sent_by_me) {
            messagePreview = `You: ${messagePreview}`;
            messageClass = 'you';
        }
        
        // Truncate message preview
        if (messagePreview.length > 40) {
            messagePreview = messagePreview.substring(0, 37) + '...';
        }
        
        // Format timestamp
        let timeDisplay = 'Recently';
        if (conv.timestamp_formatted) {
            timeDisplay = conv.timestamp_formatted;
        }
        
        conversationElement.innerHTML = `
            <div class="conversation-avatar">
                <img src="${conv.user_photo || '/static/default-profile.png'}" 
                     alt="${conv.user_name}"
                     onerror="this.src='/static/default-profile.png'">
            </div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <div class="conversation-name">${escapeHtml(conv.user_name)}</div>
                    <div class="conversation-time">${timeDisplay}</div>
                </div>
                <div class="conversation-preview">
                    <div class="conversation-message ${messageClass}">
                        ${escapeHtml(messagePreview)}
                    </div>
                    ${conv.unread_count > 0 ? `
                        <div class="unread-badge">${conv.unread_count}</div>
                    ` : ''}
                </div>
            </div>
        `;
        
        conversationElement.addEventListener('click', () => {
            openChat(conv.user_id, conv.user_name, conv.user_photo);
            
            // Update active state
            document.querySelectorAll('.conversation-item').forEach(item => {
                item.classList.remove('active');
            });
            conversationElement.classList.add('active');
        });
        
        conversationsList.appendChild(conversationElement);
    });
}

// Open chat from URL parameter
async function openChatFromUrl(userId) {
    try {
        // First try to get user info from search
        const response = await fetch(`/api/search-users?q=${encodeURIComponent(userId)}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.results.length > 0) {
            const user = data.results.find(u => u.user_id === userId);
            if (user) {
                openChat(user.user_id, user.name, user.photo_url);
                return;
            }
        }
        
        // If not found in search, try to load directly
        openChat(userId, 'User', '/static/default-profile.png');
    } catch (error) {
        console.error('Error opening chat from URL:', error);
        showNotification('User not found', 'error');
    }
}

// Open chat with user - FIXED VERSION
async function openChat(userId, userName, userPhoto) {
    if (currentChatUserId === userId) {
        return;
    }
    
    currentChatUserId = userId;
    
    showLoading();
    
    // Update UI
    chatUserName.textContent = userName;
    chatUserAvatar.src = userPhoto || '/static/default-profile.png';
    chatUserAvatar.onerror = function() {
        this.src = '/static/default-profile.png';
    };
    
    // Update profile link
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    if (viewProfileBtn) {
        viewProfileBtn.onclick = () => {
            window.open(`/user/${userId}`, '_blank');
        };
    }
    
    // Show chat window, hide empty state
    emptyChatState.style.display = 'none';
    activeChat.style.display = 'flex';
    
    // Clear previous listener
    if (messagesListener) {
        messagesListener();
        messagesListener = null;
    }
    
    // Clear messages container
    messagesContainer.innerHTML = '';
    
    try {
        // Load messages
        await loadMessages(userId);
        
        // Set up real-time listener
        setupMessagesListener(userId);
        
        // On mobile, switch to chat view
        if (window.innerWidth <= 768) {
            document.querySelector('.conversations-sidebar').classList.add('hidden');
            document.querySelector('.chat-area').classList.add('active');
        }
        
    } catch (error) {
        console.error('Error opening chat:', error);
        showNotification('Error loading chat', 'error');
    } finally {
        hideLoading();
    }
}

// Load messages for a conversation - FIXED VERSION
async function loadMessages(userId) {
    try {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();
        
        console.log('Messages API response:', data);
        
        if (data.status === 'success') {
            renderMessages(data.messages);
        } else {
            messagesContainer.innerHTML = `
                <div class="no-messages">
                    <p>${data.message || 'No messages yet. Start the conversation!'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <p>Error loading messages. Please try again.</p>
            </div>
        `;
    }
}

// Format date like WhatsApp
function formatDateLikeWhatsApp(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else if (now - date < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Format time like WhatsApp
function formatTimeLikeWhatsApp(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    }).toLowerCase();
}

// Add date divider
function addDateDivider(date) {
    const formattedDate = formatDateLikeWhatsApp(date);
    const lastDivider = messagesContainer.querySelector('.date-divider:last-child');
    
    if (!lastDivider || lastDivider.textContent !== formattedDate) {
        const dateDivider = document.createElement('div');
        dateDivider.className = 'date-divider';
        dateDivider.innerHTML = `<span>${formattedDate}</span>`;
        messagesContainer.appendChild(dateDivider);
    }
}

// Render message with WhatsApp-like UI - FIXED VERSION
function renderMessage(message) {
    // Skip if message doesn't have required fields
    if (!message || !message.content) return;
    
    const isSent = message.senderId === currentUserId;
    let date;
    
    // Parse timestamp
    if (message.datetime) {
        date = new Date(message.datetime);
    } else if (message.timestamp) {
        if (typeof message.timestamp === 'string') {
            date = new Date(message.timestamp);
        } else if (message.timestamp.seconds) {
            date = new Date(message.timestamp.seconds * 1000);
        } else if (message.timestamp.toDate) {
            date = message.timestamp.toDate();
        } else {
            date = new Date();
        }
    } else {
        date = new Date();
    }
    
    // Validate date
    if (isNaN(date.getTime())) {
        date = new Date();
    }
    
    // Add date divider if needed
    if (!lastMessageDate || lastMessageDate.toDateString() !== date.toDateString()) {
        addDateDivider(date);
        lastMessageDate = date;
    }
    
    // Create message bubble
    const messageBubble = document.createElement('div');
    messageBubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
    
    const time = formatTimeLikeWhatsApp(date);
    
    // Determine message status
    let statusHTML = '';
    if (isSent) {
        if (message.read) {
            statusHTML = `
                <span class="message-status">
                    <span class="blue-double-tick">
                        <i class="fas fa-check-double"></i>
                    </span>
                </span>
            `;
        } else {
            statusHTML = `
                <span class="message-status">
                    <span class="single-tick">
                        <i class="fas fa-check"></i>
                    </span>
                </span>
            `;
        }
    }
    
    messageBubble.innerHTML = `
        <div class="message-content ${isSent ? 'sent' : 'received'}">
            <div class="message-text">${escapeHtml(message.content)}</div>
            <div class="message-info">
                <span class="message-time">${time}</span>
                ${statusHTML}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageBubble);
    
    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Render all messages - FIXED VERSION
function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    lastMessageDate = null;
    
    if (!messages || messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => {
        const timeA = a.datetime ? new Date(a.datetime) : 
                     (a.timestamp && a.timestamp.seconds ? new Date(a.timestamp.seconds * 1000) : new Date(0));
        const timeB = b.datetime ? new Date(b.datetime) : 
                     (b.timestamp && b.timestamp.seconds ? new Date(b.timestamp.seconds * 1000) : new Date(0));
        return timeA - timeB;
    });
    
    // Render each message
    messages.forEach(message => {
        renderMessage(message);
    });
    
    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Set up real-time listener for messages - FIXED VERSION
function setupMessagesListener(userId) {
    if (!currentUserId || !userId) {
        console.error('Cannot setup listener: missing user IDs');
        return;
    }
    
    console.log('Setting up listener for chat between:', currentUserId, 'and', userId);
    
    try {
        messagesListener = db.collection('messages')
            .where('senderId', 'in', [currentUserId, userId])
            .where('receiverId', 'in', [currentUserId, userId])
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                let hasNewMessages = false;
                
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const message = change.doc.data();
                        message.id = change.doc.id;
                        
                        console.log('New message received:', message);
                        
                        // Hide "no messages" if shown
                        const noMessages = messagesContainer.querySelector('.no-messages');
                        if (noMessages) {
                            noMessages.remove();
                        }
                        
                        renderMessage(message);
                        hasNewMessages = true;
                        
                        // If message is from the other user, mark as read
                        if (message.senderId === userId && message.receiverId === currentUserId) {
                            markMessageAsRead(change.doc.id);
                        }
                    }
                });
                
                if (hasNewMessages) {
                    // Update conversations list
                    loadConversations();
                }
            }, (error) => {
                console.error('Error in messages listener:', error);
                
                // Try to reconnect after 5 seconds
                setTimeout(() => {
                    if (currentChatUserId) {
                        setupMessagesListener(currentChatUserId);
                    }
                }, 5000);
            });
            
        console.log('Messages listener setup successfully');
    } catch (error) {
        console.error('Error setting up messages listener:', error);
    }
}

// Send message - FIXED VERSION (removed spinner)
async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentChatUserId) return;
    
    try {
        // Disable send button while sending
        sendMessageBtn.disabled = true;
        
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiverId: currentChatUserId,
                content: content
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendMessageBtn.disabled = true;
            
            // Update conversations list
            loadConversations();
            
            // Show success notification
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

// Clear chat
async function clearChat() {
    if (!currentChatUserId) return;
    
    if (!confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/clear-chat/${currentChatUserId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear local messages
            messagesContainer.innerHTML = '';
            messagesContainer.innerHTML = `
                <div class="no-messages">
                    <p>Chat cleared</p>
                </div>
            `;
            
            // Update conversations list
            loadConversations();
            
            showNotification('Chat cleared successfully', 'success');
        } else {
            showNotification(data.message || 'Error clearing chat', 'error');
        }
    } catch (error) {
        console.error('Error clearing chat:', error);
        showNotification('Error clearing chat', 'error');
    }
}

// Setup event listeners - FIXED VERSION
function setupEventListeners() {
    // New chat button
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            searchConversations.focus();
        });
    }
    
    // Start new chat button
    const startNewChatBtn = document.getElementById('startNewChatBtn');
    if (startNewChatBtn) {
        startNewChatBtn.addEventListener('click', () => {
            searchConversations.focus();
        });
    }
    
    // Search conversations
    if (searchConversations) {
        searchConversations.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (!query) {
                renderConversations(conversations);
                return;
            }
            
            // Search for users via API
            fetch(`/api/search-users?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        displaySearchResults(data.results);
                    }
                })
                .catch(error => {
                    console.error('Error searching users:', error);
                });
        });
    }
    
    // Message input auto-resize
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            // Enable/disable send button
            if (sendMessageBtn) {
                sendMessageBtn.disabled = !this.value.trim();
            }
        });
        
        // Enable/disable send button on load
        sendMessageBtn.disabled = !messageInput.value.trim();
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
    
    // Clear chat button
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    // Attach button (placeholder)
    const attachBtn = document.getElementById('attachBtn');
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            showNotification('Attachment feature coming soon!', 'info');
        });
    }
    
    // Mobile back button functionality
    document.addEventListener('click', (e) => {
        // If clicking outside chat area on mobile, go back to conversations
        if (window.innerWidth <= 768 && 
            activeChat.style.display === 'flex' && 
            !e.target.closest('.active-chat') &&
            !e.target.closest('.conversations-sidebar')) {
            
            document.querySelector('.conversations-sidebar').classList.remove('hidden');
            document.querySelector('.chat-area').classList.remove('active');
            
            // Clear current chat
            currentChatUserId = null;
            if (messagesListener) {
                messagesListener();
                messagesListener = null;
            }
            
            // Show empty state
            emptyChatState.style.display = 'flex';
            activeChat.style.display = 'none';
        }
    });
}

// Display search results in conversations list
function displaySearchResults(results) {
    if (results.length === 0) {
        conversationsList.innerHTML = `
            <div class="no-conversations">
                <i class="fas fa-user-slash"></i>
                <h3>No users found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }
    
    conversationsList.innerHTML = '';
    
    results.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'conversation-item';
        userElement.dataset.userId = user.user_id;
        
        userElement.innerHTML = `
            <div class="conversation-avatar">
                <img src="${user.photo_url || '/static/default-profile.png'}" 
                     alt="${user.name}"
                     onerror="this.src='/static/default-profile.png'">
            </div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <div class="conversation-name">${escapeHtml(user.name)}</div>
                </div>
                <div class="conversation-preview">
                    <div class="conversation-message">
                        ${user.headline ? escapeHtml(user.headline.substring(0, 40)) : 'Click to start chatting'}
                    </div>
                </div>
            </div>
        `;
        
        userElement.addEventListener('click', () => {
            openChat(user.user_id, user.name, user.photo_url);
            searchConversations.value = '';
            renderConversations(conversations);
        });
        
        conversationsList.appendChild(userElement);
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMessaging);