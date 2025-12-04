// seeRequest.js - Futuristic Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Swap Requests Page - Futuristic UI Loaded');
    
    // Initialize all enhanced features
    initEnhancedUI();
    initParallaxEffects();
    initHoverAnimations();
    initKeyboardNavigation();
    initRealTimeUpdates();
    initSmoothScrolling();
    initTouchGestures();
    initPerformanceMonitor();
});

function initEnhancedUI() {
    // Add futuristic hover effects
    const cards = document.querySelectorAll('.request-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 30px 60px rgba(99, 102, 241, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'var(--shadow-futuristic)';
        });
    });
    
    // Enhanced status indicators with particles
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', () => {
            createParticles(indicator);
        });
    });
    
    // Animate stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 100);
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-action, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    // Initialize tooltips
    initTooltips();
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 8;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = getComputedStyle(element).background;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / particles;
        const distance = 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        
        document.body.appendChild(particle);
        
        // Animate particle
        particle.animate([
            {
                transform: `translate(0, 0) scale(1)`,
                opacity: 1
            },
            {
                transform: `translate(${x}px, ${y}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), 800);
    }
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

function initParallaxEffects() {
    const header = document.querySelector('.requests-header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        });
    }
}

function initHoverAnimations() {
    // Add 3D tilt effect to cards
    const cards = document.querySelectorAll('.request-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Arrow navigation between cards
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const cards = document.querySelectorAll('.request-card');
            const currentIndex = Array.from(cards).findIndex(card => 
                card === document.activeElement.closest('.request-card')
            );
            
            let nextIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
            }
            
            cards[nextIndex]?.focus();
            cards[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Enter to activate primary action
        if (e.key === 'Enter' && document.activeElement.classList.contains('request-card')) {
            const primaryButton = document.activeElement.querySelector('.btn-action.accept, .btn-action.details');
            primaryButton?.click();
        }
    });
}

function initRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        const pendingBadge = document.querySelector('.notification-badge');
        if (pendingBadge) {
            const currentCount = parseInt(pendingBadge.textContent);
            if (currentCount > 0) {
                pendingBadge.style.animation = 'pulse 1s infinite';
                setTimeout(() => {
                    pendingBadge.style.animation = '';
                }, 1000);
            }
        }
    }, 30000); // Update every 30 seconds
}

function initSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Swipe left/right for navigation
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe right - go to invitations
                const invitationsTab = document.querySelector('[data-view="invitations"]');
                if (invitationsTab) invitationsTab.click();
            } else {
                // Swipe left - go to my requests
                const myRequestsTab = document.querySelector('[data-view="my_requests"]');
                if (myRequestsTab) myRequestsTab.click();
            }
        }
    });
}

function initPerformanceMonitor() {
    // Monitor performance and adjust animations
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 16) { // 60fps threshold
                console.warn('Performance issue detected:', entry.name);
                // Disable some animations if performance is poor
                document.body.classList.add('reduce-motion');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['longtask'] });
}

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', createFuturisticTooltip);
        element.addEventListener('mouseleave', removeTooltip);
        element.addEventListener('focus', createFuturisticTooltip);
        element.addEventListener('blur', removeTooltip);
    });
}

function createFuturisticTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    removeTooltip.call(this);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'futuristic-tooltip';
    tooltip.textContent = tooltipText;
    
    const rect = this.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    
    document.body.appendChild(tooltip);
    
    this._tooltip = tooltip;
    
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

// Enhanced notification system with animations
function showNotification(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add entrance animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove with exit animation
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 400);
    }, duration);
}

// Enhanced request details view
function showRequestDetails(swapId) {
    showLoading(true);
    
    fetch(`/api/swaps/${swapId}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                populateEnhancedDetailsModal(data.data);
                showModal('detailsModal');
                
                // Add animation to modal
                const modal = document.getElementById('detailsModal');
                if (modal) {
                    modal.classList.add('enhanced');
                }
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

function populateEnhancedDetailsModal(swapData) {
    const modalBody = document.getElementById('detailsModalBody');
    
    if (!modalBody) return;
    
    const createdAt = swapData.createdAt ? new Date(swapData.createdAt.seconds * 1000) : new Date();
    const updatedAt = swapData.updatedAt ? new Date(swapData.updatedAt.seconds * 1000) : null;
    
    modalBody.innerHTML = `
        <div class="details-content enhanced">
            <div class="detail-section">
                <h4><i class="fas fa-users"></i> Participants</h4>
                <div class="participants-grid">
                    <div class="participant" onclick="viewUserProfile('${swapData.fromUserId}')">
                        <div class="participant-avatar-container">
                            <img src="${swapData.metadata?.fromUserPhoto || '/static/default-profile.png'}" 
                                 alt="${swapData.metadata?.fromUserName || 'Sender'}" 
                                 class="participant-avatar">
                            <div class="participant-status online"></div>
                        </div>
                        <div class="participant-info">
                            <strong>From:</strong>
                            <h5>${swapData.metadata?.fromUserName || 'Unknown User'}</h5>
                            <small>Request Sender</small>
                            <div class="participant-actions">
                                <button class="btn-action message" onclick="messageUser('${swapData.fromUserId}')">
                                    <i class="fas fa-comment"></i> Message
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="participant" onclick="viewUserProfile('${swapData.toUserId}')">
                        <div class="participant-avatar-container">
                            <img src="${swapData.metadata?.toUserPhoto || '/static/default-profile.png'}" 
                                 alt="${swapData.metadata?.toUserName || 'Receiver'}" 
                                 class="participant-avatar">
                            <div class="participant-status online"></div>
                        </div>
                        <div class="participant-info">
                            <strong>To:</strong>
                            <h5>${swapData.metadata?.toUserName || 'Unknown User'}</h5>
                            <small>Request Receiver</small>
                            <div class="participant-actions">
                                <button class="btn-action message" onclick="messageUser('${swapData.toUserId}')">
                                    <i class="fas fa-comment"></i> Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-exchange-alt"></i> Swap Details</h4>
                <div class="swap-info-grid enhanced">
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
                        <span class="info-value status-indicator status-${swapData.status.toLowerCase()}">
                            <i class="fas fa-${getStatusIcon(swapData.status)}"></i>
                            ${swapData.status}
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Request ID:</span>
                        <span class="info-value">${swapData.swapId || swapData.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Created:</span>
                        <span class="info-value">
                            <i class="far fa-calendar"></i>
                            ${createdAt.toLocaleString()}
                        </span>
                    </div>
                    ${updatedAt ? `
                    <div class="info-item">
                        <span class="info-label">Last Updated:</span>
                        <span class="info-value">
                            <i class="far fa-calendar-check"></i>
                            ${updatedAt.toLocaleString()}
                        </span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${swapData.message ? `
            <div class="detail-section">
                <h4><i class="fas fa-envelope"></i> Message</h4>
                <div class="message-full enhanced">
                    <div class="message-header">
                        <i class="fas fa-quote-left"></i>
                        <span>Personal Message</span>
                    </div>
                    <p>${swapData.message}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-history"></i> Activity Timeline</h4>
                <div class="timeline enhanced">
                    <div class="timeline-item">
                        <div class="timeline-dot primary"></div>
                        <div class="timeline-content">
                            <strong>Request Created</strong>
                            <span><i class="far fa-clock"></i> ${createdAt.toLocaleString()}</span>
                        </div>
                    </div>
                    ${updatedAt ? `
                    <div class="timeline-item">
                        <div class="timeline-dot success"></div>
                        <div class="timeline-content">
                            <strong>Status Updated</strong>
                            <span><i class="far fa-clock"></i> ${updatedAt.toLocaleString()}</span>
                        </div>
                    </div>
                    ` : ''}
                    <div class="timeline-item">
                        <div class="timeline-dot info"></div>
                        <div class="timeline-content">
                            <strong>Current Status</strong>
                            <span class="status-indicator status-${swapData.status.toLowerCase()}">
                                ${swapData.status.charAt(0).toUpperCase() + swapData.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
                <div class="quick-actions">
                    <button class="btn-action message" onclick="messageUser('${swapData.fromUserId}')">
                        <i class="fas fa-comment"></i> Send Message
                    </button>
                    <button class="btn-action schedule" onclick="scheduleSwap('${swapData.swapId || swapData.id}')">
                        <i class="fas fa-calendar-plus"></i> Schedule Meeting
                    </button>
                    ${swapData.status === 'completed' ? `
                    <button class="btn-action rate" onclick="rateSwap('${swapData.swapId || swapData.id}')">
                        <i class="fas fa-star"></i> Rate Experience
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'clock',
        'accepted': 'check-circle',
        'rejected': 'times-circle',
        'completed': 'trophy',
        'cancelled': 'ban'
    };
    return icons[status.toLowerCase()] || 'circle';
}

// Enhanced filter with debounce
function filterRequests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.request-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const userName = card.dataset.user || '';
        const skills = card.dataset.skill || '';
        
        const matches = searchTerm === '' || 
                       userName.includes(searchTerm) || 
                       skills.includes(searchTerm);
        
        if (matches) {
            card.style.display = 'block';
            visibleCount++;
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results counter
    const resultsCounter = document.getElementById('resultsCounter') || 
        (() => {
            const counter = document.createElement('div');
            counter.id = 'resultsCounter';
            counter.className = 'results-counter';
            document.querySelector('.view-toggle-container').appendChild(counter);
            return counter;
        })();
    
    resultsCounter.textContent = `${visibleCount} request${visibleCount !== 1 ? 's' : ''} found`;
}

// Enhanced refresh with animation
function refreshRequests() {
    const refreshBtn = document.querySelector('.btn-refresh i');
    if (refreshBtn) {
        refreshBtn.style.animation = 'spin 1s linear';
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 1000);
    }
    
    showNotification('Refreshing swap requests...', 'info');
    
    setTimeout(() => {
        const view = document.querySelector('.view-tab.active').dataset.view;
        const status = document.getElementById('statusFilter').value || 'all';
        const search = document.getElementById('searchInput').value || '';
        window.location.href = `/see-request?view=${view}&status=${status}&q=${encodeURIComponent(search)}`;
    }, 800);
}

// Enhanced modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
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

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally available
window.filterByStatus = function(status) {
    const view = document.querySelector('.view-tab.active').dataset.view;
    window.location.href = `/see-request?view=${view}&status=${status}`;
};

window.scheduleSwap = function(id) { 
    showNotification('Schedule feature coming soon!', 'info');
};

window.messageUser = function(id) { 
    showNotification('Messaging feature coming soon!', 'info');
};

window.rateSwap = function(id) { 
    showNotification('Rating feature coming soon!', 'info');
};

window.viewUserProfile = function(userId) {
    window.location.href = `/swap/${userId}`;
};

window.refreshRequests = refreshRequests;
window.showRequestDetails = showRequestDetails;
window.showNotification = showNotification;
window.closeModal = closeModal;
window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
};

// Initialize on load
setTimeout(() => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
    
    // Animate cards in sequence
    const cards = document.querySelectorAll('.request-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 50);
    });
}, 800);