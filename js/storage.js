/*
=================================================
Math Learning Center
storage.js (Improved Production Version)
=================================================
*/

const STORAGE_KEY = "mathLearningProgress";
const STUDENT_KEY = "mathStudent";

/* ---------------------------------------------
   Safe JSON Loader
--------------------------------------------- */
function safeJSON(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        console.error(`Failed to parse ${key}:`, e);
        return fallback;
    }
}

/* ---------------------------------------------
   Default Progress Structure
--------------------------------------------- */
function getDefaultProgress() {
    return {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        quizzesCompleted: 0,
        history: [],
        topics: {}
    };
}

/* ---------------------------------------------
   Load Progress (Safe)
--------------------------------------------- */
function loadProgress() {
    return safeJSON(STORAGE_KEY, getDefaultProgress());
}

/* ---------------------------------------------
   Save Progress (Safe)
--------------------------------------------- */
function saveProgress(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Progress save failed:", e);
    }
}

/* ---------------------------------------------
   Reset Progress
--------------------------------------------- */
function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
}

/* ---------------------------------------------
   Default Student Structure
--------------------------------------------- */
function getDefaultStudent(name = "Student", grade = "—") {
    return {
        name,
        grade,
        stats: {
            attempted: 0,
            correct: 0,
            accuracy: 0
        },
        topics: {},
        streak: {
            current: 0,
            lastPractice: null
        },
        achievements: []
    };
}

/* ---------------------------------------------
   Load Student (Safe)
--------------------------------------------- */
function getStudent() {
    return safeJSON(STUDENT_KEY, null);
}

/* ---------------------------------------------
   Create Student
--------------------------------------------- */
function createStudent(name, grade) {
    const student = getDefaultStudent(name, grade);
    saveStudent(student);
    return student;
}

/* ---------------------------------------------
   Save Student (Safe)
--------------------------------------------- */
function saveStudent(student) {
    try {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    } catch (e) {
        console.error("Student save failed:", e);
    }
}

console.log("Improved storage.js loaded");
