import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBpUED221Qngm9iO2vMU8HRzOaPzAQgbb0",
    authDomain: "tidal-mare.firebaseapp.com",
    projectId: "tidal-mare",
    storageBucket: "tidal-mare.firebasestorage.app",
    messagingSenderId: "411121995154",
    appId: "1:411121995154:web:9be647215a9de1efc8454b",
    measurementId: "G-YZNZQZJT7T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
