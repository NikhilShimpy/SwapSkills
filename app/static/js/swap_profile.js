// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

function initializeProfilePage() {
    try {
        console.log('Initializing profile page...');
        
        // Hide loading screen
        setTimeout(hideLoadingScreen, 500);
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Initialize animations
        initializeAnimations();
        
    } catch (error) {
        console.error('Error initializing profile page:', error);
        hideLoadingScreen();
    }
}

function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        console.log('Loading screen hidden successfully');
    }
}

function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Message button functionality
    const messageBtn = document.querySelector('.message-btn');
    if (messageBtn) {
        messageBtn.addEventListener('click', handleMessageClick);
    }
    
    // Skill card interactions
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Profile image hover effect
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    console.log('Event listeners initialized');
}

function initializeAnimations() {
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe all sections for animation
        const sections = document.querySelectorAll('.skills-section, .about-section, .feedback-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
}

function handleMessageClick() {
    // For now, show a message that this feature is coming soon
    // In a real implementation, this would open a messaging interface
    
    const notification = document.createElement('div');
    notification.className = 'feature-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-comments"></i>
            <span>Messaging feature coming soon!</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
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

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text);
    }
    
    .notification-content i {
        color: var(--primary);
    }
`;
document.head.appendChild(notificationStyles);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    hideLoadingScreen();
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    hideLoadingScreen();
});

// Safety timeout to hide loading screen
setTimeout(hideLoadingScreen, 3000);