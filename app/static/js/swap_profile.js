// Enhanced Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

function initializeProfilePage() {
    try {
        console.log('Initializing enhanced profile page...');
        
        // Hide loading screen
        setTimeout(hideLoadingScreen, 500);
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Initialize animations
        initializeAnimations();
        
        // Initialize tooltips
        initializeTooltips();
        
        // Add smooth scroll for anchor links
        initializeSmoothScroll();
        
        // Initialize image lazy loading
        initializeLazyLoading();
        
        // Initialize modal functionality
        initializeModalEvents();
        
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
    
    // Skill card interactions
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            const skillName = this.querySelector('.skill-name').textContent;
            showSkillDetail(skillName);
        });
    });
    
    // Project card interactions - UPDATED for new modal system
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the View Details button
            if (!e.target.closest('.view-project-btn')) {
                const projectData = JSON.parse(this.getAttribute('data-project'));
                showProjectModal(projectData);
            }
        });
    });
    
    // View Details button click for projects
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectCard = this.closest('.project-card');
            const projectData = JSON.parse(projectCard.getAttribute('data-project'));
            showProjectModal(projectData);
        });
    });
    
    // Certificate link clicks
    const certLinks = document.querySelectorAll('.view-certificate');
    certLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            // Analytics tracking for certificate views could be added here
            console.log('Certificate viewed:', this.href);
        });
    });
    
    // Social link interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking for social clicks could be added here
            console.log('Social link clicked:', this.href);
        });
    });
    
    console.log('Event listeners initialized');
}

function initializeAnimations() {
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all sections for animation
        const sections = document.querySelectorAll('.profile-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

function initializeTooltips() {
    // Initialize tooltips for social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        const title = link.getAttribute('title');
        if (title) {
            link.addEventListener('mouseenter', function(e) {
                showTooltip(e, title);
            });
            link.addEventListener('mouseleave', hideTooltip);
        }
    });
}

function showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    // Position tooltip
    tooltip.style.position = 'fixed';
    tooltip.style.left = event.clientX + 'px';
    tooltip.style.top = (event.clientY - 40) + 'px';
    tooltip.style.zIndex = '10000';
    tooltip.style.padding = '6px 12px';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.whiteSpace = 'nowrap';
    
    document.body.appendChild(tooltip);
    
    // Store reference for removal
    event.target.tooltip = tooltip;
}

function hideTooltip(event) {
    if (event.target.tooltip) {
        event.target.tooltip.remove();
        event.target.tooltip = null;
    }
}

function initializeSmoothScroll() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

function initializeLazyLoading() {
    // Lazy load images if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function initializeModalEvents() {
    // Close modal when clicking outside or pressing Escape
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProjectModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        });
    }
}

function showSkillDetail(skillName) {
    // Create modal for skill details
    const modal = document.createElement('div');
    modal.className = 'skill-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${skillName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Skill details and related information would appear here.</p>
                <div class="skill-stats">
                    <div class="stat">
                        <span class="label">Proficiency</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: 75%"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <span class="label">Experience</span>
                        <span class="value">2+ years</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on button click or outside click
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Add CSS for modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .skill-modal .modal-content {
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
        }
        
        @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .skill-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .skill-modal .modal-header h3 {
            margin: 0;
            color: #1f2937;
        }
        
        .skill-modal .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
        }
        
        .skill-modal .skill-stats {
            margin-top: 20px;
        }
        
        .skill-modal .stat {
            margin-bottom: 16px;
        }
        
        .skill-modal .label {
            display: block;
            margin-bottom: 8px;
            color: #6b7280;
            font-size: 14px;
        }
        
        .skill-modal .progress-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .skill-modal .progress {
            height: 100%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 4px;
        }
        
        .skill-modal .value {
            color: #1f2937;
            font-weight: 600;
        }
    `;
    document.head.appendChild(modalStyles);
}

// NEW FUNCTION: Show project modal with actual project data
function showProjectModal(projectData) {
    // Get modal elements
    const projectModal = document.getElementById('projectModal');
    const projectTitle = document.getElementById('projectTitle');
    const projectModalContent = document.getElementById('projectModalContent');
    
    if (!projectModal || !projectTitle || !projectModalContent) {
        console.error('Project modal elements not found');
        return;
    }
    
    // Set modal title
    projectTitle.textContent = projectData.title;
    
    // Build modal content
    let html = '';
    
    // Type badge
    if (projectData.type) {
        html += `<div class="project-type-badge">${projectData.type}</div>`;
    }
    
    // Role
    if (projectData.role) {
        html += `
            <div class="project-role-row">
                <i class="fas fa-user-tie"></i>
                <span>${projectData.role}</span>
            </div>
        `;
    }
    
    // Full description
    if (projectData.description) {
        html += `
            <div class="project-description-full">
                <h4>Description</h4>
                <p>${projectData.description}</p>
            </div>
        `;
    }
    
    // Technologies
    if (projectData.technologies && projectData.technologies.length > 0) {
        html += `
            <div class="project-technologies">
                <h4>Technologies Used</h4>
                <div class="tech-tags-modal">
                    ${projectData.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    // Project links - handle both new and old data structures
    const links = projectData.links || [];
    
    // If no links array but has github or live_url (old structure)
    if (links.length === 0) {
        if (projectData.github) {
            links.push({ name: "GitHub Repository", url: projectData.github });
        }
        if (projectData.live_url) {
            links.push({ name: "Live Demo", url: projectData.live_url });
        }
    }
    
    if (links.length > 0) {
        html += `
            <div class="project-links-modal">
                <h4>Project Links</h4>
                <div class="links-grid">
                    ${links.map(link => {
                        // Determine icon based on link name
                        const iconClass = link.name.toLowerCase().includes('github') ? 'fab fa-github' :
                                        link.name.toLowerCase().includes('live') || link.name.toLowerCase().includes('demo') ? 'fas fa-external-link-alt' :
                                        'fas fa-link';
                        return `
                            <a href="${link.url}" target="_blank" class="project-link-modal">
                                <i class="${iconClass}"></i>
                                <span>${link.name}</span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Images if available
    if (projectData.images && projectData.images.length > 0) {
        html += `
            <div class="project-images">
                <h4>Project Images</h4>
                <div class="images-grid">
                    ${projectData.images.slice(0, 3).map(img => `
                        <img src="${img}" alt="Project Image" class="project-image" onerror="this.style.display='none'">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    projectModalContent.innerHTML = html;
    
    // Show modal
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// NEW FUNCTION: Close project modal
function closeProjectModal() {
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function handleMessageClick() {
    // Create message notification
    const notification = document.createElement('div');
    notification.className = 'feature-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-comments"></i>
            <span>Messaging feature coming soon! You can request a swap to start a conversation.</span>
        </div>
    `;
    
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
        backdrop-filter: blur(10px);
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

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// Add global function for modal close (called from inline HTML)
window.closeProjectModal = closeProjectModal;
window.handleMessageClick = handleMessageClick;