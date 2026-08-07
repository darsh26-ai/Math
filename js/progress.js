/*
=================================================
Math Learning Center
progress.js (Improved Production Version)
=================================================
*/

/* ---------------------------------------------
   Safe JSON Loader
--------------------------------------------- */
function safeJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

/* ---------------------------------------------
   Load or Initialize Progress
--------------------------------------------- */
function loadProgress() {
    return safeJSON("progress", {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        quizzesCompleted: 0,
        history: []
    });
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

    const accuracy = Math.round(
        (progress.correctAnswers / progress.totalQuestions) * 100
    );

    progress.history.push({
        date: new Date().toLocaleDateString(),
        score,
        total,
        accuracy
    });

    if (progress.history.length > 200) {
        progress.history.shift();
    }

    saveProgress(progress);
    updateStatistics();
}

/* ---------------------------------------------
   Calculate Accuracy
--------------------------------------------- */
function getAccuracy() {
    const p = loadProgress();
    if (p.totalQuestions === 0) return 0;
    return Math.round((p.correctAnswers / p.totalQuestions) * 100);
}

/* ---------------------------------------------
   Update Dashboard Statistics
--------------------------------------------- */
function updateStatistics() {
    const container = document.getElementById("statsContainer");
    if (!container) return;

    const p = loadProgress();
    const accuracy = getAccuracy();

    container.innerHTML = `
        <div class="statCard">
            <div class="statTitle">Questions Completed</div>
            <h2>${p.totalQuestions}</h2>
        </div>

        <div class="statCard">
            <div class="statTitle">Correct Answers</div>
            <h2>${p.correctAnswers}</h2>
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
            <h2>${p.quizzesCompleted}</h2>
        </div>
    `;
}

/* ---------------------------------------------
   Load Statistics on Start
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    updateStatistics();
});

console.log("Improved progress.js loaded");

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
    student.stats = student.stats || { attempted: 0, correct: 0, accuracy: 0 };

    // Ensure topic stats exist
    student.topics = student.topics || {};
    student.topics[topic] = student.topics[topic] || { attempted: 0, correct: 0 };

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
   Streak Tracking (Improved)
--------------------------------------------- */
function updateStreak(student) {
    const today = new Date().toDateString();

    student.streak = student.streak || { current: 0, lastPractice: today };

    if (student.streak.lastPractice !== today) {
        student.streak.current++;
        student.streak.lastPractice = today;
    }
}

/* ---------------------------------------------
   Badge System (Improved)
--------------------------------------------- */
function checkBadges(student) {
    student.achievements = student.achievements || [];

    const addBadge = (name) => {
        if (!student.achievements.includes(name)) {
            student.achievements.push(name);
        }
    };

    if (student.stats.attempted >= 100) {
        addBadge("Math Explorer");
    }

    if (student.stats.accuracy >= 90) {
        addBadge("Accuracy Star");
    }

    if (student.streak.current >= 7) {
        addBadge("7-Day Streak");
    }

    if (student.topics && Object.keys(student.topics).length >= 5) {
        addBadge("Topic Master");
    }
}
