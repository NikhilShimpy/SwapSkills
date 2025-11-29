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

console.log("🚀 Initializing Firebase...");

// Global variables
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseInitialized = false;

// Initialize Firebase when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM Content Loaded");
    initializeFirebase();
});

function initializeFirebase() {
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            throw new Error("Firebase SDK not loaded");
        }

        console.log("🔥 Firebase SDK detected, initializing app...");
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseDb = firebase.firestore();
        
        console.log("✅ Firebase initialized successfully!");
        
        isFirebaseInitialized = true;
        
        // Initialize authentication
        initializeAuth();
        
    } catch (error) {
        console.error("❌ Firebase initialization failed:", error);
        showMessage("Firebase initialization failed: " + error.message, "error");
    }
}

function initializeAuth() {
    console.log("🛠️ Setting up authentication...");
    
    try {
        // Setup form listeners
        setupFormListeners();
        
        // Setup auth state listener
        setupAuthStateListener();
        
        console.log("✅ Authentication setup complete!");
        
    } catch (error) {
        console.error("❌ Auth setup failed:", error);
        showMessage("Authentication setup failed: " + error.message, "error");
    }
}

function setupFormListeners() {
    // Email/Password Sign In
    const emailSignInForm = document.getElementById('emailSignInForm');
    if (emailSignInForm) {
        emailSignInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSignIn();
        });
    }

    // Email/Password Sign Up
    const emailSignUpForm = document.getElementById('emailSignUpForm');
    if (emailSignUpForm) {
        emailSignUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSignUp();
        });
    }

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }

    // Password confirmation check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }

    console.log("✅ Form listeners setup complete");
}

function setupAuthStateListener() {
    if (!firebaseAuth) {
        console.error("❌ Firebase Auth not available for state listener");
        return;
    }
    
    firebaseAuth.onAuthStateChanged((user) => {
        console.log("👤 Auth state changed - User:", user ? user.email : "None");
        if (user) {
            console.log("✅ User authenticated:", user.uid);
        }
    }, (error) => {
        console.error("❌ Auth state listener error:", error);
    });
}

// Email/Password Sign In
async function handleEmailSignIn() {
    console.log("🔐 Starting email sign in...");
    
    if (!isFirebaseInitialized || !firebaseAuth) {
        showMessage("Authentication service not available. Please refresh the page.", "error");
        return;
    }

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log("🔄 Signing in with email:", email);
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("✅ Sign in successful:", user.uid);
        
        await setSessionAndRedirect(user);
        
    } catch (error) {
        console.error("❌ Sign in error:", error);
        showLoading(false);
        handleAuthError(error);
    }
}

// Email/Password Sign Up
async function handleEmailSignUp() {
    console.log("📝 Starting email sign up...");
    
    if (!isFirebaseInitialized || !firebaseAuth) {
        showMessage("Authentication service not available. Please refresh the page.", "error");
        return;
    }

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log("🔄 Creating user with email:", email);
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("✅ User created:", user.uid);
        
        // Create user profile in Firestore
        if (firebaseDb) {
            try {
                await firebaseDb.collection('users').doc(user.uid).set({
                    email: email,
                    name: email.split('@')[0],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    profileVisibility: 'Public',
                    photo_url: '/static/default-profile.png',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log("✅ User profile created in Firestore");
            } catch (firestoreError) {
                console.error("❌ Firestore error (non-critical):", firestoreError);
                // Continue even if Firestore fails
            }
        }

        await setSessionAndRedirect(user);
        
    } catch (error) {
        console.error("❌ Sign up error:", error);
        showLoading(false);
        handleAuthError(error);
    }
}

// Google Sign In - UPDATED with proper implementation
async function signInWithGoogle() {
    console.log("🔵 Starting Google sign in...");
    
    if (!isFirebaseInitialized || !firebaseAuth) {
        showMessage("Authentication service not available. Please refresh the page.", "error");
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Add scopes for Google authentication
    provider.addScope('email');
    provider.addScope('profile');
    
    // Optional: Set custom parameters
    provider.setCustomParameters({
        'prompt': 'select_account'
    });

    showLoading(true);

    try {
        console.log("🔄 Opening Google sign in popup...");
        const result = await firebaseAuth.signInWithPopup(provider);
        const user = result.user;
        console.log("✅ Google sign in successful:", user.uid);
        
        // Get the Google access token (useful for Google APIs)
        const credential = result.credential;
        const token = credential.accessToken;
        console.log("🔑 Google access token obtained");
        
        // Create user profile if needed
        if (firebaseDb) {
            try {
                const userDoc = await firebaseDb.collection('users').doc(user.uid).get();
                if (!userDoc.exists) {
                    await firebaseDb.collection('users').doc(user.uid).set({
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0],
                        photo_url: user.photoURL || '/static/default-profile.png',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        profileVisibility: 'Public',
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        authProvider: 'google'
                    });
                    console.log("✅ Google user profile created");
                } else {
                    console.log("✅ Google user profile already exists");
                }
            } catch (firestoreError) {
                console.error("❌ Firestore error (non-critical):", firestoreError);
                // Continue even if Firestore fails
            }
        }

        await setSessionAndRedirect(user);
        
    } catch (error) {
        console.error("❌ Google sign in error:", error);
        showLoading(false);
        
        if (error.code === 'auth/popup-blocked') {
            showMessage('Popup was blocked. Please allow popups for this site.', 'error');
        } else if (error.code === 'auth/popup-closed-by-user') {
            showMessage('Sign in was cancelled.', 'error');
        } else if (error.code === 'auth/unauthorized-domain') {
            showMessage('This domain is not authorized for Google sign-in. Please contact support.', 'error');
        } else {
            handleAuthError(error);
        }
    }
}

// Password Reset
function showForgotPassword() {
    console.log("🔓 Showing forgot password form");
    document.getElementById('forgotPasswordForm').style.display = 'block';
    document.querySelector('.auth-form').style.display = 'none';
    document.querySelector('.social-auth').style.display = 'none';
}

function hideForgotPassword() {
    console.log("🔓 Hiding forgot password form");
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.querySelector('.auth-form').style.display = 'block';
    document.querySelector('.social-auth').style.display = 'block';
}

async function resetPassword() {
    if (!isFirebaseInitialized || !firebaseAuth) {
        showMessage("Authentication service not available. Please refresh the page.", "error");
        return;
    }

    const email = document.getElementById('resetEmail')?.value.trim();
    console.log("🔓 Resetting password for:", email);
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }

    showLoading(true);

    try {
        console.log("🔄 Sending password reset email...");
        await firebaseAuth.sendPasswordResetEmail(email);
        showLoading(false);
        showMessage('Password reset email sent! Check your inbox.', 'success');
        hideForgotPassword();
        
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
        showLoading(false);
        handleAuthError(error);
    }
}

// Utility Functions
async function setSessionAndRedirect(user) {
    try {
        console.log("🔄 Setting session for user:", user.uid);
        
        // Get the ID token
        const idToken = await user.getIdToken();
        console.log("🔑 ID token obtained");
        
        const response = await fetch('/set-session', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user_id: user.uid,
                email: user.email,
                id_token: idToken
            })
        });

        const data = await response.json();
        console.log("📡 Session response:", data);

        if (response.ok && data.status === 'success') {
            console.log("✅ Session set successfully, redirecting...");
            showMessage('Welcome! Redirecting to SkillSwap...', 'success');
            setTimeout(() => {
                window.location.href = '/app';
            }, 1500);
        } else {
            throw new Error(data.error || 'Failed to set session');
        }
    } catch (error) {
        console.error('❌ Session error:', error);
        // Still redirect even if session setting fails
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '/app';
        }, 1500);
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('password')?.value;
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;

    let strength = 'weak';
    let message = 'Weak password';

    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'strong';
        message = 'Strong password';
    } else if (password.length >= 6) {
        strength = 'medium';
        message = 'Medium password';
    }

    strengthElement.textContent = message;
    strengthElement.className = `password-strength ${strength}`;
}

function checkPasswordMatch() {
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const matchElement = document.getElementById('passwordMatch');
    if (!matchElement) return;

    if (!confirmPassword) {
        matchElement.textContent = '';
        return;
    }

    if (password === confirmPassword) {
        matchElement.textContent = 'Passwords match';
        matchElement.className = 'password-match match';
    } else {
        matchElement.textContent = 'Passwords do not match';
        matchElement.className = 'password-match mismatch';
    }
}

function handleAuthError(error) {
    console.error('❌ Auth error:', error);
    
    let message = 'Authentication failed. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            message = 'Email already in use. Try logging in.';
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;
        case 'auth/weak-password':
            message = 'Password is too weak. Use at least 6 characters.';
            break;
        case 'auth/user-not-found':
            message = 'No account found. Please sign up.';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password.';
            break;
        case 'auth/too-many-requests':
            message = 'Too many attempts. Try again later.';
            break;
        case 'auth/popup-blocked':
            message = 'Popup was blocked. Please allow popups for this site.';
            break;
        case 'auth/operation-not-allowed':
            message = 'This sign-in method is not enabled. Contact support.';
            break;
        case 'auth/unauthorized-domain':
            message = 'This domain is not authorized. Please contact support.';
            break;
        case 'auth/network-request-failed':
            message = 'Network error. Please check your connection.';
            break;
        default:
            message = error.message || 'Authentication error';
    }
    
    showMessage(message, 'error');
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

function showMessage(message, type = 'info') {
    console.log(`💬 ${type.toUpperCase()}: ${message}`);
    
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(messageContainer);
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    if (type === 'success') {
        messageElement.style.borderLeftColor = '#10b981';
        messageElement.style.color = '#10b981';
    } else if (type === 'error') {
        messageElement.style.borderLeftColor = '#ef4444';
        messageElement.style.color = '#ef4444';
    } else {
        messageElement.style.borderLeftColor = '#6366f1';
        messageElement.style.color = '#6366f1';
    }

    messageContainer.appendChild(messageElement);

    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations
if (!document.querySelector('#auth-animations')) {
    const style = document.createElement('style');
    style.id = 'auth-animations';
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

// Make functions globally available
window.signInWithGoogle = signInWithGoogle;
window.showForgotPassword = showForgotPassword;
window.hideForgotPassword = hideForgotPassword;
window.resetPassword = resetPassword;

console.log("🎉 Auth module loaded!");