// Simple initialization without Firebase dependencies
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
        
        // Load initial data
        loadInitialData();
        
        // Hide loading screen after a short delay
        setTimeout(hideLoadingScreen, 500);
        
    } catch (error) {
        console.error('Error initializing app:', error);
        // Ensure loading screen is hidden even if there's an error
        hideLoadingScreen();
    }
}

function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
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
        resultsCount: document.getElementById('resultsCount'),
        usersCount: document.getElementById('usersCount'),
        swapsCount: document.getElementById('swapsCount'),
        skillsCount: document.getElementById('skillsCount')
    };
    
    console.log('DOM elements initialized');
}

function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        console.log('Loading screen hidden successfully');
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
    
    // Bookmark buttons
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
    
    console.log('All event listeners initialized');
}

// Data Loading
function loadInitialData() {
    try {
        console.log('Loading initial data...');
        // This would typically load data from your backend
        // For now, we'll just log that it's loading
        console.log('Initial data loaded successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
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
    const category = filterTag.textContent.toLowerCase();
    
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
    const firstFilter = document.querySelector('.filter-tag');
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
    
    userCards.forEach(card => {
        const userName = card.querySelector('.user-name')?.textContent.toLowerCase() || '';
        const skills = Array.from(card.querySelectorAll('.skill-tag'))
            .map(tag => tag.textContent.toLowerCase());
        
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        
        const activeFilter = document.querySelector('.filter-tag.active');
        const category = activeFilter ? activeFilter.textContent.toLowerCase() : 'all skills';
        
        const matchesSearch = !searchTerm || 
            userName.includes(searchTerm) ||
            skills.some(skill => skill.includes(searchTerm));
        
        const matchesCategory = category === 'all skills' ||
            skills.some(skill => skill.includes(category));
        
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
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function handleBookmarkClick(button) {
    // For now, just toggle the visual state
    // In a real app, this would save to your backend
    const isBookmarked = button.classList.contains('active');
    
    if (isBookmarked) {
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-bookmark"></i>';
    } else {
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
    }
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

// Safety timeout to hide loading screen no matter what
setTimeout(hideLoadingScreen, 3000);