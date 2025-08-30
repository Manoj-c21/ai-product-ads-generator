// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYKt2t6KUZvFXRsPCu4yaUWs-ecVKHHm8",
  authDomain: "ai-ads-generator-bc786.firebaseapp.com",
  projectId: "ai-ads-generator-bc786",
  storageBucket: "ai-ads-generator-bc786.firebasestorage.app",
  messagingSenderId: "640027442405",
  appId: "1:640027442405:web:1c8bae64dce9252115a80c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
