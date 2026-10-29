// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ТВОЯТ config (замени с реалния)
const firebaseConfig = {
  apiKey: "AIzaSyA60UjS-hl0LKyx96B9mNCacFxWrVZREcU",
  authDomain: "online-menu-398bc.firebaseapp.com",
  projectId: "online-menu-398bc",
  storageBucket: "online-menu-398bc.firebasestorage.app",
  messagingSenderId: "634546039975",
  appId: "1:634546039975:web:3d2c1ff3e73e3b0158ff82"
};

// Init
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
