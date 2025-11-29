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