
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDN8xaNazRZZtKVBZHtmOWhdyRFK-Fk514",
  authDomain: "ark-os-b0842.firebaseapp.com",
  projectId: "ark-os-b0842",
  storageBucket: "ark-os-b0842.firebasestorage.app",
  messagingSenderId: "667102824523",
  appId: "1:667102824523:web:96d7d11cdc19e6fb46e5ce",
  measurementId: "G-LYLXJC71WR"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
