// Indian cities and states data
const indianCities = [
    { city: "Mumbai", state: "Maharashtra" },
    { city: "Delhi", state: "Delhi" },
    { city: "Bangalore", state: "Karnataka" },
    { city: "Hyderabad", state: "Telangana" },
    { city: "Ahmedabad", state: "Gujarat" },
    { city: "Chennai", state: "Tamil Nadu" },
    { city: "Kolkata", state: "West Bengal" },
    { city: "Surat", state: "Gujarat" },
    { city: "Pune", state: "Maharashtra" },
    { city: "Jaipur", state: "Rajasthan" },
    { city: "Lucknow", state: "Uttar Pradesh" },
    { city: "Kanpur", state: "Uttar Pradesh" },
    { city: "Nagpur", state: "Maharashtra" },
    { city: "Indore", state: "Madhya Pradesh" },
    { city: "Thane", state: "Maharashtra" },
    { city: "Bhopal", state: "Madhya Pradesh" },
    { city: "Visakhapatnam", state: "Andhra Pradesh" },
    { city: "Pimpri-Chinchwad", state: "Maharashtra" },
    { city: "Patna", state: "Bihar" },
    { city: "Vadodara", state: "Gujarat" },
    { city: "Ghaziabad", state: "Uttar Pradesh" },
    { city: "Ludhiana", state: "Punjab" },
    { city: "Agra", state: "Uttar Pradesh" },
    { city: "Nashik", state: "Maharashtra" },
    { city: "Faridabad", state: "Haryana" },
    { city: "Meerut", state: "Uttar Pradesh" },
    { city: "Rajkot", state: "Gujarat" },
    { city: "Kalyan-Dombivli", state: "Maharashtra" },
    { city: "Vasai-Virar", state: "Maharashtra" },
    { city: "Varanasi", state: "Uttar Pradesh" },
    { city: "Srinagar", state: "Jammu and Kashmir" },
    { city: "Aurangabad", state: "Maharashtra" },
    { city: "Dhanbad", state: "Jharkhand" },
    { city: "Amritsar", state: "Punjab" },
    { city: "Navi Mumbai", state: "Maharashtra" },
    { city: "Allahabad", state: "Uttar Pradesh" },
    { city: "Ranchi", state: "Jharkhand" },
    { city: "Howrah", state: "West Bengal" },
    { city: "Coimbatore", state: "Tamil Nadu" },
    { city: "Jabalpur", state: "Madhya Pradesh" },
    { city: "Gwalior", state: "Madhya Pradesh" },
    { city: "Vijayawada", state: "Andhra Pradesh" },
    { city: "Jodhpur", state: "Rajasthan" },
    { city: "Madurai", state: "Tamil Nadu" },
    { city: "Raipur", state: "Chhattisgarh" },
    { city: "Kota", state: "Rajasthan" },
    { city: "Chandigarh", state: "Chandigarh" },
    { city: "Guwahati", state: "Assam" }
];

class ProfileManager {
    constructor() {
        this.cityInput = document.getElementById('cityInput');
        this.stateInput = document.getElementById('stateInput');
        this.citySuggestions = document.getElementById('citySuggestions');
        this.autoDetectBtn = document.getElementById('autoDetectLocation');
        this.locationDisplay = document.getElementById('locationDisplay');
        this.visibilityInput = document.getElementById('visibilityInput');
        this.photoUrlInput = document.getElementById('photoUrlInput');
        this.profileImage = document.getElementById('profileImage');
        
        this.initEventListeners();
        this.updateSocialIcons();
    }

    initEventListeners() {
        // City input with autocomplete
        this.cityInput.addEventListener('input', this.handleCityInput.bind(this));
        this.cityInput.addEventListener('focus', this.handleCityInput.bind(this));
        
        // Auto-detect location
        this.autoDetectBtn.addEventListener('click', this.autoDetectLocation.bind(this));
        
        // Visibility toggle
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.addEventListener('click', this.handleVisibilityToggle.bind(this));
        });
        
        // Profile photo URL change
        this.photoUrlInput.addEventListener('change', this.updateProfileImage.bind(this));
        this.photoUrlInput.addEventListener('blur', this.updateProfileImage.bind(this));
        
        // Social links input
        document.querySelectorAll('input[name="linkedin"], input[name="twitter"], input[name="instagram"], input[name="github"]')
            .forEach(input => {
                input.addEventListener('blur', this.updateSocialIcons.bind(this));
            });
        
        // Click outside to close suggestions
        document.addEventListener('click', this.handleClickOutside.bind(this));
        
        // Profile image click to upload
        document.querySelector('.profile-image-container').addEventListener('click', () => {
            this.photoUrlInput.focus();
        });
    }

    handleCityInput(e) {
        const value = e.target.value.trim();
        
        if (value.length < 1) {
            this.hideSuggestions();
            return;
        }
        
        const suggestions = this.getCitySuggestions(value);
        this.showSuggestions(suggestions);
    }

    getCitySuggestions(query) {
        const lowerQuery = query.toLowerCase();
        return indianCities.filter(cityObj => 
            cityObj.city.toLowerCase().includes(lowerQuery) ||
            cityObj.state.toLowerCase().includes(lowerQuery)
        ).slice(0, 8); // Limit to 8 suggestions
    }

    showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.citySuggestions.innerHTML = suggestions.map(cityObj => `
            <div class="suggestion-item" data-city="${cityObj.city}" data-state="${cityObj.state}">
                <span class="suggestion-city">${cityObj.city}</span>
                <span class="suggestion-state">${cityObj.state}</span>
            </div>
        `).join('');
        
        this.citySuggestions.style.display = 'block';
        
        // Add click listeners to suggestion items
        this.citySuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const city = e.currentTarget.dataset.city;
                const state = e.currentTarget.dataset.state;
                this.selectCity(city, state);
            });
        });
    }

    hideSuggestions() {
        this.citySuggestions.style.display = 'none';
    }

    selectCity(city, state) {
        this.cityInput.value = city;
        this.stateInput.value = state;
        this.hideSuggestions();
        this.updateLocationDisplay();
    }

    updateLocationDisplay() {
        if (this.cityInput.value && this.stateInput.value) {
            this.locationDisplay.innerHTML = `
                <span><i class="fas fa-check-circle"></i> ${this.cityInput.value}, ${this.stateInput.value}</span>
            `;
        } else {
            this.locationDisplay.innerHTML = '';
        }
    }

    handleClickOutside(e) {
        if (!this.cityInput.contains(e.target) && !this.citySuggestions.contains(e.target)) {
            this.hideSuggestions();
        }
    }

    async autoDetectLocation() {
        this.autoDetectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
        this.autoDetectBtn.disabled = true;
        
        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser.');
            }
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });
            
            const { latitude, longitude } = position.coords;
            const location = await this.reverseGeocode(latitude, longitude);
            
            if (location) {
                this.cityInput.value = location.city;
                this.stateInput.value = location.state;
                this.updateLocationDisplay();
                this.showNotification('Location detected successfully!', 'success');
            } else {
                throw new Error('Could not determine city from coordinates.');
            }
            
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showNotification(
                error.message || 'Unable to detect location. Please enter manually.', 
                'error'
            );
        } finally {
            this.autoDetectBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Auto Detect';
            this.autoDetectBtn.disabled = false;
        }
    }

    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            
            const data = await response.json();
            
            if (data.city && data.principalSubdivision) {
                return {
                    city: data.city,
                    state: data.principalSubdivision
                };
            }
            
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    }

    handleVisibilityToggle(e) {
        const selectedValue = e.currentTarget.dataset.value;
        
        // Update active state
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Update hidden input
        this.visibilityInput.value = selectedValue;
    }

    updateProfileImage() {
        const url = this.photoUrlInput.value.trim();
        if (url) {
            this.profileImage.src = url;
            this.profileImage.onerror = () => {
                this.showNotification('Failed to load image from URL. Please check the link.', 'error');
                this.profileImage.src = '/static/default-profile.png';
            };
        }
    }

    updateSocialIcons() {
        const linkedin = document.querySelector('input[name="linkedin"]').value;
        const twitter = document.querySelector('input[name="twitter"]').value;
        const instagram = document.querySelector('input[name="instagram"]').value;
        const github = document.querySelector('input[name="github"]').value;
        
        let iconsHTML = '';
        
        if (linkedin || twitter || instagram || github) {
            iconsHTML = '<div class="social-icons">';
            
            if (linkedin) {
                iconsHTML += `<a href="${linkedin}" target="_blank" class="social-icon linkedin">
                    <i class="fab fa-linkedin"></i>
                </a>`;
            }
            
            if (twitter) {
                iconsHTML += `<a href="${twitter}" target="_blank" class="social-icon twitter">
                    <i class="fab fa-twitter"></i>
                </a>`;
            }
            
            if (instagram) {
                iconsHTML += `<a href="${instagram}" target="_blank" class="social-icon instagram">
                    <i class="fab fa-instagram"></i>
                </a>`;
            }
            
            if (github) {
                iconsHTML += `<a href="${github}" target="_blank" class="social-icon github">
                    <i class="fab fa-github"></i>
                </a>`;
            }
            
            iconsHTML += '</div>';
        }
        
        document.getElementById('socialIconsDisplay').innerHTML = iconsHTML;
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
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
});

// Form submission handling
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const saveBtn = this.querySelector('.btn-save');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    try {
        // Simulate API call - replace with actual Firebase integration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        const profileManager = new ProfileManager();
        profileManager.showNotification('Profile updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving profile:', error);
        const profileManager = new ProfileManager();
        profileManager.showNotification('Error saving profile. Please try again.', 'error');
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
});