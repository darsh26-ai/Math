// =====================================================
// Math Adventure - Firebase
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyAokmT3EkOno_dqm02DPK3-vpMdPGX56IQ",

    authDomain:
        "math-adventure-e2ac4.firebaseapp.com",

    projectId:
        "math-adventure-e2ac4",

    storageBucket:
        "math-adventure-e2ac4.firebasestorage.app",

    messagingSenderId:
        "941600052426",

    appId:
        "1:941600052426:web:ee1f0b78ba70aabeaed033",

    measurementId:
        "G-CXVVL4W8X7"
};


// =====================================================
// INITIALIZE
// =====================================================

const firebaseApp =
    initializeApp(firebaseConfig);


const auth =
    getAuth(firebaseApp);


const db =
    getFirestore(firebaseApp);


// =====================================================
// EXPORT
// =====================================================

export {

    auth,
    db,

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp

};
