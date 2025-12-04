// seeRequest.js - Enhanced with better UX and fixed functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Swap Requests Page Enhanced');
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize status indicators
    initStatusIndicators();
    
    // Add keyboard shortcuts
    initKeyboardShortcuts();
    
    // Setup offline detection
    setupOfflineDetection();
});

function initTooltips() {
    // Add tooltips to all elements with data-tooltip
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', createTooltip);
        element.addEventListener('mouseleave', removeTooltip);
    });
}

function createTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    // Remove existing tooltip
    removeTooltip.call(this);
    
    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    // Position tooltip
    const rect = this.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
    
    document.body.appendChild(tooltip);
    
    // Store reference
    this._tooltip = tooltip;
    
    // Show with animation
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);
}

function removeTooltip() {
    if (this._tooltip) {
        this._tooltip.classList.remove('show');
        setTimeout(() => {
            if (this._tooltip && this._tooltip.parentElement) {
                this._tooltip.remove();
            }
        }, 200);
        delete this._tooltip;
    }
}

function initStatusIndicators() {
    // Add pulsing animation to pending requests
    const pendingCards = document.querySelectorAll('.status-pending');
    pendingCards.forEach(card => {
        const indicator = card.querySelector('.status-indicator');
        if (indicator) {
            indicator.classList.add('pulse');
        }
    });
    
    // Add celebration to completed requests
    const completedCards = document.querySelectorAll('.status-completed');
    completedCards.forEach(card => {
        const indicator = card.querySelector('.status-indicator');
        if (indicator) {
            indicator.classList.add('celebrate');
        }
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + R to refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshRequests();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function setupOfflineDetection() {
    window.addEventListener('online', () => {
        showNotification('You are back online. Syncing data...', 'success');
        setTimeout(() => refreshRequests(), 1000);
    });

    window.addEventListener('offline', () => {
        showNotification('You are offline. Some features may not work.', 'warning');
    });
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.id = 'toastContainer';
        document.body.appendChild(toastContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <div>
                <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <p>${message}</p>
            </div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(120%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10000;
                border-left: 4px solid;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-warning {
                border-left-color: #f59e0b;
            }
            
            .notification-info {
                border-left-color: #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.5rem;
            }
            
            .notification-success i {
                color: #10b981;
            }
            
            .notification-error i {
                color: #ef4444;
            }
            
            .notification-warning i {
                color: #f59e0b;
            }
            
            .notification-info i {
                color: #3b82f6;
            }
            
            .notification-content div {
                flex: 1;
            }
            
            .notification-content strong {
                display: block;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 2px;
            }
            
            .notification-content p {
                font-size: 0.875rem;
                color: #6b7280;
                margin: 0;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
    
    toastContainer.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// View user profile
function viewUserProfile(userId) {
    if (!userId) {
        showNotification('User ID not found', 'error');
        return;
    }
    window.location.href = `/swap/${userId}`;
}

// Update swap status
function updateSwapStatus(swapId, action) {
    if (!swapId || !action) {
        showNotification('Invalid parameters', 'error');
        return;
    }
    
    // Store in global variables for confirmation
    window.currentSwapId = swapId;
    window.currentAction = action;
    
    const messages = {
        'accepted': 'Are you sure you want to accept this swap request?',
        'rejected': 'Are you sure you want to reject this swap request?',
        'cancelled': 'Are you sure you want to cancel this swap request?',
        'completed': 'Mark this swap as completed? This action cannot be undone.'
    };
    
    const confirmMessage = messages[action] || 'Are you sure you want to perform this action?';
    const confirmTitle = `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`;
    
    // Show confirmation modal
    showConfirmationModal(confirmTitle, confirmMessage, () => {
        executeSwapStatusUpdate(swapId, action);
    });
}

function showConfirmationModal(title, message, onConfirm) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirmationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmationModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content small">
                <div class="modal-header">
                    <h3 id="confirmationTitle">${title}</h3>
                    <button class="modal-close" onclick="closeModal('confirmationModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p id="confirmationMessage">${message}</p>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal('confirmationModal')">Cancel</button>
                        <button class="btn-primary" id="confirmationConfirmBtn">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        document.getElementById('confirmationTitle').textContent = title;
        document.getElementById('confirmationMessage').textContent = message;
    }
    
    // Remove previous event listeners
    const oldBtn = document.getElementById('confirmationConfirmBtn');
    if (oldBtn) {
        oldBtn.replaceWith(oldBtn.cloneNode(true));
    }
    
    // Add new event listener
    const confirmBtn = document.getElementById('confirmationConfirmBtn');
    confirmBtn.addEventListener('click', () => {
        closeModal('confirmationModal');
        onConfirm();
    });
    
    showModal('confirmationModal');
}

function executeSwapStatusUpdate(swapId, action) {
    showLoading(true);
    
    const formData = new FormData();
    formData.append('action', action);
    
    fetch(`/update-status/${swapId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            showNotification(data.message, 'success');
            // Reload page after delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification(data.message || 'Action failed', 'error');
            showLoading(false);
        }
    })
    .catch(error => {
        console.error('Error updating swap status:', error);
        showNotification('Network error. Please try again.', 'error');
        showLoading(false);
    });
}

function showRequestDetails(swapId) {
    showLoading(true);
    
    fetch(`/api/swaps/${swapId}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                populateDetailsModal(data.data);
                showModal('detailsModal');
            } else {
                showNotification('Could not load request details', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Network error. Please try again.', 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

function populateDetailsModal(swapData) {
    const modalBody = document.getElementById('detailsModalBody');
    
    if (!modalBody) {
        console.error('Details modal body not found');
        return;
    }
    
    // Format dates
    const createdAt = swapData.createdAt ? new Date(swapData.createdAt.seconds * 1000) : new Date();
    const updatedAt = swapData.updatedAt ? new Date(swapData.updatedAt.seconds * 1000) : null;
    
    modalBody.innerHTML = `
        <div class="details-content">
            <div class="detail-section">
                <h4><i class="fas fa-users"></i> Participants</h4>
                <div class="participants-grid">
                    <div class="participant">
                        <img src="${swapData.metadata?.fromUserPhoto || '/static/default-profile.png'}" 
                             alt="${swapData.metadata?.fromUserName || 'Sender'}" 
                             class="participant-avatar"
                             onclick="viewUserProfile('${swapData.fromUserId}')"
                             style="cursor: pointer;">
                        <div class="participant-info">
                            <strong>From:</strong>
                            <h5>${swapData.metadata?.fromUserName || 'Unknown User'}</h5>
                            <small>Request Sender</small>
                        </div>
                    </div>
                    <div class="participant">
                        <img src="${swapData.metadata?.toUserPhoto || '/static/default-profile.png'}" 
                             alt="${swapData.metadata?.toUserName || 'Receiver'}" 
                             class="participant-avatar"
                             onclick="viewUserProfile('${swapData.toUserId}')"
                             style="cursor: pointer;">
                        <div class="participant-info">
                            <strong>To:</strong>
                            <h5>${swapData.metadata?.toUserName || 'Unknown User'}</h5>
                            <small>Request Receiver</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-exchange-alt"></i> Swap Details</h4>
                <div class="swap-info-grid">
                    <div class="info-item">
                        <span class="info-label">Offered Skill:</span>
                        <span class="info-value skill-badge primary">
                            <i class="fas fa-gift"></i>
                            ${swapData.offeredSkill || 'Not specified'}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Requested Skill:</span>
                        <span class="info-value skill-badge secondary">
                            <i class="fas fa-bullseye"></i>
                            ${swapData.requestedSkill || 'Not specified'}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value status-${swapData.status.toLowerCase()}">
                            ${swapData.status}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Request ID:</span>
                        <span class="info-value">${swapData.swapId || swapData.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Created:</span>
                        <span class="info-value">${createdAt.toLocaleString()}</span>
                    </div>
                    ${updatedAt ? `
                    <div class="info-item">
                        <span class="info-label">Last Updated:</span>
                        <span class="info-value">${updatedAt.toLocaleString()}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${swapData.message ? `
            <div class="detail-section">
                <h4><i class="fas fa-envelope"></i> Message</h4>
                <div class="message-full">
                    <p>${swapData.message}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-history"></i> Timeline</h4>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot primary"></div>
                        <div class="timeline-content">
                            <strong>Request Created</strong>
                            <span>${createdAt.toLocaleString()}</span>
                        </div>
                    </div>
                    ${updatedAt ? `
                    <div class="timeline-item">
                        <div class="timeline-dot success"></div>
                        <div class="timeline-content">
                            <strong>Status Updated</strong>
                            <span>${updatedAt.toLocaleString()}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10);
        } else {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    }
}

// Export global functions
window.showNotification = showNotification;
window.refreshRequests = function() {
    showNotification('Refreshing your swap requests...', 'info');
    setTimeout(() => location.reload(), 500);
};

window.viewUserProfile = viewUserProfile;
window.updateSwapStatus = updateSwapStatus;
window.showRequestDetails = showRequestDetails;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;

// Feature placeholder functions
window.scheduleSwap = function(id) { 
    showNotification('Schedule feature coming soon!', 'info');
};

window.messageUser = function(id) { 
    showNotification('Messaging feature coming soon!', 'info');
};

window.rateSwap = function(id) { 
    showNotification('Rating feature coming soon!', 'info');
};

window.showFullMessage = function(swapId) {
    showNotification('Full message feature coming soon!', 'info');
};