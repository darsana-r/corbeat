import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEZUfJqTkfxqBZ4iYHeUifWRlmlPzTDnM",
  authDomain: "admin-e4bb2.firebaseapp.com",
  databaseURL: "https://admin-e4bb2-default-rtdb.firebaseio.com",
  projectId: "admin-e4bb2",
  storageBucket: "admin-e4bb2.firebasestorage.app",
  messagingSenderId: "659079512539",
  appId: "1:659079512539:web:54a00d7022b420ccb527fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference for the database
const doctorFormDB = ref(db, "doctorForm");

// Form Submission
document.querySelector(".doctorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = getElementVal("doctor-id");
  const name = getElementVal("doctor-name");
  const email = getElementVal("email");
  const contact = getElementVal("contact");
  const hospitalName = getElementVal("hospital-name");
  const experience = getElementVal("experience");

  // Check if any field is empty
  if (!id || !name || !email || !contact || !hospitalName || !experience) {
    alert("All fields are required!");
    return;
  }

  // Check if doctor ID already exists
  const doctorExists = await checkDoctorExists(id);
  if (doctorExists) {
    alert("Doctor with this ID already exists!");
    return;
  }

  // Save doctor data if ID is unique
  saveDoctor(id, name, email, contact, hospitalName, experience);
});

// Function to check if doctor ID already exists
const checkDoctorExists = async (id) => {
  const snapshot = await get(child(ref(db), `doctorForm/${id}`));
  return snapshot.exists();
};

// Function to save doctor data
const saveDoctor = (id, name, email, contact, hospitalName, experience) => {
  set(ref(db, `doctorForm/${id}`), {
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
