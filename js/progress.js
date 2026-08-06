/*
=================================================
Math Learning Center
progress.js (Improved Version)
=================================================
*/

/* ---------------------------------------------
   Load or Initialize Progress
--------------------------------------------- */
function loadProgress() {
    let data = JSON.parse(localStorage.getItem("progress"));

    if (!data) {
        data = {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            quizzesCompleted: 0,
            history: []
        };
        saveProgress(data);
    }

    return data;
}

function saveProgress(progress) {
    localStorage.setItem("progress", JSON.stringify(progress));
}

/* ---------------------------------------------
   Save Quiz Result
--------------------------------------------- */
function saveQuizResult(score, total) {
    const progress = loadProgress();

    const wrong = total - score;

    progress.totalQuestions += total;
    progress.correctAnswers += score;
    progress.wrongAnswers += wrong;
    progress.quizzesCompleted++;

    const accuracy = Math.round((progress.correctAnswers / progress.totalQuestions) * 100);

    progress.history.push({
        date: new Date().toLocaleDateString(),
        score,
        total,
        accuracy
    });

    saveProgress(progress);
    updateStatistics();
}

/* ---------------------------------------------
   Calculate Accuracy
--------------------------------------------- */
function getAccuracy() {
    const progress = loadProgress();

    if (progress.totalQuestions === 0) return 0;

    return Math.round((progress.correctAnswers / progress.totalQuestions) * 100);
}

/* ---------------------------------------------
   Update Dashboard Statistics
--------------------------------------------- */
function updateStatistics() {
    const container = document.getElementById("statsContainer");
    if (!container) return;

    const progress = loadProgress();
    const accuracy = getAccuracy();

    container.innerHTML = `
        <div class="statCard">
            <div class="statTitle">Questions Completed</div>
            <h2>${progress.totalQuestions}</h2>
        </div>

        <div class="statCard">
            <div class="statTitle">Correct Answers</div>
            <h2>${progress.correctAnswers}</h2>
        </div>

        <div class="statCard">
            <div class="statTitle">Accuracy</div>
            <h2>${accuracy}%</h2>

            <div class="progress">
                <div class="progressFill" style="width:${accuracy}%"></div>
            </div>
        </div>

        <div class="statCard">
            <div class="statTitle">Quizzes Completed</div>
            <h2>${progress.quizzesCompleted}</h2>
        </div>
    `;
}

/* ---------------------------------------------
   Load Statistics on Start
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    updateStatistics();
});

console.log("progress.js loaded");

/* ---------------------------------------------
   Record Individual Answer (Student Stats)
--------------------------------------------- */
function recordAnswer(topic, isCorrect) {
    const student = getStudent();

    if (!student) {
        console.warn("No student logged in");
        return;
    }

    // Ensure stats exist
    if (!student.stats) {
        student.stats = { attempted: 0, correct: 0, accuracy: 0 };
    }

    // Ensure topic stats exist
    if (!student.topics) {
        student.topics = {};
    }

    if (!student.topics[topic]) {
        student.topics[topic] = { attempted: 0, correct: 0 };
    }

    // Update overall stats
    student.stats.attempted++;
    if (isCorrect) student.stats.correct++;

    student.stats.accuracy = Math.round(
        (student.stats.correct / student.stats.attempted) * 100
    );

    // Update topic stats
    student.topics[topic].attempted++;
    if (isCorrect) student.topics[topic].correct++;

    updateStreak(student);
    checkBadges(student);

    saveStudent(student);
}

/* ---------------------------------------------
   Streak Tracking
--------------------------------------------- */
function updateStreak(student) {
    const today = new Date().toDateString();

    if (!student.streak) {
        student.streak = { current: 0, lastPractice: today };
    }

    if (student.streak.lastPractice !== today) {
        student.streak.current++;
        student.streak.lastPractice = today;
    }
}

/* ---------------------------------------------
   Badge System
--------------------------------------------- */
function checkBadges(student) {
    if (!student.achievements) {
        student.achievements = [];
    }

    if (student.stats.attempted >= 100 &&
        !student.achievements.includes("Math Explorer")) {
        student.achievements.push("Math Explorer");
    }

    if (student.stats.accuracy >= 90 &&
        !student.achievements.includes("Accuracy Star")) {
        student.achievements.push("Accuracy Star");
    }
}
