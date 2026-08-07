/*
=================================================
Math Learning Center
dashboard.js (Improved Production Version)
=================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    try {
        loadDashboard();
    } catch (err) {
        console.error("Dashboard failed to load:", err);
    }
});

/* ---------------------------------------------
   Utility: Safe DOM getter
--------------------------------------------- */
function el(id) {
    return document.getElementById(id);
}

/* ---------------------------------------------
   Safe JSON loader
--------------------------------------------- */
function safeJSON(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
}

/* ---------------------------------------------
   Normalize Student Object
--------------------------------------------- */
function normalizeStudent(s) {
    return {
        name: s?.name || "Student",
        grade: s?.grade || "—",
        stats: {
            attempted: s?.stats?.attempted || 0,
            accuracy: s?.stats?.accuracy || 0
        },
        streak: {
            current: s?.streak?.current || 0
        },
        achievements: Array.isArray(s?.achievements) ? s.achievements : [],
        topics: s?.topics || {}
    };
}

/* ---------------------------------------------
   Main Dashboard Loader
--------------------------------------------- */
function loadDashboard() {
    const rawStudent = safeJSON("studentProfile");
    const student = normalizeStudent(rawStudent);

    // Basic fields
    safeSet("studentName", "👋 " + student.name);
    safeSet("studentGrade", student.grade);

    // Stats
    safeSet("questionsCompleted", student.stats.attempted);
    safeSet("accuracy", student.stats.accuracy + "%");

    // Streak
    safeSet("streak", student.streak.current + " Days");

    // Badges
    safeSet("badgeCount", student.achievements.length);
    displayBadges(student.achievements);

    // Topic progress
    displayTopics(student.topics);
}

/* ---------------------------------------------
   Safe setter for DOM elements
--------------------------------------------- */
function safeSet(id, value) {
    const node = el(id);
    if (node) node.innerHTML = value;
}

/* ---------------------------------------------
   Badge Display
--------------------------------------------- */
function displayBadges(badges) {
    const area = el("badges");
    if (!area) return;

    if (!badges.length) {
        area.innerHTML = "No badges earned yet ⭐";
        return;
    }

    area.innerHTML = badges
        .map(b => `<span class="badge">🏅 ${b}</span>`)
        .join("");
}

/* ---------------------------------------------
   Topic Progress Display
--------------------------------------------- */
function displayTopics(topics) {
    const area = el("topicProgress");
    if (!area) return;

    const keys = Object.keys(topics);
    if (!keys.length) {
        area.innerHTML = "No practice data yet";
        return;
    }

    area.innerHTML = keys
        .map(topicId => {
            const data = topics[topicId] || {};
            const attempted = data.attempted || 0;
            const correct = data.correct || 0;

            const percent =
                attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            return `
                <div class="topic-card">
                    <h3>${data.name || topicId}</h3>
                    <p>Completed: ${attempted}</p>
                    <p>Accuracy: ${percent}%</p>

                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>
                </div>
            `;
        })
        .join("");
}

/* ---------------------------------------------
   Navigation
--------------------------------------------- */
function goHome() {
    location.replace("index.html");
}

console.log("Improved dashboard.js loaded");
