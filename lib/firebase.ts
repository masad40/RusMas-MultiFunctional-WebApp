import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjhgPyJtMMMNXslIaTqSrn7cnF0ohiw10",
  authDomain: "rusmas-webapp.firebaseapp.com",
  projectId: "rusmas-webapp",
  storageBucket: "rusmas-webapp.firebasestorage.app",
  messagingSenderId: "159243360700",
  appId: "1:159243360700:web:73e9353ae775c7c21ff3b9",
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
