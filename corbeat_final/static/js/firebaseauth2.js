// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD399VovcY6r1vY-P9iAwKazSRu4VU2KwA",
  authDomain: "login-and-signup-580fe.firebaseapp.com",
  projectId: "login-and-signup-580fe",
  storageBucket: "login-and-signup-580fe.firebasestorage.app",
  messagingSenderId: "294175979079",
  appId: "1:294175979079:web:ffad6ab1843b12e2706362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function showMessage(message, divId){
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function(){
      messageDiv.style.opacity = 0;
  }, 5000);
}

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;

            // Save user ID in localStorage
            localStorage.setItem('loggedInUserId', user.uid);

            // Now send the user data to Flask backend
            fetch(loginURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Login successful") {
                    window.location.href = userHomeURL; // Redirect to user home page
                } else {
                    showMessage(data.message, 'signInMessage');
                }
            })
            .catch(error => console.error('Error communicating with backend:', error));
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        });
});