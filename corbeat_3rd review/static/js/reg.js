import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyDEZUfJqTkfxqBZ4iYHeUifWRlmlPzTDnM",
  authDomain: "admin-e4bb2.firebaseapp.com",
  databaseURL: "https://admin-e4bb2-default-rtdb.firebaseio.com",
  projectId: "admin-e4bb2",
  storageBucket: "admin-e4bb2.firebasestorage.app",
  messagingSenderId: "659079512539",
  appId: "1:659079512539:web:54a00d7022b420ccb527fe"
};
/*
firebase.initializeApp(firebaseConfig);
//reference for database
var doctorFormDB=firebase.database().ref('doctorForm');

document.getElementById("doctorForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var id = getElementVal("doctor-id");
  var name = getElementVal("doctor-name");
  var emailid = getElementVal("email");
  var contact = getElementVal("contact");
  var hname = getElementVal("hospital-name");
  var exp = getElementVal("experience");
  console.log(id,name,emailid,contact,hname,exp);
}
const getElementVal =(id) =>{
    return document.getElementById('id').value;

};*/
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference for the database
const doctorFormDB = ref(db, "doctorForm");

// Form Submission
document.querySelector(".doctorForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = getElementVal("doctor-id");
  const name = getElementVal("doctor-name");
  const email = getElementVal("email");
  const contact = getElementVal("contact");
  const hospitalName = getElementVal("hospital-name");
  const experience = getElementVal("experience");

  saveDoctor(id, name, email, contact, hospitalName, experience);
});

// Function to save doctor data
const saveDoctor = (id, name, email, contact, hospitalName, experience) => {
  const newDoctorRef = push(doctorFormDB); // Push a new entry
  set(newDoctorRef, {
    id,
    name,
    email,
    contact,
    hospitalName,
    experience
  }).then(() => {
    alert("Doctor added successfully!");
    document.querySelector(".doctorForm").reset();
  }).catch((error) => {
    console.error("Error saving data:", error);
  });
};

// Function to get input values
const getElementVal = (id) => document.getElementById(id).value;

 