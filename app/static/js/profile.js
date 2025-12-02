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
        this.certCloudinaryWidget = null;
        this.projectCloudinaryWidget = null;
        this.currentUser = null;
        this.userData = {};

        this.degreesData = null;
        this.specializationsData = null;
        this.jobTitlesData = null;
        this.employmentTypesData = null;
        this.indianCollegesData = null;
        this.currentCertItem = null;
        this.currentProjectItem = null;
        this.currentEducationItem = null;
        
        // Initialize all elements
        this.initializeElements();
        
        this.initFirebaseAuth();
    }

    initializeElements() {
        // Form elements
        this.cityInput = document.getElementById('cityInput');
        this.stateInput = document.getElementById('stateInput');
        this.countryInput = document.getElementById('countryInput');
        this.citySuggestions = document.getElementById('citySuggestions');
        this.autoDetectBtn = document.getElementById('autoDetectLocation');
        this.locationDisplay = document.getElementById('locationDisplay');
        
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
        
        // Add buttons
        this.addLanguageBtn = document.getElementById('addLanguageBtn');
        this.addEducationBtn = document.getElementById('addEducationBtn');
        this.addExperienceBtn = document.getElementById('addExperienceBtn');
        this.addCertificationBtn = document.getElementById('addCertificationBtn');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.addAchievementBtn = document.getElementById('addAchievementBtn');
        this.addSkillBtn = document.getElementById('addSkillBtn');
    }

    async loadDataSets() {
        try {
            // Load degrees data
            const degreesResponse = await fetch('/static/data/degrees.json');
            this.degreesData = await degreesResponse.json();
            
            // Load specializations data
            const specializationsResponse = await fetch('/static/data/specializations.json');
            this.specializationsData = await specializationsResponse.json();
            
            // Load job titles data
            const jobTitlesResponse = await fetch('/static/data/job-titles.json');
            this.jobTitlesData = await jobTitlesResponse.json();
            
            // Load employment types data
            const employmentTypesResponse = await fetch('/static/data/employment-types.json');
            this.employmentTypesData = await employmentTypesResponse.json();
            
            console.log('Datasets loaded successfully');
        } catch (error) {
            console.error('Error loading datasets:', error);
            // Create fallback data if files don't exist
            this.createFallbackDatasets();
        }
    }

    createFallbackDatasets() {
        // Fallback degrees data
        this.degreesData = {
            degree_types: {
                undergraduate: [
                    { value: "BA", label: "BA – Bachelor of Arts" },
                    { value: "B.Sc", label: "B.Sc – Bachelor of Science" },
                    { value: "B.Com", label: "B.Com – Bachelor of Commerce" }
                ],
                postgraduate: [
                    { value: "MA", label: "MA – Master of Arts" },
                    { value: "M.Sc", label: "M.Sc – Master of Science" },
                    { value: "MBA", label: "MBA – Master of Business Administration" }
                ]
            }
        };

        // Fallback specializations
        this.specializationsData = {
            specializations: [
                "Computer Science", "Electrical Engineering", "Mechanical Engineering",
                "Civil Engineering", "Business Administration", "Commerce",
                "Arts", "Science", "Medicine", "Law"
            ]
        };

        // Fallback job titles
        this.jobTitlesData = {
            job_titles: [
                "Software Developer", "Software Engineer", "Web Developer",
                "Data Analyst", "Business Analyst", "Project Manager",
                "Product Manager", "UX Designer", "Graphic Designer",
                "Marketing Manager", "Sales Executive", "HR Manager"
            ]
        };

        // Fallback employment types
        this.employmentTypesData = {
            employment_types: [
                "Full-time", "Part-time", "Contract", "Internship", 
                "Freelance", "Remote", "Self-employed"
            ]
        };
    }

    async searchIndianColleges(query) {
        try {
            // First try to fetch from our own API endpoint
            const response = await fetch(`/api/indian-colleges?q=${encodeURIComponent(query)}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    return data.colleges || [];
                }
            }
            
            // Fallback to static list if API fails
            return this.getStaticColleges(query);
            
        } catch (error) {
            console.error('Error fetching colleges:', error);
            return this.getStaticColleges(query);
        }
    }

    getStaticColleges(query) {
        const staticColleges = [
            "Indian Institute of Technology Bombay",
            "Indian Institute of Technology Delhi",
            "Indian Institute of Technology Madras",
            "Indian Institute of Technology Kanpur",
            "Indian Institute of Technology Kharagpur",
            "Indian Institute of Technology Roorkee",
            "University of Delhi",
            "University of Mumbai",
            "University of Calcutta",
            "University of Madras",
            "Anna University",
            "Jawaharlal Nehru University",
            "Banaras Hindu University",
            "University of Hyderabad",
            "University of Pune",
            "National Institute of Technology Trichy",
            "Birla Institute of Technology and Science",
            "Indian Institute of Science",
            "All India Institute of Medical Sciences",
            "Indian Statistical Institute",
            "Indian Institute of Management Ahmedabad",
            "Indian Institute of Management Bangalore",
            "Indian Institute of Management Calcutta",
            "Indian Institute of Management Lucknow",
            "Delhi Technological University",
            "Jadavpur University",
            "University of Rajasthan",
            "University of Mysore",
            "University of Kerala",
            "Panjab University"
        ];
        
        const lowerQuery = query.toLowerCase();
        return staticColleges.filter(college => 
            college.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
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
            await this.loadDataSets();
            this.initEventListeners();
            this.initCloudinaryWidget();
            this.initProjectCloudinaryWidget();
            this.updateSocialIcons();
            await this.loadSwapRequests();
            
            // Initialize enhanced UI components
            this.initEnhancedUI();
        } catch (error) {
            console.error('Authentication error:', error);
            this.showNotification('Please log in to access your profile', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    }

    initEnhancedUI() {
        // Initialize date pickers
        this.initDatePickers();
        
        // Initialize autocomplete for existing elements
        this.initCollegeAutocomplete();
        this.initJobTitleAutocomplete();
        this.initTechnologyAutocomplete();
        this.initLocationAutocomplete();
        
        // Initialize project links functionality
        this.initProjectLinks();
    }

    initDatePickers() {
        // Add calendar icons to all month inputs
        document.querySelectorAll('input[type="month"]').forEach(input => {
            const container = input.closest('.input-with-icon') || input.parentElement;
            if (container && !container.querySelector('.fa-calendar-alt')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-calendar-alt';
                container.style.position = 'relative';
                container.insertBefore(icon, input);
                
                // Add padding to input
                input.style.paddingLeft = '48px';
            }
            
            // Add click handler to open native date picker
            input.addEventListener('focus', (e) => {
                if (this.isEditMode) {
                    e.target.showPicker?.();
                }
            });
        });
    }

    initCollegeAutocomplete() {
        const collegeInputs = document.querySelectorAll('.edu-institution');
        
        collegeInputs.forEach(input => {
            let timeoutId;
            
            input.addEventListener('input', async (e) => {
                clearTimeout(timeoutId);
                const query = e.target.value.trim();
                
                if (query.length < 2) {
                    this.hideCollegeSuggestions(input);
                    return;
                }
                
                timeoutId = setTimeout(async () => {
                    const suggestions = await this.searchIndianColleges(query);
                    this.showCollegeSuggestions(input, suggestions);
                }, 300);
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideCollegeSuggestions(input);
                }, 200);
            });
            
            // Create suggestions container if not exists
            if (!input.nextElementSibling?.classList.contains('autocomplete-suggestions')) {
                const suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'autocomplete-suggestions';
                suggestionsContainer.style.display = 'none';
                input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
            }
        });
    }

    initJobTitleAutocomplete() {
        const jobTitleInputs = document.querySelectorAll('.exp-title[type="text"]');
        
        jobTitleInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                
                if (!this.jobTitlesData || query.length < 1) {
                    this.hideSuggestionsForInput(input);
                    return;
                }
                
                const suggestions = this.jobTitlesData.job_titles.filter(title =>
                    title.toLowerCase().includes(query)
                ).slice(0, 10);
                
                this.showJobTitleSuggestions(input, suggestions);
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSuggestionsForInput(input);
                }, 200);
            });
            
            // Create suggestions container if not exists
            if (!input.nextElementSibling?.classList.contains('autocomplete-suggestions')) {
                const suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'autocomplete-suggestions';
                suggestionsContainer.style.display = 'none';
                input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
            }
        });
    }

    initTechnologyAutocomplete() {
        const techInputs = document.querySelectorAll('.project-technologies, .exp-skills');
        
        techInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const lastComma = query.lastIndexOf(',');
                const currentTerm = lastComma === -1 ? query : query.substring(lastComma + 1).trim();
                
                if (currentTerm.length < 1) {
                    this.hideSuggestionsForInput(input);
                    return;
                }
                
                // Use skills data from skills-data.js
                if (window.skillsData && Array.isArray(window.skillsData)) {
                    const suggestions = window.skillsData.filter(skill =>
                        skill.toLowerCase().includes(currentTerm.toLowerCase())
                    ).slice(0, 10);
                    
                    this.showTechSuggestions(input, suggestions, (selectedSkill) => {
                        this.addTechnologyToInput(input, selectedSkill);
                    });
                }
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSuggestionsForInput(input);
                }, 200);
            });
            
            // Create suggestions container if not exists
            if (!input.nextElementSibling?.classList.contains('autocomplete-suggestions')) {
                const suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'autocomplete-suggestions';
                suggestionsContainer.style.display = 'none';
                input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
            }
        });
    }

    initLocationAutocomplete() {
        const locationInputs = document.querySelectorAll('.edu-location, .exp-location');
        
        locationInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                
                if (value.length < 1) {
                    this.hideSuggestionsForInput(input);
                    return;
                }
                
                const suggestions = this.getCitySuggestions(value);
                this.showLocationSuggestions(input, suggestions);
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    this.hideSuggestionsForInput(input);
                }, 200);
            });
            
            // Create suggestions container if not exists
            if (!input.nextElementSibling?.classList.contains('autocomplete-suggestions')) {
                const suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'autocomplete-suggestions';
                suggestionsContainer.style.display = 'none';
                input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
            }
        });
    }

    initProjectLinks() {
        // Initialize existing project link add buttons
        document.querySelectorAll('.btn-add-project-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectItem = e.target.closest('.project-edit');
                this.addProjectLink(projectItem);
            });
        });
        
        // Initialize existing remove link buttons
        document.querySelectorAll('.btn-remove-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.project-link-item').remove();
            });
        });
    }

    showCollegeSuggestions(input, suggestions) {
        const container = input.nextElementSibling;
        if (!container || !container.classList.contains('autocomplete-suggestions')) return;
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(college => `
            <div class="suggestion-item" data-value="${college}">
                <span class="suggestion-text">${college}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                input.value = e.currentTarget.dataset.value;
                container.style.display = 'none';
                input.focus();
            });
        });
    }

    showJobTitleSuggestions(input, suggestions) {
        const container = input.nextElementSibling;
        if (!container || !container.classList.contains('autocomplete-suggestions')) return;
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(title => `
            <div class="suggestion-item" data-value="${title}">
                <span class="suggestion-text">${title}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                input.value = e.currentTarget.dataset.value;
                container.style.display = 'none';
                input.focus();
            });
        });
    }

    showTechSuggestions(input, suggestions, onSelect) {
        const container = input.nextElementSibling;
        if (!container || !container.classList.contains('autocomplete-suggestions')) return;
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
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
                onSelect(e.currentTarget.dataset.skill);
                container.style.display = 'none';
                input.focus();
            });
        });
    }

    showLocationSuggestions(input, suggestions) {
        const container = input.nextElementSibling;
        if (!container || !container.classList.contains('autocomplete-suggestions')) return;
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(cityObj => `
            <div class="suggestion-item" data-value="${cityObj.city}, ${cityObj.state}">
                <span class="suggestion-city">${cityObj.city}</span>
                <span class="suggestion-state">${cityObj.state}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                input.value = e.currentTarget.dataset.value;
                container.style.display = 'none';
                input.focus();
            });
        });
    }

    addTechnologyToInput(input, technology) {
        const currentValue = input.value.trim();
        const technologies = currentValue.split(',').map(t => t.trim()).filter(t => t);
        
        // Check if technology already exists
        if (technologies.includes(technology)) {
            return;
        }
        
        // Add new technology
        if (currentValue) {
            input.value = currentValue + ', ' + technology;
        } else {
            input.value = technology;
        }
        
        // Focus on input and move cursor to end
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }

    hideCollegeSuggestions(input) {
        const container = input.nextElementSibling;
        if (container && container.classList.contains('autocomplete-suggestions')) {
            container.style.display = 'none';
        }
    }

    hideSuggestionsForInput(input) {
        const container = input.nextElementSibling;
        if (container && container.classList.contains('autocomplete-suggestions')) {
            container.style.display = 'none';
        }
    }

    getCitySuggestions(query) {
        const lowerQuery = query.toLowerCase();
        return indianCities.filter(cityObj => 
            cityObj.city.toLowerCase().includes(lowerQuery) ||
            cityObj.state.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    }

    async loadSwapRequests() {
        try {
            if (!this.currentUser) return;
            
            const swapRequests = await db.collection('swaps')
                .where('toUserId', '==', this.currentUser.uid)
                .where('status', '==', 'pending')
                .get();
            
            const requestBadge = document.getElementById('requestBadge');
            if (requestBadge) {
                requestBadge.textContent = swapRequests.size;
                requestBadge.style.display = swapRequests.size > 0 ? 'inline-block' : 'none';
            }
        } catch (error) {
            console.error('Error loading swap requests:', error);
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
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    // Initialize arrays for new sections
                    languages: [],
                    education: [],
                    experience: [],
                    certifications: [],
                    projects: [],
                    achievements: [],
                    skills: []
                });
                this.userData = {};
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    populateFormData() {
        // Personal Information
        if (this.userData.name) {
            document.querySelector('input[name="name"]').value = this.userData.name;
        }
        
        if (this.userData.headline) {
            document.querySelector('input[name="headline"]').value = this.userData.headline;
        }
        
        if (this.userData.about) {
            document.querySelector('textarea[name="about"]').value = this.userData.about;
        }
        
        // Location data
        if (this.userData.location) {
            this.cityInput.value = this.userData.location;
            this.stateInput.value = '';
        } else if (this.userData.city) {
            this.cityInput.value = this.userData.city;
            this.stateInput.value = this.userData.state || '';
            this.countryInput.value = this.userData.country || 'India';
        }
        this.updateLocationDisplay();
        
        // Availability
        if (this.userData.availability) {
            document.querySelector('select[name="availability"]').value = this.userData.availability;
        }
        
        // Contact Information
        if (this.userData.email) {
            document.querySelector('input[name="email"]').value = this.userData.email;
        }
        
        if (this.userData.phone) {
            document.querySelector('input[name="phone"]').value = this.userData.phone;
        }
        
        if (this.userData.website) {
            document.querySelector('input[name="website"]').value = this.userData.website;
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
            document.getElementById('profileImage').src = this.userData.photo_url;
            this.photoUrlInput.value = this.userData.photo_url;
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
        
        // Languages
        this.populateLanguages();
        
        // Education
        this.populateEducation();
        
        // Experience
        this.populateExperience();
        
        // Certifications
        this.populateCertifications();
        
        // Projects
        this.populateProjects();
        
        // Achievements
        this.populateAchievements();
        
        // Additional Skills
        this.populateAdditionalSkills();
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

    populateLanguages() {
        const container = document.getElementById('languagesContainer');
        container.innerHTML = '';
        
        if (this.userData.languages && Array.isArray(this.userData.languages)) {
            this.userData.languages.forEach((lang, index) => {
                const template = document.getElementById('languageTemplate').content.cloneNode(true);
                const item = template.querySelector('.language-item');
                item.dataset.index = index;
                
                const nameInput = item.querySelector('.language-name');
                const proficiencySelect = item.querySelector('.language-proficiency');
                
                nameInput.value = lang.language || '';
                proficiencySelect.value = lang.proficiency || 'Beginner';
                
                container.appendChild(item);
            });
        }
    }

    populateEducation() {
        const container = document.getElementById('educationContainer');
        container.innerHTML = '';
        
        if (this.userData.education && Array.isArray(this.userData.education)) {
            this.userData.education.forEach((edu, index) => {
                this.createEducationItem(edu, index, container);
            });
        }
    }

    populateExperience() {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = '';
        
        if (this.userData.experience && Array.isArray(this.userData.experience)) {
            this.userData.experience.forEach((exp, index) => {
                this.createExperienceItem(exp, index, container);
            });
        }
    }

    populateCertifications() {
        const container = document.getElementById('certificationsContainer');
        container.innerHTML = '';
        
        if (this.userData.certifications && Array.isArray(this.userData.certifications)) {
            this.userData.certifications.forEach((cert, index) => {
                this.createCertificationItem(cert, index, container);
            });
        }
    }

    populateProjects() {
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        
        if (this.userData.projects && Array.isArray(this.userData.projects)) {
            this.userData.projects.forEach((project, index) => {
                this.createProjectItem(project, index, container);
            });
        }
    }

    populateAchievements() {
        const container = document.getElementById('achievementsContainer');
        container.innerHTML = '';
        
        if (this.userData.achievements && Array.isArray(this.userData.achievements)) {
            this.userData.achievements.forEach((achievement, index) => {
                this.createAchievementItem(achievement, index, container);
            });
        }
    }

    populateAdditionalSkills() {
        const container = document.getElementById('skillsContainer');
        container.innerHTML = '';
        
        if (this.userData.skills && Array.isArray(this.userData.skills)) {
            this.userData.skills.forEach((skill, index) => {
                this.createSkillItem(skill, index, container);
            });
        }
    }

    createEducationItem(edu, index, container) {
        const item = document.createElement('div');
        item.className = 'education-item enhanced-item';
        item.dataset.index = index;
        
        // Create view mode
        const viewView = document.createElement('div');
        viewView.className = 'education-view';
        
        let details = `${edu.start_date || ''} - `;
        details += edu.current ? 'Present' : (edu.end_date || '');
        if (edu.grade) details += ` | Grade: ${edu.grade}`;
        
        viewView.innerHTML = `
            <h4>${edu.degree_type || ''} ${edu.field_of_study ? 'in ' + edu.field_of_study : ''}</h4>
            <p class="institution">
                <i class="fas fa-university"></i>
                ${edu.institution_name || ''}
            </p>
            <p class="details">
                <i class="fas fa-calendar-alt"></i>
                ${details}
            </p>
            ${edu.location ? `<p class="location"><i class="fas fa-map-marker-alt"></i> ${edu.location}</p>` : ''}
            ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
        `;
        
        // Create edit mode
        const editView = document.createElement('div');
        editView.className = 'education-edit';
        editView.style.display = 'none';
        
        editView.innerHTML = `
            <div class="form-group enhanced">
                <label>Degree Type</label>
                <div class="select-with-icon">
                    <i class="fas fa-graduation-cap"></i>
                    <select class="edu-degree" disabled>
                        <option value="">Select Degree Type</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Specialization</label>
                <div class="select-with-icon">
                    <i class="fas fa-book"></i>
                    <select class="edu-field" disabled>
                        <option value="">Select Specialization</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Institution Name</label>
                <div class="input-with-icon">
                    <i class="fas fa-university"></i>
                    <input type="text" class="edu-institution" value="${edu.institution_name || ''}" placeholder="Search college/university..." disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Institution Type</label>
                <div class="input-with-icon">
                    <i class="fas fa-building"></i>
                    <input type="text" class="edu-institution-type" value="${edu.institution_type || ''}" placeholder="e.g., University, College" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Location</label>
                <div class="input-with-icon">
                    <i class="fas fa-map-marker-alt"></i>
                    <input type="text" class="edu-location" value="${edu.location || ''}" placeholder="City, State" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>Start Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="edu-start-date" value="${edu.start_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>End Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="edu-end-date" value="${edu.end_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="edu-current" ${edu.current ? 'checked' : ''} disabled> 
                    <span>Currently Studying</span>
                </label>
            </div>
            
            <div class="form-group enhanced">
                <label>Grade/Percentage</label>
                <div class="input-with-icon">
                    <i class="fas fa-chart-line"></i>
                    <input type="text" class="edu-grade" value="${edu.grade || ''}" placeholder="e.g., 3.8/4.0 or 85%" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2;">
                <label>Description</label>
                <div class="textarea-with-icon">
                    <i class="fas fa-info-circle"></i>
                    <textarea class="edu-description" placeholder="Additional details about your education..." rows="3" disabled>${edu.description || ''}</textarea>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2; text-align: right;">
                <button type="button" class="btn-remove-education" style="display: none;">
                    <i class="fas fa-trash"></i> Remove Education
                </button>
            </div>
        `;
        
        item.appendChild(viewView);
        item.appendChild(editView);
        container.appendChild(item);
        
        // Populate dropdowns for edit view
        this.populateEducationDropdowns(editView, edu);
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(editView);
    }

    populateEducationDropdowns(container, edu) {
        const degreeSelect = container.querySelector('.edu-degree');
        const fieldSelect = container.querySelector('.edu-field');
        
        if (this.degreesData && degreeSelect) {
            degreeSelect.innerHTML = '<option value="">Select Degree Type</option>';
            
            // Add degree categories
            Object.entries(this.degreesData.degree_types).forEach(([category, degrees]) => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
                
                degrees.forEach(degree => {
                    const option = document.createElement('option');
                    option.value = degree.value;
                    option.textContent = degree.label;
                    if (edu.degree_type && (edu.degree_type === degree.value || edu.degree_type === degree.label)) {
                        option.selected = true;
                    }
                    optgroup.appendChild(option);
                });
                
                degreeSelect.appendChild(optgroup);
            });
        }
        
        if (this.specializationsData && fieldSelect) {
            fieldSelect.innerHTML = '<option value="">Select Specialization</option>';
            
            this.specializationsData.specializations.forEach(specialization => {
                const option = document.createElement('option');
                option.value = specialization;
                option.textContent = specialization;
                if (edu.field_of_study && edu.field_of_study === specialization) {
                    option.selected = true;
                }
                fieldSelect.appendChild(option);
            });
        }
    }

    createExperienceItem(exp, index, container) {
        const item = document.createElement('div');
        item.className = 'experience-item enhanced-item';
        item.dataset.index = index;
        
        // Create view mode
        const viewView = document.createElement('div');
        viewView.className = 'experience-view';
        
        let details = `${exp.employment_type || ''} | `;
        details += `${exp.start_date || ''} - `;
        details += exp.current ? 'Present' : (exp.end_date || '');
        if (exp.location) details += ` | ${exp.location}`;
        if (exp.remote) details += ' (Remote)';
        
        viewView.innerHTML = `
            <h4>${exp.job_title || ''} at ${exp.company || ''}</h4>
            <p class="details">
                <i class="fas fa-calendar-alt"></i>
                ${details}
            </p>
            ${exp.responsibilities ? `<p class="responsibilities">${exp.responsibilities}</p>` : ''}
            ${exp.skills_used && exp.skills_used.length ? `
                <p class="skills-used">
                    <i class="fas fa-code"></i>
                    Skills: ${exp.skills_used.join(', ')}
                </p>
            ` : ''}
        `;
        
        // Create edit mode
        const editView = document.createElement('div');
        editView.className = 'experience-edit';
        editView.style.display = 'none';
        
        editView.innerHTML = `
            <div class="form-group enhanced">
                <label>Job Title</label>
                <div class="input-with-icon">
                    <i class="fas fa-briefcase"></i>
                    <input type="text" class="exp-title" value="${exp.job_title || ''}" placeholder="Search job title..." disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Company</label>
                <div class="input-with-icon">
                    <i class="fas fa-building"></i>
                    <input type="text" class="exp-company" value="${exp.company || ''}" placeholder="Company name" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Employment Type</label>
                <div class="select-with-icon">
                    <i class="fas fa-user-tie"></i>
                    <select class="exp-type" disabled>
                        <option value="">Select Employment Type</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Location</label>
                <div class="input-with-icon">
                    <i class="fas fa-map-marker-alt"></i>
                    <input type="text" class="exp-location" value="${exp.location || ''}" placeholder="City, State" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="exp-remote" ${exp.remote ? 'checked' : ''} disabled> 
                    <span>Remote Position</span>
                </label>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>Start Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="exp-start-date" value="${exp.start_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>End Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="exp-end-date" value="${exp.end_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="exp-current" ${exp.current ? 'checked' : ''} disabled> 
                    <span>Currently Working</span>
                </label>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2;">
                <label>Responsibilities</label>
                <div class="textarea-with-icon">
                    <i class="fas fa-tasks"></i>
                    <textarea class="exp-responsibilities" placeholder="Describe your responsibilities and achievements..." rows="4" disabled>${exp.responsibilities || ''}</textarea>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2;">
                <label>Skills Used</label>
                <div class="input-with-icon">
                    <i class="fas fa-code"></i>
                    <input type="text" class="exp-skills" value="${exp.skills_used ? exp.skills_used.join(', ') : ''}" placeholder="Enter skills separated by commas" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2; text-align: right;">
                <button type="button" class="btn-remove-experience" style="display: none;">
                    <i class="fas fa-trash"></i> Remove Experience
                </button>
            </div>
        `;
        
        item.appendChild(viewView);
        item.appendChild(editView);
        container.appendChild(item);
        
        // Populate dropdowns for edit view
        this.populateExperienceDropdowns(editView, exp);
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(editView);
    }

    populateExperienceDropdowns(container, exp) {
        const typeSelect = container.querySelector('.exp-type');
        
        if (this.employmentTypesData && typeSelect) {
            typeSelect.innerHTML = '<option value="">Select Employment Type</option>';
            
            this.employmentTypesData.employment_types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                if (exp.employment_type && exp.employment_type === type) {
                    option.selected = true;
                }
                typeSelect.appendChild(option);
            });
        }
    }

    createCertificationItem(cert, index, container) {
        const item = document.createElement('div');
        item.className = 'certification-item';
        item.dataset.index = index;
        
        // Create view mode
        const viewView = document.createElement('div');
        viewView.className = 'certification-view';
        
        let details = `Issued: ${cert.issue_date || ''}`;
        if (cert.expiry_date && !cert.no_expiry) details += ` | Expires: ${cert.expiry_date}`;
        if (cert.credential_id) details += ` | ID: ${cert.credential_id}`;
        if (cert.no_expiry) details += ' | No Expiry';
        
        viewView.innerHTML = `
            <h4>${cert.name || ''}</h4>
            <p class="organization">
                <i class="fas fa-certificate"></i>
                by ${cert.organization || ''}
            </p>
            <p class="details">
                <i class="fas fa-calendar-alt"></i>
                ${details}
            </p>
            ${cert.skills && cert.skills.length ? `
                <p class="skills">
                    <i class="fas fa-code"></i>
                    Skills: ${cert.skills.join(', ')}
                </p>
            ` : ''}
            ${cert.certificate_url ? `
                <a href="${cert.certificate_url}" target="_blank" class="btn-view-certificate">
                    <i class="fas fa-eye"></i> View Certificate
                </a>
            ` : ''}
        `;
        
        // Create edit mode
        const editView = document.createElement('div');
        editView.className = 'certification-edit';
        editView.style.display = 'none';
        
        editView.innerHTML = `
            <div class="form-group enhanced">
                <label>Certification Name</label>
                <div class="input-with-icon">
                    <i class="fas fa-certificate"></i>
                    <input type="text" class="cert-name" value="${cert.name || ''}" placeholder="Certification Name" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Issuing Organization</label>
                <div class="input-with-icon">
                    <i class="fas fa-building"></i>
                    <input type="text" class="cert-organization" value="${cert.organization || ''}" placeholder="Issuing Organization" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>Issue Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="cert-issue-date" value="${cert.issue_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>Expiry Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="cert-expiry-date" value="${cert.expiry_date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" class="cert-no-expiry" ${cert.no_expiry ? 'checked' : ''} disabled> 
                    <span>No Expiry</span>
                </label>
            </div>
            
            <div class="form-group enhanced">
                <label>Credential ID</label>
                <div class="input-with-icon">
                    <i class="fas fa-id-card"></i>
                    <input type="text" class="cert-credential-id" value="${cert.credential_id || ''}" placeholder="Credential ID" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Skills</label>
                <div class="input-with-icon">
                    <i class="fas fa-code"></i>
                    <input type="text" class="cert-skills" value="${cert.skills ? cert.skills.join(', ') : ''}" placeholder="Skills (comma separated)" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced cert-upload-section">
                <button type="button" class="btn-upload-certificate" disabled>
                    <i class="fas fa-upload"></i> Upload Certificate
                </button>
                <input type="hidden" class="cert-certificate-url" value="${cert.certificate_url || ''}">
                ${cert.certificate_url ? `
                    <a href="${cert.certificate_url}" target="_blank" class="current-certificate">
                        <i class="fas fa-eye"></i> View Current Certificate
                    </a>
                ` : ''}
            </div>
            
            <div class="form-group enhanced" style="text-align: right;">
                <button type="button" class="btn-remove-certification" style="display: none;">
                    <i class="fas fa-trash"></i> Remove Certification
                </button>
            </div>
        `;
        
        item.appendChild(viewView);
        item.appendChild(editView);
        container.appendChild(item);
    }

    createProjectItem(project, index, container) {
        const item = document.createElement('div');
        item.className = 'project-item enhanced-item';
        item.dataset.index = index;
        
        // Create view mode
        const viewView = document.createElement('div');
        viewView.className = 'project-view';
        
        let linksHTML = '';
        if (project.links && project.links.length > 0) {
            linksHTML = '<div class="project-links">';
            project.links.forEach(link => {
                let icon = 'fa-link';
                if (link.name.includes('GitHub') || link.name.includes('github')) icon = 'fa-github';
                if (link.name.includes('Live') || link.name.includes('live')) icon = 'fa-globe';
                if (link.name.includes('Demo') || link.name.includes('demo')) icon = 'fa-play-circle';
                
                linksHTML += `
                    <a href="${link.url}" target="_blank" class="project-link">
                        <i class="fas ${icon}"></i> ${link.name}
                    </a>
                `;
            });
            linksHTML += '</div>';
        }
        
        viewView.innerHTML = `
            <h4>${project.title || ''}</h4>
            ${project.type ? `<p class="type"><i class="fas fa-project-diagram"></i> ${project.type}</p>` : ''}
            ${project.description ? `<p class="description">${project.description}</p>` : ''}
            ${project.technologies && project.technologies.length ? `
                <p class="technologies">
                    <i class="fas fa-code"></i>
                    Technologies: ${project.technologies.join(', ')}
                </p>
            ` : ''}
            ${project.role ? `<p class="role"><i class="fas fa-user-tie"></i> Role: ${project.role}</p>` : ''}
            ${linksHTML}
        `;
        
        // Create edit mode
        const editView = document.createElement('div');
        editView.className = 'project-edit';
        editView.style.display = 'none';
        
        // Create links HTML for edit mode
        let linksEditHTML = '';
        if (project.links && project.links.length > 0) {
            project.links.forEach(link => {
                linksEditHTML += `
                    <div class="project-link-item">
                        <span><strong>${link.name}:</strong> ${link.url}</span>
                        <button type="button" class="btn-remove-link" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                        <input type="hidden" class="project-link-name" value="${link.name}">
                        <input type="hidden" class="project-link-url" value="${link.url}">
                    </div>
                `;
            });
        }
        
        // Create images HTML
        let imagesHTML = '';
        if (project.images && project.images.length > 0) {
            project.images.forEach(image => {
                imagesHTML += `
                    <div class="project-image-preview">
                        <img src="${image}" alt="Project Image">
                        <button type="button" class="remove-image" style="display: none;">×</button>
                        <input type="hidden" class="project-image-url" value="${image}">
                    </div>
                `;
            });
        }
        
        editView.innerHTML = `
            <div class="form-group enhanced">
                <label>Project Title</label>
                <div class="input-with-icon">
                    <i class="fas fa-heading"></i>
                    <input type="text" class="project-title" value="${project.title || ''}" placeholder="Enter project title" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Project Type</label>
                <div class="input-with-icon">
                    <i class="fas fa-project-diagram"></i>
                    <input type="text" class="project-type" value="${project.type || ''}" placeholder="e.g., Web Application, Mobile App" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2;">
                <label>Description</label>
                <div class="textarea-with-icon">
                    <i class="fas fa-align-left"></i>
                    <textarea class="project-description" placeholder="Describe your project, its purpose, and key features..." rows="4" disabled>${project.description || ''}</textarea>
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2;">
                <label>Technologies Used</label>
                <div class="input-with-icon">
                    <i class="fas fa-code"></i>
                    <input type="text" class="project-technologies" value="${project.technologies ? project.technologies.join(', ') : ''}" placeholder="Enter technologies separated by commas" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Your Role</label>
                <div class="input-with-icon">
                    <i class="fas fa-user-tie"></i>
                    <input type="text" class="project-role" value="${project.role || ''}" placeholder="e.g., Frontend Developer, Project Lead" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced project-links-input" style="grid-column: span 2;">
                <label>Project Links</label>
                <div class="link-input-row">
                    <div class="select-with-icon">
                        <i class="fas fa-link"></i>
                        <select class="project-link-type" disabled>
                            <option value="github">GitHub</option>
                            <option value="live">Live Demo</option>
                            <option value="demo">Demo Video</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="input-with-icon">
                        <i class="fas fa-globe"></i>
                        <input type="url" class="project-link-url" placeholder="Enter URL" disabled>
                    </div>
                    <button type="button" class="btn-add-project-link" disabled>
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
                <div class="project-links-list">
                    ${linksEditHTML}
                </div>
            </div>
            
            <div class="form-group enhanced project-images" style="grid-column: span 2;">
                <label>Project Images</label>
                <button type="button" class="btn-upload-enhanced btn-upload-project-images" disabled>
                    <i class="fas fa-cloud-upload-alt"></i> Upload Project Images
                </button>
                <div class="project-images-list">
                    ${imagesHTML}
                </div>
            </div>
            
            <div class="form-group enhanced" style="grid-column: span 2; text-align: right;">
                <button type="button" class="btn-remove-project" style="display: none;">
                    <i class="fas fa-trash"></i> Remove Project
                </button>
            </div>
        `;
        
        item.appendChild(viewView);
        item.appendChild(editView);
        container.appendChild(item);
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(editView);
        
        // Add event listeners for links
        const addLinkBtn = editView.querySelector('.btn-add-project-link');
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', () => {
                this.addProjectLink(editView);
            });
        }
        
        // Add event listeners for existing remove buttons
        editView.querySelectorAll('.btn-remove-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.project-link-item').remove();
            });
        });
        
        // Add event listeners for image remove buttons
        editView.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.project-image-preview').remove();
            });
        });
    }

    createAchievementItem(achievement, index, container) {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.dataset.index = index;
        
        // Create view mode
        const viewView = document.createElement('div');
        viewView.className = 'achievement-view';
        
        viewView.innerHTML = `
            <h4>${achievement.title || ''}</h4>
            ${achievement.org ? `<p class="org"><i class="fas fa-building"></i> by ${achievement.org}</p>` : ''}
            ${achievement.date ? `<p class="date"><i class="fas fa-calendar-alt"></i> ${achievement.date}</p>` : ''}
            ${achievement.description ? `<p class="description">${achievement.description}</p>` : ''}
        `;
        
        // Create edit mode
        const editView = document.createElement('div');
        editView.className = 'achievement-edit';
        editView.style.display = 'none';
        
        editView.innerHTML = `
            <div class="form-group enhanced">
                <label>Achievement Title</label>
                <div class="input-with-icon">
                    <i class="fas fa-trophy"></i>
                    <input type="text" class="achievement-title" value="${achievement.title || ''}" placeholder="Achievement Title" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Organization</label>
                <div class="input-with-icon">
                    <i class="fas fa-building"></i>
                    <input type="text" class="achievement-org" value="${achievement.org || ''}" placeholder="Organization" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced date-picker-container">
                <label>Date</label>
                <div class="input-with-icon">
                    <i class="fas fa-calendar-alt"></i>
                    <input type="month" class="achievement-date" value="${achievement.date || ''}" disabled>
                </div>
            </div>
            
            <div class="form-group enhanced">
                <label>Description</label>
                <div class="textarea-with-icon">
                    <i class="fas fa-align-left"></i>
                    <textarea class="achievement-description" placeholder="Description" disabled>${achievement.description || ''}</textarea>
                </div>
            </div>
            
            <div class="form-group enhanced" style="text-align: right;">
                <button type="button" class="btn-remove-achievement" style="display: none;">
                    <i class="fas fa-trash"></i> Remove Achievement
                </button>
            </div>
        `;
        
        item.appendChild(viewView);
        item.appendChild(editView);
        container.appendChild(item);
    }

    createSkillItem(skill, index, container) {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="input-with-icon">
                <i class="fas fa-star"></i>
                <input type="text" class="skill-name" value="${skill.skill_name || ''}" placeholder="Skill name" disabled>
                <button type="button" class="btn-remove-skill" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    initEnhancedUIForItem(item) {
        // Initialize date pickers
        item.querySelectorAll('input[type="month"]').forEach(input => {
            this.initDatePickerForInput(input);
        });
        
        // Initialize autocomplete for colleges
        const collegeInput = item.querySelector('.edu-institution');
        if (collegeInput) {
            this.initAutocompleteForInput(collegeInput, 'college');
        }
        
        // Initialize autocomplete for job titles
        const jobTitleInput = item.querySelector('.exp-title');
        if (jobTitleInput && jobTitleInput.tagName === 'INPUT') {
            this.initAutocompleteForInput(jobTitleInput, 'job-title');
        }
        
        // Initialize autocomplete for technologies
        const techInput = item.querySelector('.project-technologies');
        if (techInput) {
            this.initAutocompleteForInput(techInput, 'technology');
        }
        
        // Initialize autocomplete for skills
        const skillsInput = item.querySelector('.exp-skills');
        if (skillsInput) {
            this.initAutocompleteForInput(skillsInput, 'technology');
        }
        
        // Initialize autocomplete for location
        const locationInput = item.querySelector('.edu-location, .exp-location');
        if (locationInput) {
            this.initAutocompleteForInput(locationInput, 'location');
        }
    }

    initDatePickerForInput(input) {
        input.addEventListener('focus', (e) => {
            if (this.isEditMode && e.target.showPicker) {
                e.target.showPicker();
            }
        });
        
        // Add calendar icon if not present
        const container = input.closest('.input-with-icon') || input.parentElement;
        if (container && !container.querySelector('.fa-calendar-alt')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-calendar-alt';
            container.insertBefore(icon, input);
            input.style.paddingLeft = '48px';
        }
    }

    initAutocompleteForInput(input, type) {
        // Create suggestions container if not exists
        if (!input.nextElementSibling?.classList.contains('autocomplete-suggestions')) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'autocomplete-suggestions';
            suggestionsContainer.style.display = 'none';
            input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);
        }
    }

    addProjectLink(projectEdit) {
        const linkTypeSelect = projectEdit.querySelector('.project-link-type');
        const linkUrlInput = projectEdit.querySelector('.project-link-url');
        const linkUrl = linkUrlInput.value.trim();
        
        if (!linkUrl) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }
        
        // Validate URL
        try {
            new URL(linkUrl);
        } catch (e) {
            this.showNotification('Please enter a valid URL (include http:// or https://)', 'error');
            return;
        }
        
        const linkType = linkTypeSelect.value;
        const linkNameMap = {
            'github': 'GitHub Repository',
            'live': 'Live Demo',
            'demo': 'Demo Video',
            'other': 'Project Link'
        };
        const linkName = linkNameMap[linkType] || 'Project Link';
        
        const linksList = projectEdit.querySelector('.project-links-list');
        
        const linkItem = document.createElement('div');
        linkItem.className = 'project-link-item';
        linkItem.innerHTML = `
            <span><strong>${linkName}:</strong> ${linkUrl}</span>
            <button type="button" class="btn-remove-link" style="display: ${this.isEditMode ? 'inline-block' : 'none'};">
                <i class="fas fa-times"></i>
            </button>
            <input type="hidden" class="project-link-name" value="${linkName}">
            <input type="hidden" class="project-link-url" value="${linkUrl}">
        `;
        
        linksList.appendChild(linkItem);
        
        // Clear input
        linkUrlInput.value = '';
        
        // Add remove event
        linkItem.querySelector('.btn-remove-link').addEventListener('click', () => {
            linkItem.remove();
        });
        
        this.showNotification('Link added successfully', 'success');
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
        
        // Add buttons
        if (this.addLanguageBtn) {
            this.addLanguageBtn.addEventListener('click', this.addLanguage.bind(this));
        }
        if (this.addEducationBtn) {
            this.addEducationBtn.addEventListener('click', this.addEducation.bind(this));
        }
        if (this.addExperienceBtn) {
            this.addExperienceBtn.addEventListener('click', this.addExperience.bind(this));
        }
        if (this.addCertificationBtn) {
            this.addCertificationBtn.addEventListener('click', this.addCertification.bind(this));
        }
        if (this.addProjectBtn) {
            this.addProjectBtn.addEventListener('click', this.addProject.bind(this));
        }
        if (this.addAchievementBtn) {
            this.addAchievementBtn.addEventListener('click', this.addAchievement.bind(this));
        }
        if (this.addSkillBtn) {
            this.addSkillBtn.addEventListener('click', this.addSkill.bind(this));
        }
        
        // Initialize remove buttons for existing items
        this.initRemoveButtons();
    }

    initRemoveButtons() {
        // Add event listeners to all remove buttons
        document.querySelectorAll('.btn-remove-language').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.language-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-education').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.education-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-experience').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.experience-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-certification').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.certification-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.project-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-achievement').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.achievement-item').remove();
            });
        });
        
        document.querySelectorAll('.btn-remove-skill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.skill-item').remove();
            });
        });
        
        // Skill tags remove buttons
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const skillTag = e.target.closest('.skill-tag');
                const type = skillTag.closest('#offeredSkillsTags') ? 'offered' : 'requested';
                const skill = skillTag.dataset.skill;
                this.removeSkill(type, skill);
            });
        });
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        // Toggle form fields
        const formElements = document.querySelectorAll('input, select, textarea, button');
        formElements.forEach(el => {
            if (el.type !== 'hidden' && el.name !== 'photo_url' && !el.classList.contains('btn-edit')) {
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
            
            // Show remove buttons and add buttons
            this.toggleEditControls(true);
            
            // Initialize enhanced UI for existing items
            this.initEnhancedUI();
        } else {
            this.profileTitle.textContent = 'Profile';
            this.profileSubtitle.textContent = 'View and manage your profile information';
            this.editModeIndicator.style.display = 'none';
            this.formActions.style.display = 'none';
            this.toggleEditBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            this.socialInputs.style.display = 'none';
            this.socialIconsDisplay.style.display = 'block';
            
            // Hide remove buttons and add buttons
            this.toggleEditControls(false);
            
            this.updateSocialIcons();
        }
    }

    toggleEditControls(show) {
        // Toggle remove buttons
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.style.display = show ? 'inline-flex' : 'none';
        });
        
        document.querySelectorAll('.btn-remove-language, .btn-remove-skill, .btn-remove-education, .btn-remove-experience, .btn-remove-certification, .btn-remove-project, .btn-remove-achievement, .btn-remove-link, .remove-image').forEach(btn => {
            btn.style.display = show ? 'inline-block' : 'none';
        });
        
        // Toggle add buttons
        [this.addLanguageBtn, this.addEducationBtn, this.addExperienceBtn, 
         this.addCertificationBtn, this.addProjectBtn, this.addAchievementBtn,
         this.addSkillBtn].forEach(btn => {
            if (btn) btn.style.display = show ? 'inline-flex' : 'none';
        });
        
        // Toggle view/edit modes for sections
        if (show) {
            document.querySelectorAll('.education-view, .experience-view, .certification-view, .project-view, .achievement-view').forEach(view => {
                view.style.display = 'none';
            });
            document.querySelectorAll('.education-edit, .experience-edit, .certification-edit, .project-edit, .achievement-edit').forEach(edit => {
                edit.style.display = 'grid';
            });
        } else {
            document.querySelectorAll('.education-view, .experience-view, .certification-view, .project-view, .achievement-view').forEach(view => {
                view.style.display = 'block';
            });
            document.querySelectorAll('.education-edit, .experience-edit, .certification-edit, .project-edit, .achievement-edit').forEach(edit => {
                edit.style.display = 'none';
            });
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
            this.addSkillTag(type, skill);
            e.target.value = '';
            this.hideSuggestions(suggestionsContainer);
        });
    }

    handleSkillKeydown(type, e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value && skillsData.includes(value)) {
                this.addSkillTag(type, value);
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
        this.countryInput.value = 'India';
        this.hideSuggestions(this.citySuggestions);
        this.updateLocationDisplay();
    }

    addSkillTag(type, skill) {
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
            <span class="remove-skill" style="display: ${this.isEditMode ? 'inline-flex' : 'none'};">&times;</span>
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

    addLanguage() {
        const container = document.getElementById('languagesContainer');
        const template = document.getElementById('languageTemplate').content.cloneNode(true);
        const item = template.querySelector('.language-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, select').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-language');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
    }

    addEducation() {
        const container = document.getElementById('educationContainer');
        const template = document.getElementById('educationTemplate').content.cloneNode(true);
        const item = template.querySelector('.education-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Populate dropdowns
        this.populateEducationDropdowns(item.querySelector('.education-edit'), {});
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(item.querySelector('.education-edit'));
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-education');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
    }

    addExperience() {
        const container = document.getElementById('experienceContainer');
        const template = document.getElementById('experienceTemplate').content.cloneNode(true);
        const item = template.querySelector('.experience-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Populate dropdowns
        this.populateExperienceDropdowns(item.querySelector('.experience-edit'), {});
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(item.querySelector('.experience-edit'));
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-experience');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
    }

    addCertification() {
        const container = document.getElementById('certificationsContainer');
        const template = document.getElementById('certificationTemplate').content.cloneNode(true);
        const item = template.querySelector('.certification-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-certification');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
        
        // Add upload certificate button handler
        const uploadBtn = item.querySelector('.btn-upload-certificate');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.openCertCloudinaryWidget(item);
            });
        }
    }

    addProject() {
        const container = document.getElementById('projectsContainer');
        const template = document.getElementById('projectTemplate').content.cloneNode(true);
        const item = template.querySelector('.project-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Initialize enhanced UI for this item
        this.initEnhancedUIForItem(item.querySelector('.project-edit'));
        
        // Add event listener for project links
        const addLinkBtn = item.querySelector('.btn-add-project-link');
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', () => {
                this.addProjectLink(item.querySelector('.project-edit'));
            });
        }
        
        // Add event listener for project image upload
        const uploadBtn = item.querySelector('.btn-upload-project-images');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.openProjectCloudinaryWidget(item);
            });
        }
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-project');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
    }

    addAchievement() {
        const container = document.getElementById('achievementsContainer');
        const template = document.getElementById('achievementTemplate').content.cloneNode(true);
        const item = template.querySelector('.achievement-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-achievement');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
        }
    }

    addSkill() {
        const container = document.getElementById('skillsContainer');
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="skill-item">
                <div class="input-with-icon">
                    <i class="fas fa-star"></i>
                    <input type="text" class="skill-name" placeholder="Skill name" disabled>
                    <button type="button" class="btn-remove-skill" style="display: none;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        const item = template.content.cloneNode(true).querySelector('.skill-item');
        item.dataset.index = container.children.length;
        
        container.appendChild(item);
        
        // Enable inputs
        item.querySelectorAll('input, button').forEach(el => {
            el.disabled = !this.isEditMode;
        });
        
        // Show remove button if in edit mode
        const removeBtn = item.querySelector('.btn-remove-skill');
        if (removeBtn) {
            removeBtn.style.display = this.isEditMode ? 'inline-block' : 'none';
            removeBtn.addEventListener('click', () => {
                item.remove();
            });
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
        
        // Hide all autocomplete suggestions
        document.querySelectorAll('.autocomplete-suggestions').forEach(container => {
            if (!container.previousElementSibling.contains(e.target) && !container.contains(e.target)) {
                container.style.display = 'none';
            }
        });
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
                this.countryInput.value = location.country || 'India';
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
                    state: data.principalSubdivision,
                    country: data.countryName
                };
            }
            
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
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
            folder: 'Media Library/Assets/Profile_Photos',
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

        // Initialize certificate upload widget
        this.certCloudinaryWidget = cloudinary.createUploadWidget({
            cloudName: 'dtarhtz5w',
            uploadPreset: 'skillswap_assets',
            folder: 'Media Library/Assets/Certificates',
            sources: ['local', 'url'],
            multiple: false,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
            maxFileSize: 10000000,
            showAdvancedOptions: false,
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
                if (this.currentCertItem) {
                    this.handleCertificateUpload(result.info);
                }
            } else if (error) {
                this.showNotification('Error uploading certificate: ' + error.message, 'error');
            }
        });
    }

    initProjectCloudinaryWidget() {
        this.projectCloudinaryWidget = cloudinary.createUploadWidget({
            cloudName: 'dtarhtz5w',
            uploadPreset: 'skillswap_assets',
            folder: 'Media Library/Assets/Project_Images',
            sources: ['local', 'url', 'camera'],
            multiple: true,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 5000000,
            showAdvancedOptions: true,
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
                this.handleProjectImageUpload(result.info);
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

    openCertCloudinaryWidget(item) {
        this.currentCertItem = item;
        if (this.certCloudinaryWidget) {
            this.certCloudinaryWidget.open();
        }
    }

    openProjectCloudinaryWidget(projectItem) {
        this.currentProjectItem = projectItem;
        if (this.projectCloudinaryWidget) {
            this.projectCloudinaryWidget.open();
        }
    }

    handleImageUpload(result) {
        this.uploadProgress.style.display = 'flex';
        this.progressFill.style.width = '100%';
        this.progressText.textContent = '100%';
        
        // Update profile image and URL field
        const profileImage = document.getElementById('profileImage');
        const photoUrlInput = document.getElementById('photoUrlInput');
        
        profileImage.src = result.secure_url;
        photoUrlInput.value = result.secure_url;
        
        setTimeout(() => {
            this.uploadProgress.style.display = 'none';
            this.progressFill.style.width = '0%';
            this.progressText.textContent = '0%';
        }, 2000);
        
        this.showNotification('Profile image uploaded successfully!', 'success');
    }

    handleCertificateUpload(result) {
        if (this.currentCertItem) {
            const urlInput = this.currentCertItem.querySelector('.cert-certificate-url');
            const uploadSection = this.currentCertItem.querySelector('.cert-upload-section');
            
            urlInput.value = result.secure_url;
            
            // Add view link
            const viewLink = document.createElement('a');
            viewLink.href = result.secure_url;
            viewLink.target = '_blank';
            viewLink.className = 'current-certificate';
            viewLink.innerHTML = '<i class="fas fa-eye"></i> View Current Certificate';
            
            // Remove existing link if any
            const existingLink = uploadSection.querySelector('.current-certificate');
            if (existingLink) {
                existingLink.remove();
            }
            
            uploadSection.appendChild(viewLink);
            
            this.showNotification('Certificate uploaded successfully!', 'success');
            this.currentCertItem = null;
        }
    }

    handleProjectImageUpload(result) {
        if (this.currentProjectItem) {
            const editView = this.currentProjectItem.querySelector('.project-edit');
            const imagesList = editView.querySelector('.project-images-list');
            
            const imageItem = document.createElement('div');
            imageItem.className = 'project-image-preview';
            imageItem.innerHTML = `
                <img src="${result.secure_url}" alt="Project Image">
                <button type="button" class="remove-image" style="display: ${this.isEditMode ? 'block' : 'none'};">×</button>
                <input type="hidden" class="project-image-url" value="${result.secure_url}">
            `;
            
            imagesList.appendChild(imageItem);
            
            // Add remove event
            imageItem.querySelector('.remove-image').addEventListener('click', () => {
                imageItem.remove();
            });
            
            this.showNotification('Project image uploaded successfully!', 'success');
            this.currentProjectItem = null;
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const saveBtn = e.target.querySelector('.btn-save');
        const originalText = saveBtn.innerHTML;
        
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveBtn.disabled = true;
        
        try {
            const formData = new FormData(e.target);
            
            // Convert form data to object
            const data = {
                name: formData.get('name'),
                headline: formData.get('headline'),
                about: formData.get('about'),
                city: formData.get('city'),
                state: formData.get('state'),
                country: formData.get('country'),
                availability: formData.get('availability'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                website: formData.get('website'),
                photo_url: formData.get('photo_url'),
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
            
            // Collect languages
            const languages = [];
            document.querySelectorAll('.language-item').forEach((item) => {
                const language = item.querySelector('.language-name').value.trim();
                const proficiency = item.querySelector('.language-proficiency').value;
                if (language) {
                    languages.push({ language, proficiency });
                }
            });
            data.languages = languages;
            
            // Collect education
            const education = [];
            document.querySelectorAll('.education-item').forEach((item) => {
                const edu = {
                    degree_type: item.querySelector('.edu-degree')?.value.trim() || '',
                    field_of_study: item.querySelector('.edu-field')?.value.trim() || '',
                    institution_name: item.querySelector('.edu-institution')?.value.trim() || '',
                    institution_type: item.querySelector('.edu-institution-type')?.value.trim() || '',
                    location: item.querySelector('.edu-location')?.value.trim() || '',
                    start_date: item.querySelector('.edu-start-date')?.value || '',
                    end_date: item.querySelector('.edu-end-date')?.value || '',
                    current: item.querySelector('.edu-current')?.checked || false,
                    grade: item.querySelector('.edu-grade')?.value.trim() || '',
                    description: item.querySelector('.edu-description')?.value.trim() || ''
                };
                
                // Only add if required fields are filled
                if (edu.degree_type || edu.institution_name || edu.field_of_study) {
                    education.push(edu);
                }
            });
            data.education = education;
            
            // Collect experience
            const experience = [];
            document.querySelectorAll('.experience-item').forEach((item) => {
                const exp = {
                    job_title: item.querySelector('.exp-title')?.value.trim() || '',
                    company: item.querySelector('.exp-company')?.value.trim() || '',
                    employment_type: item.querySelector('.exp-type')?.value.trim() || '',
                    location: item.querySelector('.exp-location')?.value.trim() || '',
                    remote: item.querySelector('.exp-remote')?.checked || false,
                    start_date: item.querySelector('.exp-start-date')?.value || '',
                    end_date: item.querySelector('.exp-end-date')?.value || '',
                    current: item.querySelector('.exp-current')?.checked || false,
                    responsibilities: item.querySelector('.exp-responsibilities')?.value.trim() || '',
                    skills_used: item.querySelector('.exp-skills')?.value.split(',').map(s => s.trim()).filter(s => s) || []
                };
                
                // Only add if required fields are filled
                if (exp.job_title || exp.company) {
                    experience.push(exp);
                }
            });
            data.experience = experience;
            
            // Collect certifications
            const certifications = [];
            document.querySelectorAll('.certification-item').forEach((item) => {
                const cert = {
                    name: item.querySelector('.cert-name')?.value.trim() || '',
                    organization: item.querySelector('.cert-organization')?.value.trim() || '',
                    issue_date: item.querySelector('.cert-issue-date')?.value || '',
                    expiry_date: item.querySelector('.cert-expiry-date')?.value || '',
                    no_expiry: item.querySelector('.cert-no-expiry')?.checked || false,
                    credential_id: item.querySelector('.cert-credential-id')?.value.trim() || '',
                    certificate_url: item.querySelector('.cert-certificate-url')?.value || '',
                    skills: item.querySelector('.cert-skills')?.value.split(',').map(s => s.trim()).filter(s => s) || []
                };
                
                // Only add if required fields are filled
                if (cert.name || cert.organization) {
                    certifications.push(cert);
                }
            });
            data.certifications = certifications;
            
            // Collect projects with enhanced fields
            const projects = [];
            document.querySelectorAll('.project-item').forEach((item) => {
                const project = {
                    title: item.querySelector('.project-title')?.value.trim() || '',
                    type: item.querySelector('.project-type')?.value.trim() || '',
                    description: item.querySelector('.project-description')?.value.trim() || '',
                    technologies: item.querySelector('.project-technologies')?.value.split(',').map(s => s.trim()).filter(s => s) || [],
                    role: item.querySelector('.project-role')?.value.trim() || ''
                };
                
                // Collect project links
                const links = [];
                item.querySelectorAll('.project-links-list .project-link-item').forEach(linkItem => {
                    const nameInput = linkItem.querySelector('.project-link-name');
                    const urlInput = linkItem.querySelector('.project-link-url');
                    if (nameInput && urlInput) {
                        const name = nameInput.value.trim();
                        const url = urlInput.value.trim();
                        if (name && url) {
                            links.push({ name, url });
                        }
                    }
                });
                project.links = links;
                
                // Collect project images
                const images = [];
                item.querySelectorAll('.project-image-url').forEach(input => {
                    if (input.value) {
                        images.push(input.value);
                    }
                });
                project.images = images;
                
                // Only add if required fields are filled
                if (project.title || project.description) {
                    projects.push(project);
                }
            });
            data.projects = projects;
            
            // Collect achievements
            const achievements = [];
            document.querySelectorAll('.achievement-item').forEach((item) => {
                const achievement = {
                    title: item.querySelector('.achievement-title')?.value.trim() || '',
                    org: item.querySelector('.achievement-org')?.value.trim() || '',
                    date: item.querySelector('.achievement-date')?.value || '',
                    description: item.querySelector('.achievement-description')?.value.trim() || ''
                };
                
                // Only add if required fields are filled
                if (achievement.title || achievement.org) {
                    achievements.push(achievement);
                }
            });
            data.achievements = achievements;
            
            // Collect additional skills
            const skills = [];
            document.querySelectorAll('.skill-item').forEach((item) => {
                const skill = {
                    skill_name: item.querySelector('.skill-name')?.value.trim() || ''
                };
                
                if (skill.skill_name) {
                    skills.push(skill);
                }
            });
            data.skills = skills;
            
            // Save to Firebase
            await db.collection('users').doc(this.currentUser.uid).set(data, { merge: true });
            
            // Update local user data
            this.userData = { ...this.userData, ...data };
            
            // Update view mode with new data
            this.populateFormData();
            
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
    window.profileManager = new ProfileManager();
    
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