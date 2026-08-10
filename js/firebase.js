// =====================================================
// Math Adventure - Firebase Configuration
// =====================================================

// Firebase App
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase Firestore
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyAokmT3EkOno_dqm02DPK3-vpMdPGX56IQ",

    authDomain: "math-adventure-e2ac4.firebaseapp.com",

    projectId: "math-adventure-e2ac4",

    storageBucket: "math-adventure-e2ac4.firebasestorage.app",

    messagingSenderId: "941600052426",

    appId: "1:941600052426:web:ee1f0b78ba70aabeaed033",

    measurementId: "G-CXVVL4W8X7"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const firebaseApp =
    initializeApp(firebaseConfig);


// =====================================================
// FIREBASE AUTHENTICATION
// =====================================================

const auth =
    getAuth(firebaseApp);


// =====================================================
// FIRESTORE DATABASE
// =====================================================

const db =
    getFirestore(firebaseApp);


// =====================================================
// EXPORT
// =====================================================

export {

    auth,

    db,

    // Authentication
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    // Firestore
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp

};

