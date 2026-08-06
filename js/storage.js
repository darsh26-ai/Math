/*
=================================================
Math Learning Center
storage.js (Improved Version)
=================================================
*/

const STORAGE_KEY = "mathLearningProgress";
const STUDENT_KEY = "mathStudent";

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
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return data || getDefaultProgress();
    } catch (e) {
        console.error("Progress load failed:", e);
        return getDefaultProgress();
    }
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
   Student Handling
--------------------------------------------- */
function getStudent() {
    try {
        const data = JSON.parse(localStorage.getItem(STUDENT_KEY));
        return data || null;
    } catch (e) {
        console.error("Student load failed:", e);
        return null;
    }
}

function createStudent(name, grade) {
    const student = {
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

    saveStudent(student);
    return student;
}

function saveStudent(student) {
    try {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    } catch (e) {
        console.error("Student save failed:", e);
    }
}

console.log("storage.js loaded");
