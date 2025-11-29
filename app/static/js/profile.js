// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS8tGustKzem7u8U5ntcLMimgLJC_fQWI",
  authDomain: "skillswap-21922.firebaseapp.com",
  projectId: "skillswap-21922",
  storageBucket: "skillswap-21922.firebasestorage.app",
  messagingSenderId: "942449711732",
  appId: "1:942449711732:web:ed1ac7c996deb34b998f21",
  measurementId: "G-DL61KXD2YR"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

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
        this.isEditMode = false;
        this.cloudinaryWidget = null;
        this.currentUser = null;
        this.userData = {};
        
        // Form elements
        this.cityInput = document.getElementById('cityInput');
        this.stateInput = document.getElementById('stateInput');
        this.citySuggestions = document.getElementById('citySuggestions');
        this.autoDetectBtn = document.getElementById('autoDetectLocation');
        this.locationDisplay = document.getElementById('locationDisplay');
        this.visibilityInput = document.getElementById('visibilityInput');
        this.photoUrlInput = document.getElementById('photoUrlInput');
        this.profileImage = document.getElementById('profileImage');
        
        // Skills elements
        this.offeredSkillInput = document.getElementById('offeredSkillInput');
        this.offeredSkillSuggestions = document.getElementById('offeredSkillSuggestions');
        this.offeredSkillsTags = document.getElementById('offeredSkillsTags');
        this.offeredSkillHidden = document.getElementById('offeredSkillHidden');
        
        this.requestedSkillInput = document.getElementById('requestedSkillInput');
        this.requestedSkillSuggestions = document.getElementById('requestedSkillSuggestions');
        this.requestedSkillsTags = document.getElementById('requestedSkillsTags');
        this.requestedSkillHidden = document.getElementById('requestedSkillHidden');
        
        // Social media elements
        this.linkedinInput = document.getElementById('linkedinInput');
        this.twitterInput = document.getElementById('twitterInput');
        this.instagramInput = document.getElementById('instagramInput');
        this.githubInput = document.getElementById('githubInput');
        
        // Edit mode elements
        this.toggleEditBtn = document.getElementById('toggleEditBtn');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');
        this.formActions = document.getElementById('formActions');
        this.profileTitle = document.getElementById('profileTitle');
        this.profileSubtitle = document.getElementById('profileSubtitle');
        this.editModeIndicator = document.getElementById('editModeIndicator');
        this.socialInputs = document.getElementById('socialInputs');
        this.socialIconsDisplay = document.getElementById('socialIconsDisplay');
        
        // Upload elements
        this.uploadImageBtn = document.getElementById('uploadImageBtn');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.initFirebaseAuth();
    }

    async initFirebaseAuth() {
        try {
            // Wait for auth state to be determined
            await new Promise((resolve, reject) => {
                const unsubscribe = auth.onAuthStateChanged(user => {
                    unsubscribe();
                    this.currentUser = user;
                    if (user) {
                        resolve(user);
                    } else {
                        reject(new Error('No user logged in'));
                    }
                });
            });
            
            await this.loadUserData();
            this.initEventListeners();
            this.initCloudinaryWidget();
            this.updateSocialIcons();
        } catch (error) {
            console.error('Authentication error:', error);
            this.showNotification('Please log in to access your profile', 'error');
        }
    }

    async loadUserData() {
        try {
            if (!this.currentUser) {
                throw new Error('No user logged in');
            }

            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            
            if (userDoc.exists) {
                this.userData = userDoc.data();
                this.populateFormData();
            } else {
                // Create empty user document if it doesn't exist
                await db.collection('users').doc(this.currentUser.uid).set({
                    name: this.currentUser.displayName || '',
                    email: this.currentUser.email || '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                this.userData = {};
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading profile data', 'error');
        }
    }

    populateFormData() {
        // Basic information
        if (this.userData.name) {
            document.querySelector('input[name="name"]').value = this.userData.name;
        }
        
        // Location data - handle both old and new format
        if (this.userData.location) {
            // Old format: "Indore"
            this.cityInput.value = this.userData.location;
            this.stateInput.value = '';
        } else if (this.userData.city) {
            // New format: separate city and state
            this.cityInput.value = this.userData.city;
            this.stateInput.value = this.userData.state || '';
        }
        this.updateLocationDisplay();
        
        // Availability
        if (this.userData.availability) {
            document.querySelector('select[name="availability"]').value = this.userData.availability;
        }
        
        // Skills
        if (this.userData.offeredSkill) {
            this.populateSkills('offered', this.userData.offeredSkill);
        }
        if (this.userData.requestedSkill) {
            this.populateSkills('requested', this.userData.requestedSkill);
        }
        
        // Profile photo
        if (this.userData.photo_url) {
            this.profileImage.src = this.userData.photo_url;
            this.photoUrlInput.value = this.userData.photo_url;
        }
        
        // Profile visibility
        if (this.userData.profileVisibility) {
            this.visibilityInput.value = this.userData.profileVisibility;
            document.querySelectorAll('.toggle-option').forEach(option => {
                option.classList.toggle('active', option.dataset.value === this.userData.profileVisibility);
            });
        }
        
        // Social links
        if (this.userData.linkedin) {
            this.linkedinInput.value = this.userData.linkedin;
        }
        if (this.userData.twitter) {
            this.twitterInput.value = this.userData.twitter;
        }
        if (this.userData.instagram) {
            this.instagramInput.value = this.userData.instagram;
        }
        if (this.userData.github) {
            this.githubInput.value = this.userData.github;
        }
    }

    populateSkills(type, skills) {
        const tagsContainer = type === 'offered' ? this.offeredSkillsTags : this.requestedSkillsTags;
        const hiddenInput = type === 'offered' ? this.offeredSkillHidden : this.requestedSkillHidden;
        
        tagsContainer.innerHTML = '';
        skills.forEach(skill => {
            this.createSkillTag(type, skill);
        });
        hiddenInput.value = skills.join(',');
    }

    initEventListeners() {
        // Edit mode toggle
        this.toggleEditBtn.addEventListener('click', this.toggleEditMode.bind(this));
        this.cancelEditBtn.addEventListener('click', this.cancelEdit.bind(this));
        
        // City input with autocomplete
        this.cityInput.addEventListener('input', this.handleCityInput.bind(this));
        this.cityInput.addEventListener('focus', this.handleCityInput.bind(this));
        
        // Auto-detect location
        this.autoDetectBtn.addEventListener('click', this.autoDetectLocation.bind(this));
        
        // Visibility toggle
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.addEventListener('click', this.handleVisibilityToggle.bind(this));
        });
        
        // Skills input handlers
        this.offeredSkillInput.addEventListener('input', this.handleSkillInput.bind(this, 'offered'));
        this.offeredSkillInput.addEventListener('focus', this.handleSkillInput.bind(this, 'offered'));
        this.offeredSkillInput.addEventListener('keydown', this.handleSkillKeydown.bind(this, 'offered'));
        
        this.requestedSkillInput.addEventListener('input', this.handleSkillInput.bind(this, 'requested'));
        this.requestedSkillInput.addEventListener('focus', this.handleSkillInput.bind(this, 'requested'));
        this.requestedSkillInput.addEventListener('keydown', this.handleSkillKeydown.bind(this, 'requested'));
        
        // Social media input handlers
        [this.linkedinInput, this.twitterInput, this.instagramInput, this.githubInput].forEach(input => {
            input.addEventListener('blur', (e) => {
                this.formatSocialUrl(e.target);
                this.updateSocialIcons();
            });
        });
        
        // Upload image button
        this.uploadImageBtn.addEventListener('click', this.openCloudinaryWidget.bind(this));
        
        // Click outside to close suggestions
        document.addEventListener('click', this.handleClickOutside.bind(this));
        
        // Profile image click to upload (only in edit mode)
        document.querySelector('.profile-image-container').addEventListener('click', () => {
            if (this.isEditMode) {
                this.openCloudinaryWidget();
            }
        });
        
        // Form submission
        document.getElementById('profileForm').addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        // Toggle form fields
        const formElements = document.querySelectorAll('input, select');
        formElements.forEach(el => {
            if (el.id !== 'visibilityInput' && el.type !== 'hidden' && el.name !== 'photo_url') {
                el.disabled = !this.isEditMode;
            }
        });
        
        // Toggle buttons
        this.autoDetectBtn.disabled = !this.isEditMode;
        this.uploadImageBtn.disabled = !this.isEditMode;
        
        // Toggle UI elements
        if (this.isEditMode) {
            this.profileTitle.textContent = 'Edit Profile';
            this.profileSubtitle.textContent = 'Update your profile information';
            this.editModeIndicator.style.display = 'inline-block';
            this.formActions.style.display = 'flex';
            this.toggleEditBtn.innerHTML = '<i class="fas fa-eye"></i> View Profile';
            this.socialInputs.style.display = 'block';
            this.socialIconsDisplay.style.display = 'none';
        } else {
            this.profileTitle.textContent = 'Profile';
            this.profileSubtitle.textContent = 'View and manage your profile information';
            this.editModeIndicator.style.display = 'none';
            this.formActions.style.display = 'none';
            this.toggleEditBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            this.socialInputs.style.display = 'none';
            this.socialIconsDisplay.style.display = 'block';
            this.updateSocialIcons();
        }
    }

    cancelEdit() {
        // Reload original data
        this.populateFormData();
        this.toggleEditMode();
        this.showNotification('Changes discarded', 'info');
    }

    handleCityInput(e) {
        const value = e.target.value.trim();
        
        if (value.length < 1) {
            this.hideSuggestions(this.citySuggestions);
            return;
        }
        
        const suggestions = this.getCitySuggestions(value);
        this.showSuggestions(this.citySuggestions, suggestions, (city, state) => {
            this.selectCity(city, state);
        });
    }

    getCitySuggestions(query) {
        const lowerQuery = query.toLowerCase();
        return indianCities.filter(cityObj => 
            cityObj.city.toLowerCase().includes(lowerQuery) ||
            cityObj.state.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    }

    handleSkillInput(type, e) {
        const value = e.target.value.trim();
        const suggestionsContainer = type === 'offered' ? 
            this.offeredSkillSuggestions : this.requestedSkillSuggestions;
        
        if (value.length < 1) {
            this.hideSuggestions(suggestionsContainer);
            return;
        }
        
        const suggestions = this.getSkillSuggestions(value);
        this.showSkillSuggestions(suggestionsContainer, suggestions, (skill) => {
            this.addSkill(type, skill);
            e.target.value = '';
            this.hideSuggestions(suggestionsContainer);
        });
    }

    handleSkillKeydown(type, e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value && skillsData.includes(value)) {
                this.addSkill(type, value);
                e.target.value = '';
                this.hideSuggestions(type === 'offered' ? this.offeredSkillSuggestions : this.requestedSkillSuggestions);
            }
        }
    }

    getSkillSuggestions(query) {
        const lowerQuery = query.toLowerCase();
        return skillsData.filter(skill => 
            skill.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    }

    showSuggestions(container, suggestions, onSelect) {
        if (suggestions.length === 0) {
            this.hideSuggestions(container);
            return;
        }
        
        container.innerHTML = suggestions.map(cityObj => `
            <div class="suggestion-item" data-city="${cityObj.city}" data-state="${cityObj.state}">
                <span class="suggestion-city">${cityObj.city}</span>
                <span class="suggestion-state">${cityObj.state}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const city = e.currentTarget.dataset.city;
                const state = e.currentTarget.dataset.state;
                onSelect(city, state);
            });
        });
    }

    showSkillSuggestions(container, suggestions, onSelect) {
        if (suggestions.length === 0) {
            this.hideSuggestions(container);
            return;
        }
        
        container.innerHTML = suggestions.map(skill => `
            <div class="suggestion-item" data-skill="${skill}">
                <span>${skill}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const skill = e.currentTarget.dataset.skill;
                onSelect(skill);
            });
        });
    }

    hideSuggestions(container) {
        container.style.display = 'none';
    }

    selectCity(city, state) {
        this.cityInput.value = city;
        this.stateInput.value = state;
        this.hideSuggestions(this.citySuggestions);
        this.updateLocationDisplay();
    }

    addSkill(type, skill) {
        const tagsContainer = type === 'offered' ? this.offeredSkillsTags : this.requestedSkillsTags;
        const hiddenInput = type === 'offered' ? this.offeredSkillHidden : this.requestedSkillHidden;
        
        // Check if skill already exists
        const existingSkills = hiddenInput.value ? hiddenInput.value.split(',') : [];
        if (existingSkills.includes(skill)) {
            this.showNotification('Skill already added', 'info');
            return;
        }
        
        this.createSkillTag(type, skill);
        
        // Update hidden input
        existingSkills.push(skill);
        hiddenInput.value = existingSkills.join(',');
    }

    createSkillTag(type, skill) {
        const tagsContainer = type === 'offered' ? this.offeredSkillsTags : this.requestedSkillsTags;
        
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.dataset.skill = skill;
        skillTag.innerHTML = `
            ${skill}
            <span class="remove-skill">&times;</span>
        `;
        
        tagsContainer.appendChild(skillTag);
        
        // Add remove event listener
        skillTag.querySelector('.remove-skill').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeSkill(type, skill);
        });
    }

    removeSkill(type, skill) {
        const tagsContainer = type === 'offered' ? this.offeredSkillsTags : this.requestedSkillsTags;
        const hiddenInput = type === 'offered' ? this.offeredSkillHidden : this.requestedSkillHidden;
        
        // Remove from DOM
        const skillTag = tagsContainer.querySelector(`.skill-tag[data-skill="${skill}"]`);
        if (skillTag) {
            skillTag.remove();
        }
        
        // Update hidden input
        const skills = hiddenInput.value ? hiddenInput.value.split(',') : [];
        const index = skills.indexOf(skill);
        if (index > -1) {
            skills.splice(index, 1);
            hiddenInput.value = skills.join(',');
        }
    }

    updateLocationDisplay() {
        if (this.cityInput.value && this.stateInput.value) {
            this.locationDisplay.innerHTML = `
                <span><i class="fas fa-check-circle"></i> ${this.cityInput.value}, ${this.stateInput.value}</span>
            `;
        } else if (this.cityInput.value) {
            this.locationDisplay.innerHTML = `
                <span><i class="fas fa-check-circle"></i> ${this.cityInput.value}</span>
            `;
        } else {
            this.locationDisplay.innerHTML = '';
        }
    }

    handleClickOutside(e) {
        if (!this.cityInput.contains(e.target) && !this.citySuggestions.contains(e.target)) {
            this.hideSuggestions(this.citySuggestions);
        }
        if (!this.offeredSkillInput.contains(e.target) && !this.offeredSkillSuggestions.contains(e.target)) {
            this.hideSuggestions(this.offeredSkillSuggestions);
        }
        if (!this.requestedSkillInput.contains(e.target) && !this.requestedSkillSuggestions.contains(e.target)) {
            this.hideSuggestions(this.requestedSkillSuggestions);
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
        
        document.querySelectorAll('.toggle-option').forEach(option => {
            option.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        this.visibilityInput.value = selectedValue;
    }

    formatSocialUrl(input) {
        const value = input.value.trim();
        if (!value) return;
        
        let url = value;
        const platform = input.name;
        
        // If it's just a username, format it as a full URL
        if (!value.startsWith('http')) {
            switch(platform) {
                case 'linkedin':
                    url = `https://linkedin.com/in/${value}`;
                    break;
                case 'twitter':
                    url = `https://twitter.com/${value}`;
                    break;
                case 'instagram':
                    url = `https://instagram.com/${value}`;
                    break;
                case 'github':
                    url = `https://github.com/${value}`;
                    break;
            }
            input.value = url;
        }
    }

    updateSocialIcons() {
        const linkedin = this.linkedinInput.value;
        const twitter = this.twitterInput.value;
        const instagram = this.instagramInput.value;
        const github = this.githubInput.value;
        
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
        } else {
            iconsHTML = `
                <div class="no-social-links">
                    <i class="fas fa-share-alt"></i>
                    <p>No social links added yet</p>
                </div>
            `;
        }
        
        this.socialIconsDisplay.innerHTML = iconsHTML;
    }

    initCloudinaryWidget() {
        this.cloudinaryWidget = cloudinary.createUploadWidget({
            cloudName: 'dtarhtz5w',
            uploadPreset: 'skillswap_assets',
            folder: 'Media Library/Assets',
            sources: ['local', 'url', 'camera'],
            multiple: false,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 5000000,
            showAdvancedOptions: true,
            cropping: true,
            croppingAspectRatio: 1,
            croppingDefaultSelectionRatio: 0.9,
            showPoweredBy: false,
            styles: {
                palette: {
                    window: "#FFFFFF",
                    sourceBg: "#F4F4F5",
                    windowBorder: "#90a0b3",
                    tabIcon: "#4361ee",
                    inactiveTabIcon: "#69778A",
                    menuIcons: "#4361ee",
                    link: "#4361ee",
                    action: "#4361ee",
                    inProgress: "#4361ee",
                    complete: "#4cc9f0",
                    error: "#f72585",
                    textDark: "#212529",
                    textLight: "#FFFFFF"
                }
            }
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                this.handleImageUpload(result.info);
            } else if (error) {
                this.showNotification('Error uploading image: ' + error.message, 'error');
            }
        });
    }

    openCloudinaryWidget() {
        if (this.cloudinaryWidget) {
            this.cloudinaryWidget.open();
        }
    }

    handleImageUpload(result) {
        this.uploadProgress.style.display = 'flex';
        this.progressFill.style.width = '100%';
        this.progressText.textContent = '100%';
        
        // Update profile image and URL field
        this.profileImage.src = result.secure_url;
        this.photoUrlInput.value = result.secure_url;
        
        setTimeout(() => {
            this.uploadProgress.style.display = 'none';
            this.progressFill.style.width = '0%';
            this.progressText.textContent = '0%';
        }, 2000);
        
        this.showNotification('Profile image uploaded successfully!', 'success');
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const saveBtn = e.target.querySelector('.btn-save');
        const originalText = saveBtn.innerHTML;
        
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveBtn.disabled = true;
        
        try {
            // Convert form data to object
            const data = {
                name: formData.get('name'),
                city: formData.get('city'),
                state: formData.get('state'),
                availability: formData.get('availability'),
                photo_url: formData.get('photo_url'),
                profileVisibility: formData.get('visibility'),
                linkedin: formData.get('linkedin'),
                twitter: formData.get('twitter'),
                instagram: formData.get('instagram'),
                github: formData.get('github'),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Handle skills arrays
            const offeredSkill = formData.get('offeredSkill');
            const requestedSkill = formData.get('requestedSkill');
            
            data.offeredSkill = offeredSkill ? offeredSkill.split(',').filter(skill => skill.trim()) : [];
            data.requestedSkill = requestedSkill ? requestedSkill.split(',').filter(skill => skill.trim()) : [];
            
            // Save to Firebase
            await db.collection('users').doc(this.currentUser.uid).set(data, { merge: true });
            
            // Update local user data
            this.userData = { ...this.userData, ...data };
            
            // Show success message and exit edit mode
            this.showNotification('Profile updated successfully!', 'success');
            this.toggleEditMode();
            
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showNotification('Error saving profile. Please try again.', 'error');
        } finally {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
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
    
    // Add CSS animations
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