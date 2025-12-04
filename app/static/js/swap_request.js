// Swap Request Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSwapRequest();
});

function initializeSwapRequest() {
    try {
        console.log('Initializing swap request page...');
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Initialize character counter
        initializeCharCounter();
        
        // Initialize form validation
        initializeFormValidation();
        
        // Add animations
        initializeAnimations();
        
    } catch (error) {
        console.error('Error initializing swap request:', error);
    }
}

function initializeEventListeners() {
    // Form submission
    const form = document.getElementById('swapRequestForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Skill selection
    const skillOptions = document.querySelectorAll('.skill-option');
    skillOptions.forEach(option => {
        option.addEventListener('click', function() {
            const skill = this.dataset.skill;
            const type = this.dataset.type || this.parentElement.classList.contains('offered') ? 'offered' : 'requested';
            selectSkill(this, type, skill);
        });
    });
    
    // Message template buttons
    const templateBtns = document.querySelectorAll('.template-btn');
    templateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const templateNum = parseInt(this.textContent.match(/\d/)?.[0]) || 1;
            useTemplate(templateNum);
        });
    });
    
    // Terms checkbox validation
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', validateForm);
    }
}

function initializeCharCounter() {
    const textarea = document.getElementById('message');
    if (!textarea) return;
    
    const charCount = document.getElementById('charCount');
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // Visual feedback for length
        if (length > 450) {
            charCount.style.color = 'var(--warning)';
        } else if (length > 300) {
            charCount.style.color = 'var(--primary)';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    });
}

function initializeFormValidation() {
    const form = document.getElementById('swapRequestForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });
    
    // Initial validation
    validateForm();
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (field.type === 'checkbox') {
        field.setCustomValidity(field.checked ? '' : 'You must agree to the terms');
    } else {
        field.setCustomValidity(isValid ? '' : 'This field is required');
    }
    
    // Visual feedback
    if (field.type !== 'hidden') {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            if (!isValid && field.value.length > 0) {
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        }
    }
    
    validateForm();
}

function validateForm() {
    const form = document.getElementById('swapRequestForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !submitBtn) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
            if (!field.checked) allValid = false;
        } else if (field.type === 'hidden') {
            // Check if hidden field has value
            if (!field.value.trim()) allValid = false;
        } else {
            if (!field.value.trim()) allValid = false;
        }
    });
    
    // Update submit button state
    submitBtn.disabled = !allValid;
    submitBtn.style.opacity = allValid ? '1' : '0.6';
    submitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
    
    return allValid;
}

function selectSkill(element, type, skill = null) {
    const skillValue = skill || element.dataset.skill;
    const skillText = element.querySelector('span')?.textContent || skillValue;
    
    // Remove selected class from all options of this type
    const skillOptions = element.parentElement.querySelectorAll('.skill-option');
    skillOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Update hidden input
    const inputId = type === 'offered' ? 'your_skill' : 'their_skill';
    const input = document.getElementById(inputId);
    if (input) {
        input.value = skillValue;
    }
    
    // Update preview
    updatePreview(type, skillText);
    
    // Validate form
    validateForm();
    
    // Add animation
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

function updatePreview(type, skillText) {
    const previewId = type === 'offered' ? 'offeredSkillPreview' : 'requestedSkillPreview';
    const preview = document.getElementById(previewId);
    
    if (preview) {
        const icon = type === 'offered' ? 'fa-share' : 'fa-hand-holding-heart';
        preview.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${skillText}</span>
        `;
        preview.style.border = '2px solid var(--primary)';
        preview.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))';
    }
}

function useTemplate(templateNumber) {
    const textarea = document.getElementById('message');
    if (!textarea) return;
    
    const templates = {
        1: `Hi! I'd love to exchange skills with you. I can help you master [your skill] and I'm really excited to learn [their skill] from you. Let me know what time works best for you!`,
        2: `Hello, I'm interested in a skill swap. I have experience with [your skill] and would be happy to share my knowledge. In exchange, I'd appreciate learning [their skill] from you. Looking forward to collaborating!`,
        3: `Hey! Quick swap idea: I teach you [your skill], you teach me [their skill]. Sound good? Let me know your availability.`
    };
    
    const selectedSkill = document.getElementById('your_skill')?.value || '[your skill]';
    const requestedSkill = document.getElementById('their_skill')?.value || '[their skill]';
    
    let template = templates[templateNumber] || templates[1];
    template = template.replace('[your skill]', selectedSkill);
    template = template.replace('[their skill]', requestedSkill);
    
    textarea.value = template;
    textarea.dispatchEvent(new Event('input'));
    
    // Animate the template button
    const templateBtn = document.querySelector(`.template-btn:nth-child(${templateNumber})`);
    if (templateBtn) {
        templateBtn.style.transform = 'scale(0.95)';
        templateBtn.style.background = 'var(--primary)';
        templateBtn.style.color = 'white';
        
        setTimeout(() => {
            templateBtn.style.transform = '';
        }, 300);
        
        setTimeout(() => {
            templateBtn.style.background = '';
            templateBtn.style.color = '';
        }, 2000);
    }
}

function previewSwap() {
    const offeredSkill = document.getElementById('your_skill')?.value;
    const requestedSkill = document.getElementById('their_skill')?.value;
    const message = document.getElementById('message')?.value;
    
    if (!offeredSkill || !requestedSkill) {
        showToast('Please select both skills first', 'warning');
        return;
    }
    
    const previewContent = document.getElementById('detailedPreview');
    if (!previewContent) return;
    
    const offeredText = document.querySelector('.skill-option.selected[data-skill="' + offeredSkill + '"]')?.textContent || offeredSkill;
    const requestedText = document.querySelector('.skill-option.selected[data-skill="' + requestedSkill + '"]')?.textContent || requestedSkill;
    
    previewContent.innerHTML = `
        <div class="preview-details">
            <div class="preview-section">
                <h4>Swap Details</h4>
                <div class="swap-details-flow">
                    <div class="detail-step">
                        <div class="detail-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="detail-content">
                            <strong>You Offer:</strong>
                            <span class="skill-badge offered">${offeredText}</span>
                        </div>
                    </div>
                    
                    <div class="detail-arrow">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    
                    <div class="detail-step">
                        <div class="detail-icon">
                            <i class="fas fa-user-friends"></i>
                        </div>
                        <div class="detail-content">
                            <strong>You Receive:</strong>
                            <span class="skill-badge wanted">${requestedText}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${message ? `
            <div class="preview-section">
                <h4>Your Message</h4>
                <div class="message-preview">
                    <p>${message}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="preview-section">
                <h4>What Happens Next?</h4>
                <div class="next-steps">
                    <div class="step">
                        <i class="fas fa-paper-plane"></i>
                        <span>Your request will be sent to the user</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-bell"></i>
                        <span>You'll be notified when they respond</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-calendar-check"></i>
                        <span>Schedule your skill exchange session</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-star"></i>
                        <span>Rate each other after the swap</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for preview
    const style = document.createElement('style');
    style.textContent = `
        .preview-details {
            padding: 20px;
        }
        .preview-section {
            margin-bottom: 30px;
        }
        .preview-section h4 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--text);
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-light);
        }
        .swap-details-flow {
            display: flex;
            align-items: center;
            gap: 30px;
            margin: 20px 0;
        }
        .detail-step {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background: var(--surface-dark);
            border-radius: var(--radius);
        }
        .detail-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
        }
        .detail-step:nth-child(3) .detail-icon {
            background: linear-gradient(135deg, var(--secondary), #db2777);
        }
        .detail-content {
            flex: 1;
        }
        .skill-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-top: 5px;
        }
        .skill-badge.offered {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .skill-badge.wanted {
            background: rgba(236, 72, 153, 0.1);
            color: var(--secondary);
            border: 1px solid rgba(236, 72, 153, 0.2);
        }
        .detail-arrow {
            font-size: 24px;
            color: var(--primary);
        }
        .message-preview {
            background: var(--surface-dark);
            padding: 20px;
            border-radius: var(--radius);
            border-left: 4px solid var(--primary);
            font-style: italic;
            line-height: 1.6;
        }
        .next-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: var(--surface-dark);
            border-radius: var(--radius);
        }
        .step i {
            color: var(--primary);
            font-size: 18px;
        }
        .step span {
            font-size: 14px;
            color: var(--text);
        }
    `;
    document.head.appendChild(style);
    
    // Show preview modal
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.classList.add('active');
    }
}

function closePreviewModal() {
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.classList.remove('active');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(form.action || window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Show success modal
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.add('active');
            }
            
            // Update swap preview with success animation
            const swapPreview = document.getElementById('swapPreview');
            if (swapPreview) {
                swapPreview.style.border = '2px solid var(--success)';
                swapPreview.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
                
                // Add confetti effect
                createConfetti();
            }
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                resetFormState();
            }, 3000);
            
        } else {
            showToast(result.message || 'Failed to send swap request', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Network error. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function resetFormState() {
    // Reset skill selections
    const skillOptions = document.querySelectorAll('.skill-option');
    skillOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Reset preview
    const previews = ['offeredSkillPreview', 'requestedSkillPreview'];
    previews.forEach(id => {
        const preview = document.getElementById(id);
        if (preview) {
            preview.innerHTML = `
                <i class="fas fa-${id.includes('offered') ? 'share' : 'hand-holding-heart'}"></i>
                <span>Select a skill</span>
            `;
            preview.style.border = '2px dashed var(--border)';
            preview.style.background = 'white';
        }
    });
    
    // Reset hidden inputs
    const hiddenInputs = ['your_skill', 'their_skill'];
    hiddenInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    // Reset message counter
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0';
    
    // Reset terms
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) termsCheckbox.checked = false;
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content ${type}">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface);
        border-radius: var(--radius);
        padding: 16px 20px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : 'var(--success)'};
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0.8;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 50;
        let y = 50;
        
        function animate() {
            x += vx;
            y += vy;
            vy += 0.1; // gravity
            
            confetti.style.left = x + '%';
            confetti.style.top = y + '%';
            confetti.style.opacity = parseFloat(confetti.style.opacity) - 0.02;
            
            if (parseFloat(confetti.style.opacity) > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
}

function initializeAnimations() {
    // Add staggered animation to skill options
    const skillOptions = document.querySelectorAll('.skill-option');
    skillOptions.forEach((option, index) => {
        option.style.animationDelay = `${index * 0.05}s`;
        option.classList.add('animate-in');
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(20px); opacity: 0; }
        }
        .animate-in {
            animation: slideInUp 0.5s ease forwards;
            opacity: 0;
        }
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Make functions available globally
window.selectSkill = selectSkill;
window.useTemplate = useTemplate;
window.previewSwap = previewSwap;
window.closePreviewModal = closePreviewModal;
window.closeSuccessModal = closeSuccessModal;