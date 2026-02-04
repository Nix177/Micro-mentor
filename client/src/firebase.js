// Firebase configuration for Micro-Mentor
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDzUfmx3JCZf4639e-QAMpZYrikTWkPx2I",
    authDomain: "chatroulette-test.firebaseapp.com",
    projectId: "chatroulette-test",
    storageBucket: "chatroulette-test.firebasestorage.app",
    messagingSenderId: "477083456462",
    appId: "1:477083456462:web:544b25c8eec39c425e119f",
    measurementId: "G-WH5R8FK713"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
