/*
=================================================

Math Learning Center

storage.js

Handles:
- Saving data
- Loading data
- Local Storage

=================================================
*/

const STORAGE_KEY = "mathLearningProgress";

/*
=====================================
Default User Data
=====================================
*/

function getDefaultProgress() {
  return {

    totalQuestions : 0,

    correctAnswers : 0,

    wrongAnswers : 0,

    quizzesCompleted : 0,

    history : [],

    topics : {}

  };
}

/*
=====================================
Load Progress
=====================================
*/

function loadProgress() {
  let data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return getDefaultProgress();
  }

  return JSON.parse(data);
}

/*
=====================================
Save Progress
=====================================
*/

function saveProgress(data) {
  localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(data)

  );
}

/*
=====================================
Reset Progress
=====================================
*/

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

console.log("storage.js loaded");

/*
=====================================
student name and Progress
=====================================
*/

function getStudent() {
  let data = localStorage.getItem("mathStudent");

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

function createStudent(name, grade) {
  let student = {

    name : name,

    grade : grade,

    stats : {

      attempted : 0,

      correct : 0,

      accuracy : 0

    },

    topics : {},

    streak : {

      current : 0,

      lastPractice : null

    },

    achievements : []

  };

  localStorage.setItem("mathStudent", JSON.stringify(student));

  return student;
}

function saveStudent(student) {
  localStorage.setItem(

      "mathStudent",

      JSON.stringify(student)

  );
}
