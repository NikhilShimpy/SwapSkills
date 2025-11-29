// Enhanced index.js with better error handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing SkillSwap...');
    initializeApp();
});

function initializeApp() {
    try {
        console.log('Initializing SkillSwap app...');
        
        // Initialize DOM elements
        initializeDOMElements();
        
        // Set up event listeners
        initializeEventListeners();
        
        // Hide loading screen
        hideLoadingScreen();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoadingScreen();
    }
}

function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
    // Basic DOM elements - don't rely on Firebase
    window.elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        searchClear: document.getElementById('searchClear'),
        searchInput: document.querySelector('.search-input'),
        clearFiltersBtn: document.getElementById('clearFiltersBtn'),
        backToTop: document.getElementById('backToTop'),
        emptyState: document.getElementById('emptyState'),
        userGrid: document.querySelector('.user-grid'),
        resultsCount: document.getElementById('resultsCount')
    };
    
    console.log('DOM elements initialized');
}

function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Use CSS transitions for smooth hiding
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('Loading screen hidden successfully');
        }, 500);
    } else {
        console.log('Loading screen element not found');
    }
}

// Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Search functionality
    const searchClear = document.getElementById('searchClear');
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    }
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
    
    // Filter tags
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', handleFilterClick);
    });
    
    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Bookmark buttons - simplified without Firebase dependency
    document.addEventListener('click', function(e) {
        if (e.target.closest('.bookmark-btn')) {
            e.preventDefault();
            e.stopPropagation();
            handleBookmarkClick(e.target.closest('.bookmark-btn'));
        }
    });
    
    // User card clicks
    document.addEventListener('click', function(e) {
        const userCard = e.target.closest('.user-card');
        if (userCard && !e.target.closest('.request-btn') && !e.target.closest('.bookmark-btn')) {
            const userId = userCard.getAttribute('data-user-id');
            if (userId) {
                window.location.href = `/swap/${userId}`;
            }
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    console.log('All event listeners initialized');
}

// UI Interactions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!mobileMenu || !mobileMenuBtn) return;
    
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function clearSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchInput || !searchClear) return;
    
    searchInput.value = '';
    searchClear.style.display = 'none';
    handleSearch();
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchInput || !searchClear) return;
    
    const searchTerm = searchInput.value.trim();
    searchClear.style.display = searchTerm ? 'block' : 'none';
    
    applyFilters();
}

function handleFilterClick(e) {
    const filterTag = e.target;
    const category = filterTag.getAttribute('data-category') || 'all';
    
    // Update active state
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    filterTag.classList.add('active');
    
    applyFilters();
}

function clearAllFilters() {
    // Clear search
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput && searchClear) {
        searchInput.value = '';
        searchClear.style.display = 'none';
    }
    
    // Reset category filter
    const firstFilter = document.querySelector('.filter-tag[data-category="all"]');
    if (firstFilter) {
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        firstFilter.classList.add('active');
    }
    
    applyFilters();
}

function applyFilters() {
    const userCards = document.querySelectorAll('.user-card');
    let visibleCount = 0;
    
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    const activeFilter = document.querySelector('.filter-tag.active');
    const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
    
    userCards.forEach(card => {
        const userName = card.querySelector('.user-name')?.textContent.toLowerCase() || '';
        const skills = Array.from(card.querySelectorAll('.skill-tag'))
            .map(tag => tag.textContent.toLowerCase());
        
        const matchesSearch = !searchTerm || 
            userName.includes(searchTerm) ||
            skills.some(skill => skill.includes(searchTerm));
        
        const matchesCategory = category === 'all' ||
            skills.some(skill => {
                switch(category) {
                    case 'design':
                        return skill.includes('design') || skill.includes('ui') || skill.includes('ux') || skill.includes('graphic');
                    case 'development':
                        return skill.includes('develop') || skill.includes('programming') || skill.includes('coding') || skill.includes('web') || skill.includes('software');
                    case 'marketing':
                        return skill.includes('market') || skill.includes('seo') || skill.includes('social') || skill.includes('content');
                    case 'languages':
                        return skill.includes('language') || skill.includes('english') || skill.includes('spanish') || skill.includes('french') || skill.includes('german');
                    default:
                        return true;
                }
            });
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = visibleCount;
    }
    
    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    const userGrid = document.querySelector('.user-grid');
    if (emptyState && userGrid) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            userGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            userGrid.style.display = 'grid';
        }
    }
}

// Simplified bookmark without Firebase dependency
function handleBookmarkClick(button) {
    const userId = button.getAttribute('data-user-id');
    const isBookmarked = button.classList.contains('active');
    
    if (isBookmarked) {
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-bookmark"></i>';
        showToast('Bookmark removed', 'success');
    } else {
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast('Bookmark added', 'success');
    }
    
    // Store in local storage
    const bookmarks = JSON.parse(localStorage.getItem('skillswap_bookmarks') || '{}');
    if (isBookmarked) {
        delete bookmarks[userId];
    } else {
        bookmarks[userId] = true;
    }
    localStorage.setItem('skillswap_bookmarks', JSON.stringify(bookmarks));
}

// Utility Functions
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

function toggleBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        toast.style.background = '#10b981';
    } else if (type === 'error') {
        toast.style.background = '#ef4444';
    } else {
        toast.style.background = '#6366f1';
    }

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

// Initialize bookmarks from local storage
function initializeBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('skillswap_bookmarks') || '{}');
    Object.keys(bookmarks).forEach(userId => {
        const bookmarkBtn = document.querySelector(`.bookmark-btn[data-user-id="${userId}"]`);
        if (bookmarkBtn) {
            bookmarkBtn.classList.add('active');
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
    });
}

// Add CSS animations if not present
if (!document.querySelector('#app-animations')) {
    const style = document.createElement('style');
    style.id = 'app-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize bookmarks after page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeBookmarks, 100);
});

console.log("🎉 Index module loaded!");