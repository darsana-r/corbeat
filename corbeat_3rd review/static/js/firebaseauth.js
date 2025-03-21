// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import{ getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"

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

function showMessage(message, divId){
  var messageDiv=document.getElementById(divId);
  messageDiv.style.display="block";
  messageDiv.innerHTML=message;
  messageDiv.style.opacity=1;
  setTimeout(function(){
      messageDiv.style.opacity=0;
  },5000);
}

const signUp=document.getElementById("submitSignUp");
signUp.addEventListener('click',(event)=>{
  event.preventDefault();
  const username=document.getElementById('username').value;
  const password=document.getElementById('password').value;
 // const cpassword=document.getElementById('cpassword').value;
  const email=document.getElementById('email').value;

  const auth=getAuth();
  const db=getFirestore();



  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential)=>{
      const user=userCredential.user;
      const userData={
          email: email,
          username: username,
          password:password
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef=doc(db, "users", user.uid);
      setDoc(docRef,userData)
      .then(()=>{
          window.location.href='/login';
      })
      .catch((error)=>{
          console.error("error writing document", error);

      });
  })
  .catch((error)=>{
      const errorCode=error.code;
      if(errorCode=='auth/email-already-in-use'){
          showMessage('Email Address Already Exists !!!', 'signUpMessage');
      }
      else{
          showMessage('unable to create User', 'signUpMessage');
      }
  })
});


  

  const signIn=document.getElementById('submitSignIn');
  signIn.addEventListener('submit', (event)=>{
      event.preventDefault();
      const email=document.getElementById('email').value;
      const password=document.getElementById('password').value;
      const auth=getAuth();

      signInWithEmailAndPassword(auth, email,password)
      .then((userCredential)=>{
      showMessage('login is successful', 'signInMessage');
      const user=userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      console.log("redirecting to homepage");
      window.location.href='/userHome';
      })
      .catch((error)=>{
          const errorCode=error.code;
          if(errorCode==='auth/invalid-credential'){
              showMessage('Incorrect Email or Password', 'signInMessage');
          }
          else{
              showMessage('Account does not Exist', 'signInMessage');
          }
      })
})
