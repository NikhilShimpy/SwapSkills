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
            await this.loadSwapRequests();
        } catch (error) {
            console.error('Authentication error:', error);
            this.showNotification('Please log in to access your profile', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
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
            // this.showNotification('Error loading profile data', 'error');
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
                this.createEducationView(edu, index, container);
            });
        }
    }

    populateExperience() {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = '';
        
        if (this.userData.experience && Array.isArray(this.userData.experience)) {
            this.userData.experience.forEach((exp, index) => {
                this.createExperienceView(exp, index, container);
            });
        }
    }

    populateCertifications() {
        const container = document.getElementById('certificationsContainer');
        container.innerHTML = '';
        
        if (this.userData.certifications && Array.isArray(this.userData.certifications)) {
            this.userData.certifications.forEach((cert, index) => {
                this.createCertificationView(cert, index, container);
            });
        }
    }

    populateProjects() {
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        
        if (this.userData.projects && Array.isArray(this.userData.projects)) {
            this.userData.projects.forEach((project, index) => {
                this.createProjectView(project, index, container);
            });
        }
    }

    populateAchievements() {
        const container = document.getElementById('achievementsContainer');
        container.innerHTML = '';
        
        if (this.userData.achievements && Array.isArray(this.userData.achievements)) {
            this.userData.achievements.forEach((achievement, index) => {
                this.createAchievementView(achievement, index, container);
            });
        }
    }

    populateAdditionalSkills() {
        const container = document.getElementById('skillsContainer');
        container.innerHTML = '';
        
        if (this.userData.skills && Array.isArray(this.userData.skills)) {
            this.userData.skills.forEach((skill, index) => {
                this.createSkillView(skill, index, container);
            });
        }
    }

    createEducationView(edu, index, container) {
        const item = document.createElement('div');
        item.className = 'education-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="education-view">
                <h4>${edu.degree_type || ''} ${edu.field_of_study ? 'in ' + edu.field_of_study : ''}</h4>
                <p class="institution">${edu.institution_name || ''}</p>
                <p class="details">
                    ${edu.start_date || ''} - ${edu.current ? 'Present' : (edu.end_date || '')}
                    ${edu.grade ? ' | Grade: ' + edu.grade : ''}
                </p>
                ${edu.description ? '<p class="description">' + edu.description + '</p>' : ''}
            </div>
            <div class="education-edit" style="display: none;">
                <input type="text" class="edu-degree" value="${edu.degree_type || ''}" placeholder="Degree Type" disabled>
                <input type="text" class="edu-field" value="${edu.field_of_study || ''}" placeholder="Field of Study" disabled>
                <input type="text" class="edu-institution" value="${edu.institution_name || ''}" placeholder="Institution Name" disabled>
                <input type="text" class="edu-institution-type" value="${edu.institution_type || ''}" placeholder="Institution Type" disabled>
                <input type="text" class="edu-location" value="${edu.location || ''}" placeholder="Location" disabled>
                <input type="month" class="edu-start-date" value="${edu.start_date || ''}" disabled>
                <input type="month" class="edu-end-date" value="${edu.end_date || ''}" disabled>
                <label><input type="checkbox" class="edu-current" ${edu.current ? 'checked' : ''} disabled> Currently Studying</label>
                <input type="text" class="edu-grade" value="${edu.grade || ''}" placeholder="Grade" disabled>
                <textarea class="edu-description" placeholder="Description" disabled>${edu.description || ''}</textarea>
                <button type="button" class="btn-remove-education" style="display: none;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    createExperienceView(exp, index, container) {
        const item = document.createElement('div');
        item.className = 'experience-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="experience-view">
                <h4>${exp.job_title || ''} at ${exp.company || ''}</h4>
                <p class="details">
                    ${exp.employment_type || ''} | 
                    ${exp.start_date || ''} - ${exp.current ? 'Present' : (exp.end_date || '')}
                    ${exp.location ? ' | ' + exp.location : ''}
                </p>
                ${exp.responsibilities ? '<p class="responsibilities">' + exp.responsibilities + '</p>' : ''}
                ${exp.skills_used && exp.skills_used.length ? '<p class="skills-used">Skills: ' + exp.skills_used.join(', ') + '</p>' : ''}
            </div>
            <div class="experience-edit" style="display: none;">
                <input type="text" class="exp-title" value="${exp.job_title || ''}" placeholder="Job Title" disabled>
                <input type="text" class="exp-company" value="${exp.company || ''}" placeholder="Company" disabled>
                <input type="text" class="exp-type" value="${exp.employment_type || ''}" placeholder="Employment Type" disabled>
                <input type="text" class="exp-location" value="${exp.location || ''}" placeholder="Location" disabled>
                <label><input type="checkbox" class="exp-remote" ${exp.remote ? 'checked' : ''} disabled> Remote</label>
                <input type="month" class="exp-start-date" value="${exp.start_date || ''}" disabled>
                <input type="month" class="exp-end-date" value="${exp.end_date || ''}" disabled>
                <label><input type="checkbox" class="exp-current" ${exp.current ? 'checked' : ''} disabled> Currently Working</label>
                <textarea class="exp-responsibilities" placeholder="Responsibilities" disabled>${exp.responsibilities || ''}</textarea>
                <input type="text" class="exp-skills" value="${exp.skills_used ? exp.skills_used.join(', ') : ''}" placeholder="Skills used (comma separated)" disabled>
                <button type="button" class="btn-remove-experience" style="display: none;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    createCertificationView(cert, index, container) {
        const item = document.createElement('div');
        item.className = 'certification-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="certification-view">
                <h4>${cert.name || ''}</h4>
                <p class="organization">by ${cert.organization || ''}</p>
                <p class="details">
                    Issued: ${cert.issue_date || ''}
                    ${cert.expiry_date ? ' | Expires: ' + cert.expiry_date : ''}
                    ${cert.credential_id ? ' | ID: ' + cert.credential_id : ''}
                </p>
                ${cert.skills && cert.skills.length ? '<p class="skills">Skills: ' + cert.skills.join(', ') + '</p>' : ''}
                ${cert.certificate_url ? `
                    <a href="${cert.certificate_url}" target="_blank" class="btn-view-certificate">
                        <i class="fas fa-eye"></i> View Certificate
                    </a>
                ` : ''}
            </div>
            <div class="certification-edit" style="display: none;">
                <input type="text" class="cert-name" value="${cert.name || ''}" placeholder="Certification Name" disabled>
                <input type="text" class="cert-organization" value="${cert.organization || ''}" placeholder="Issuing Organization" disabled>
                <input type="month" class="cert-issue-date" value="${cert.issue_date || ''}" disabled>
                <input type="month" class="cert-expiry-date" value="${cert.expiry_date || ''}" disabled>
                <label><input type="checkbox" class="cert-no-expiry" ${cert.no_expiry ? 'checked' : ''} disabled> No Expiry</label>
                <input type="text" class="cert-credential-id" value="${cert.credential_id || ''}" placeholder="Credential ID" disabled>
                <input type="text" class="cert-skills" value="${cert.skills ? cert.skills.join(', ') : ''}" placeholder="Skills (comma separated)" disabled>
                <div class="cert-upload-section">
                    <button type="button" class="btn-upload-certificate" disabled>
                        <i class="fas fa-upload"></i> Upload Certificate
                    </button>
                    <input type="hidden" class="cert-certificate-url" value="${cert.certificate_url || ''}">
                    ${cert.certificate_url ? `
                        <a href="${cert.certificate_url}" target="_blank" class="current-certificate">
                            Current Certificate
                        </a>
                    ` : ''}
                </div>
                <button type="button" class="btn-remove-certification" style="display: none;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    createProjectView(project, index, container) {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="project-view">
                <h4>${project.title || ''}</h4>
                ${project.type ? '<p class="type">' + project.type + '</p>' : ''}
                ${project.description ? '<p class="description">' + project.description + '</p>' : ''}
                ${project.technologies && project.technologies.length ? '<p class="technologies">Technologies: ' + project.technologies.join(', ') + '</p>' : ''}
                ${project.role ? '<p class="role">Role: ' + project.role + '</p>' : ''}
                ${project.links && project.links.length ? `
                    <div class="project-links">
                        ${project.links.map(link => `
                            <a href="${link.url}" target="_blank" class="project-link">${link.name}</a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="project-edit" style="display: none;">
                <input type="text" class="project-title" value="${project.title || ''}" placeholder="Project Title" disabled>
                <input type="text" class="project-type" value="${project.type || ''}" placeholder="Project Type" disabled>
                <textarea class="project-description" placeholder="Description" disabled>${project.description || ''}</textarea>
                <input type="text" class="project-technologies" value="${project.technologies ? project.technologies.join(', ') : ''}" placeholder="Technologies (comma separated)" disabled>
                <input type="text" class="project-role" value="${project.role || ''}" placeholder="Your Role" disabled>
                <div class="project-links-input">
                    <input type="text" class="project-link-name" placeholder="Link Name" disabled>
                    <input type="url" class="project-link-url" placeholder="URL" disabled>
                    <button type="button" class="btn-add-project-link" disabled>Add Link</button>
                    <div class="project-links-list"></div>
                </div>
                <div class="project-images">
                    <button type="button" class="btn-upload-project-images" disabled>
                        <i class="fas fa-image"></i> Upload Images
                    </button>
                    <div class="project-images-list"></div>
                </div>
                <button type="button" class="btn-remove-project" style="display: none;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    createAchievementView(achievement, index, container) {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="achievement-view">
                <h4>${achievement.title || ''}</h4>
                ${achievement.org ? '<p class="org">by ' + achievement.org + '</p>' : ''}
                ${achievement.date ? '<p class="date">' + achievement.date + '</p>' : ''}
                ${achievement.description ? '<p class="description">' + achievement.description + '</p>' : ''}
            </div>
            <div class="achievement-edit" style="display: none;">
                <input type="text" class="achievement-title" value="${achievement.title || ''}" placeholder="Achievement Title" disabled>
                <input type="text" class="achievement-org" value="${achievement.org || ''}" placeholder="Organization" disabled>
                <input type="month" class="achievement-date" value="${achievement.date || ''}" disabled>
                <textarea class="achievement-description" placeholder="Description" disabled>${achievement.description || ''}</textarea>
                <button type="button" class="btn-remove-achievement" style="display: none;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        container.appendChild(item);
    }

    createSkillView(skill, index, container) {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <input type="text" class="skill-name" value="${skill.skill_name || ''}" placeholder="Skill name" disabled>
            <button type="button" class="btn-remove-skill" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(item);
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
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        // Toggle form fields
        const formElements = document.querySelectorAll('input, select, textarea');
        formElements.forEach(el => {
            if (el.type !== 'hidden' && el.name !== 'photo_url') {
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
        
        document.querySelectorAll('.btn-remove-language, .btn-remove-skill, .btn-remove-education, .btn-remove-experience, .btn-remove-certification, .btn-remove-project, .btn-remove-achievement').forEach(btn => {
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
                edit.style.display = 'block';
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
        this.countryInput.value = 'India';
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
        const template = document.querySelector('#skillTemplate') || this.createSkillTemplate();
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

    createSkillTemplate() {
        const template = document.createElement('template');
        template.id = 'skillTemplate';
        template.innerHTML = `
            <div class="skill-item">
                <input type="text" class="skill-name" placeholder="Skill name" disabled>
                <button type="button" class="btn-remove-skill" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(template);
        return template;
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
            viewLink.textContent = 'View Certificate';
            
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
            document.querySelectorAll('.language-item').forEach((item, index) => {
                const language = item.querySelector('.language-name').value.trim();
                const proficiency = item.querySelector('.language-proficiency').value;
                if (language) {
                    languages.push({ language, proficiency });
                }
            });
            data.languages = languages;
            
            // Collect education
            const education = [];
            document.querySelectorAll('.education-item').forEach((item, index) => {
                const edu = {
                    degree_type: item.querySelector('.edu-degree').value.trim(),
                    field_of_study: item.querySelector('.edu-field').value.trim(),
                    institution_name: item.querySelector('.edu-institution').value.trim(),
                    institution_type: item.querySelector('.edu-institution-type').value.trim(),
                    location: item.querySelector('.edu-location').value.trim(),
                    start_date: item.querySelector('.edu-start-date').value,
                    end_date: item.querySelector('.edu-end-date').value,
                    current: item.querySelector('.edu-current').checked,
                    grade: item.querySelector('.edu-grade').value.trim(),
                    description: item.querySelector('.edu-description').value.trim()
                };
                
                // Only add if required fields are filled
                if (edu.degree_type || edu.institution_name || edu.field_of_study) {
                    education.push(edu);
                }
            });
            data.education = education;
            
            // Collect experience
            const experience = [];
            document.querySelectorAll('.experience-item').forEach((item, index) => {
                const exp = {
                    job_title: item.querySelector('.exp-title').value.trim(),
                    company: item.querySelector('.exp-company').value.trim(),
                    employment_type: item.querySelector('.exp-type').value.trim(),
                    location: item.querySelector('.exp-location').value.trim(),
                    remote: item.querySelector('.exp-remote').checked,
                    start_date: item.querySelector('.exp-start-date').value,
                    end_date: item.querySelector('.exp-end-date').value,
                    current: item.querySelector('.exp-current').checked,
                    responsibilities: item.querySelector('.exp-responsibilities').value.trim(),
                    skills_used: item.querySelector('.exp-skills').value.split(',').map(s => s.trim()).filter(s => s)
                };
                
                // Only add if required fields are filled
                if (exp.job_title || exp.company) {
                    experience.push(exp);
                }
            });
            data.experience = experience;
            
            // Collect certifications
            const certifications = [];
            document.querySelectorAll('.certification-item').forEach((item, index) => {
                const cert = {
                    name: item.querySelector('.cert-name').value.trim(),
                    organization: item.querySelector('.cert-organization').value.trim(),
                    issue_date: item.querySelector('.cert-issue-date').value,
                    expiry_date: item.querySelector('.cert-expiry-date').value,
                    no_expiry: item.querySelector('.cert-no-expiry').checked,
                    credential_id: item.querySelector('.cert-credential-id').value.trim(),
                    certificate_url: item.querySelector('.cert-certificate-url').value,
                    skills: item.querySelector('.cert-skills').value.split(',').map(s => s.trim()).filter(s => s)
                };
                
                // Only add if required fields are filled
                if (cert.name || cert.organization) {
                    certifications.push(cert);
                }
            });
            data.certifications = certifications;
            
            // Collect projects
            const projects = [];
            document.querySelectorAll('.project-item').forEach((item, index) => {
                const project = {
                    title: item.querySelector('.project-title').value.trim(),
                    type: item.querySelector('.project-type').value.trim(),
                    description: item.querySelector('.project-description').value.trim(),
                    technologies: item.querySelector('.project-technologies').value.split(',').map(s => s.trim()).filter(s => s),
                    role: item.querySelector('.project-role').value.trim()
                };
                
                // Only add if required fields are filled
                if (project.title || project.description) {
                    projects.push(project);
                }
            });
            data.projects = projects;
            
            // Collect achievements
            const achievements = [];
            document.querySelectorAll('.achievement-item').forEach((item, index) => {
                const achievement = {
                    title: item.querySelector('.achievement-title').value.trim(),
                    org: item.querySelector('.achievement-org').value.trim(),
                    date: item.querySelector('.achievement-date').value,
                    description: item.querySelector('.achievement-description').value.trim()
                };
                
                // Only add if required fields are filled
                if (achievement.title || achievement.org) {
                    achievements.push(achievement);
                }
            });
            data.achievements = achievements;
            
            // Collect additional skills
            const skills = [];
            document.querySelectorAll('.skill-item').forEach((item, index) => {
                const skill = {
                    skill_name: item.querySelector('.skill-name').value.trim()
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