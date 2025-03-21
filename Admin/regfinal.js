import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDEZUfJqTkfxqBZ4iYHeUifWRlmlPzTDnM",
  authDomain: "admin-e4bb2.firebaseapp.com",
  databaseURL: "https://admin-e4bb2-default-rtdb.firebaseio.com",
  projectId: "admin-e4bb2",
  storageBucket: "admin-e4bb2.firebasestorage.app",
  messagingSenderId: "659079512539",
  appId: "1:659079512539:web:54a00d7022b420ccb527fe"
};

const userFirebaseConfig = {
  apiKey: "AIzaSyD399VovcY6r1vY-P9iAwKazSRu4VU2KwA",
  authDomain: "login-and-signup-580fe.firebaseapp.com",
  projectId: "login-and-signup-580fe",
  storageBucket: "login-and-signup-580fe.firebasestorage.app",
  messagingSenderId: "294175979079",
  appId: "1:294175979079:web:ffad6ab1843b12e2706362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Initialize second Firebase app for user data (with an alias)
const userApp = initializeApp(userFirebaseConfig, "userApp");
const firestoreDB = getFirestore(userApp); // Firestore instance

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
// ✅ Function to display data in the table
function AddAllItemsToTable(doctors) {
  const tableBody = document.querySelector("#doctorTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  doctors.forEach((doctor) => {
    let row = tableBody.insertRow();
    row.innerHTML = `
      <td>${doctor.id}</td>
      <td>${doctor.name}</td>
      <td>${doctor.email}</td>
      <td>${doctor.contact}</td>
      <td>${doctor.hospitalName}</td>
      <td>${doctor.experience}</td>
    `;
  });
}

// ✅ Load data when the window loads
//window.onload = () => {
 // console.log("Loading doctors data...");
  //GetAllDataOnce();
//};
function GetAllDataOnce() {
    const dbref = ref(db);
  
    get(child(dbref, "doctorForm"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let doctors = [];
          snapshot.forEach((childSnapshot) => {
            doctors.push(childSnapshot.val());
          });
  
          // ✅ Display doctors in table
          AddAllItemsToTable(doctors);
  
          // ✅ Update total count on the dashboard
          updateDoctorCount(doctors.length);
        } else {
          console.log("No data available");
          updateDoctorCount(0); // Set count to zero if no data exists
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
      });
  }
// ✅ Function to update doctor count on dashboard
function updateDoctorCount(count) {
    document.getElementById("doctor-count").innerText = count;
  }
  // ✅ Function to update user count on dashboard
async function updateUserCount() {
    try {
      const querySnapshot = await getDocs(collection(firestoreDB, "users"));
      const userCount = querySnapshot.size;
      document.getElementById("user-count").innerText = userCount;
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  }
  window.onload = () => {
    console.log("Loading dashboard data...");
    
    // Load both user and doctor data
    updateUserCount(); 
    GetAllDataOnce(); 
  };
  
  
  // ✅ Load data when the window loads
  //window.onload = () => {
    //console.log("Loading dashboard data...");
   // updateUserCount(); // Load user count
 // };
      
  
 


  