import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDT7jodnZvRM1mlTL89G1eIY0TMKuXrtmQ",
  authDomain: "flujo-procesos-hdm.firebaseapp.com",
  projectId: "flujo-procesos-hdm",
  storageBucket: "flujo-procesos-hdm.firebasestorage.app",
  messagingSenderId: "818975457508",
  appId: "1:818975457508:web:83ed6cf41544b177eb6cf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);