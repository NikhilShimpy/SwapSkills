// Landing page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLandingPage();
});

function initializeLandingPage() {
    // Animate stats counter
    animateStats();
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Add intersection observers for animations
    setupScrollAnimations();
}

function animateStats() {
    const stats = [
        { element: document.getElementById('usersCount'), target: 500, duration: 2000 },
        { element: document.getElementById('swapsCount'), target: 1200, duration: 2000 },
        { element: document.getElementById('skillsCount'), target: 150, duration: 2000 }
    ];

    stats.forEach(stat => {
        if (!stat.element) return;
        
        let start = 0;
        const increment = stat.target / (stat.duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= stat.target) {
                stat.element.textContent = stat.target + '+';
                clearInterval(timer);
            } else {
                stat.element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    });
}

function setupSmoothScrolling() {
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

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe steps
    document.querySelectorAll('.step').forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(step);
    });
}

// Enhanced search functionality
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchForm || !searchInput) return;
    
    // Debounce search function
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.trim().length >= 2) {
                performSearch(this.value);
            }
        }, 300);
    });
    
    // Real-time search feedback
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.parentElement.classList.add('searching');
        } else {
            this.parentElement.classList.remove('searching');
        }
    });
    
    // Form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput.value);
    });
}

function performSearch(query) {
    const searchBtn = document.querySelector('.search-btn');
    const originalHtml = searchBtn.innerHTML;
    
    // Show loading state
    searchBtn.innerHTML = '<div class="loading-spinner"></div>';
    searchBtn.disabled = true;
    
    // Submit form programmatically
    const form = document.getElementById('searchForm');
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'q';
    input.value = query;
    form.appendChild(input);
    form.submit();
}

// Enhanced card animations
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.user-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach((card, index) => {
        card.style.animation = `cardSlideIn 0.6s ease-out ${index * 0.1}s both paused`;
        observer.observe(card);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeCardAnimations();
    
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .user-card, .skill-tag');
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});