import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4TI__H7CgAqzd0qowVy68vr1LZ8GxOdU",
  authDomain: "mods-bbc91.firebaseapp.com",
  databaseURL: "https://mods-bbc91-default-rtdb.firebaseio.com",
  projectId: "mods-bbc91",
  storageBucket: "mods-bbc91.firebasestorage.app",
  messagingSenderId: "57062598328",
  appId: "1:57062598328:web:b3b4603ba43136154f764d",
  measurementId: "G-8J84DFSK4S"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const IMGBB_KEY = "cdb1c90e037e9a74be4bb8d30de5d50f";
export const PIN_SALT = "ChaosStore_2025_SecureSalt";
export const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;