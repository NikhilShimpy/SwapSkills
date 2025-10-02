// setting up firebase with our website
const firebaseApp = firebase.initializeApp({
   apiKey: "AIzaSyDS8tGustKzem7u8U5ntcLMimgLJC_fQWI",
  authDomain: "skillswap-21922.firebaseapp.com",
  projectId: "skillswap-21922",
  storageBucket: "skillswap-21922.firebasestorage.app",
  messagingSenderId: "942449711732",
  appId: "1:942449711732:web:ed1ac7c996deb34b998f21",
  measurementId: "G-DL61KXD2YR"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();



// Sign up function
// ------------------- SIGN UP -----------------------
const signUp = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      const userId = result.user.uid;
      console.log("User signed up:", userId);

      // Optional: set session
      fetch('/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      }).then(() => {
        alert("Signup successful! Redirecting...");
        window.location.href = "/"; // to home
      });

    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert("Email already in use. Try logging in.");
      } else {
        alert("Error: " + error.message);
      }
    });
};

const signIn = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      const userId = result.user.uid;
      console.log("Signed in:", userId);

      fetch('/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      }).then(() => {
        alert("Login successful!");
        window.location.href = "/";
      });
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        alert("No account found. Please sign up.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Incorrect password.");
      } else {
        alert("Error: " + error.message);
      }
    });
};

