// Enhanced index.js with proper search functionality
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
        
        // Initialize enhanced search
        initializeEnhancedSearch();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoadingScreen();
    }
}

function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
    // Basic DOM elements
    window.elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        searchClear: document.getElementById('searchClear'),
        searchInput: document.getElementById('searchInput'),
        searchForm: document.getElementById('searchForm'),
        searchSuggestions: document.getElementById('searchSuggestions'),
        clearFiltersBtn: document.getElementById('clearFiltersBtn'),
        backToTop: document.getElementById('backToTop'),
        emptyState: document.getElementById('emptyState'),
        userGrid: document.getElementById('userGrid'),
        resultsCount: document.querySelector('.results-count')
    };
    
    console.log('DOM elements initialized');
}

function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
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

// Enhanced Search Functionality
function initializeEnhancedSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !searchSuggestions) return;
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        if (searchClear) {
            searchClear.style.display = this.value ? 'block' : 'none';
        }
    });
    
    // Clear search input
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            searchSuggestions.style.display = 'none';
            // Submit form to clear search
            const form = document.getElementById('searchForm');
            if (form) form.submit();
        });
    }
    
    // Show search suggestions on focus
    searchInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            fetchSearchSuggestions(this.value);
        }
    });
    
    // Fetch search suggestions with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        
        if (this.value.trim().length >= 2) {
            searchTimeout = setTimeout(() => {
                fetchSearchSuggestions(this.value);
            }, 300);
        } else {
            searchSuggestions.style.display = 'none';
        }
    });
    
    // Handle form submission with instant feedback
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchValue = searchInput.value.trim();
            if (searchValue === '') {
                e.preventDefault();
                return;
            }
            
            // Show loading state
            const searchBtn = this.querySelector('.search-btn');
            if (searchBtn) {
                const originalText = searchBtn.innerHTML;
                searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
                searchBtn.disabled = true;
                
                setTimeout(() => {
                    searchBtn.innerHTML = originalText;
                    searchBtn.disabled = false;
                }, 1000);
            }
        });
    }
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

async function fetchSearchSuggestions(query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (!searchSuggestions) return;
    
    try {
        // Make API call to get search suggestions
        const response = await fetch(`/api/search_users?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.results.length > 0) {
            // Show suggestions
            searchSuggestions.innerHTML = '';
            searchSuggestions.style.display = 'block';
            
            // Add suggestion items
            data.results.forEach(user => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.innerHTML = `
                    <div class="suggestion-avatar">
                        <img src="${user.photo_url}" alt="${user.name}">
                    </div>
                    <div class="suggestion-info">
                        <div class="suggestion-name">${user.name}</div>
                        <div class="suggestion-skills">
                            ${user.offeredSkill.slice(0, 3).map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                suggestionItem.addEventListener('click', function() {
                    document.getElementById('searchInput').value = user.name;
                    document.getElementById('searchForm').submit();
                });
                
                searchSuggestions.appendChild(suggestionItem);
            });
            
            // Add "View all results" option
            const viewAllItem = document.createElement('div');
            viewAllItem.className = 'suggestion-item view-all';
            viewAllItem.innerHTML = `<i class="fas fa-search"></i> View all results for "${query}"`;
            viewAllItem.addEventListener('click', function() {
                document.getElementById('searchForm').submit();
            });
            searchSuggestions.appendChild(viewAllItem);
            
        } else {
            searchSuggestions.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error fetching search suggestions:', error);
        searchSuggestions.style.display = 'none';
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
    
    // Initialize bookmarks
    initializeBookmarks();
    
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
        .search-suggestions {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            margin-top: 4px;
        }
        .suggestion-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s;
        }
        .suggestion-item:hover {
            background-color: #f8f9fa;
        }
        .suggestion-item.view-all {
            justify-content: center;
            color: #6366f1;
            font-weight: 500;
        }
        .suggestion-avatar img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }
        .suggestion-info {
            flex: 1;
        }
        .suggestion-name {
            font-weight: 500;
            color: #333;
        }
        .suggestion-skills {
            display: flex;
            gap: 4px;
            margin-top: 4px;
            flex-wrap: wrap;
        }
        .skill-badge {
            background: #e0e7ff;
            color: #4f46e5;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
        }
        .search-tips {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            color: #6b7280;
            font-size: 14px;
        }
        .tip-icon {
            color: #f59e0b;
        }
        .search-results-info {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
        }
        .results-count {
            font-weight: 700;
            font-size: 1.2em;
        }
        .search-query {
            font-weight: 600;
            color: #fef3c7;
        }
    `;
    document.head.appendChild(style);
}

console.log("🎉 Enhanced SkillSwap module loaded!");