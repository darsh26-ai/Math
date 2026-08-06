document.addEventListener("DOMContentLoaded", () => {
    try {
        loadDashboard();
    } catch (err) {
        console.error("Dashboard failed to load:", err);
    }
});

/* ------------------------------
   Utility: Safe DOM getter
------------------------------ */
function el(id) {
    return document.getElementById(id);
}

/* ------------------------------
   Main Dashboard Loader
------------------------------ */
function loadDashboard() {
    const student = getStudent();

    // Fallback for missing student
    if (!student) {
        safeSet("studentName", "Guest Student");
        safeSet("studentGrade", "—");
        safeSet("questionsCompleted", 0);
        safeSet("accuracy", "0%");
        safeSet("streak", "0 Days");
        safeSet("badgeCount", 0);
        safeSet("topicProgress", "No practice data yet");
        safeSet("badges", "No badges earned yet ⭐");
        return;
    }

    // Basic fields
    safeSet("studentName", "👋 " + (student.name || "Student"));
    safeSet("studentGrade", student.grade || "—");

    // Stats
    const attempted = student.stats?.attempted || 0;
    const accuracy = student.stats?.accuracy || 0;
    safeSet("questionsCompleted", attempted);
    safeSet("accuracy", accuracy + "%");

    // Streak
    const streak = student.streak?.current || 0;
    safeSet("streak", streak + " Days");

    // Badges
    const badges = Array.isArray(student.achievements) ? student.achievements : [];
    safeSet("badgeCount", badges.length);
    displayBadges(badges);

    // Topic progress
    displayTopics(student.topics || {});
}

/* ------------------------------
   Safe setter for DOM elements
------------------------------ */
function safeSet(id, value) {
    const node = el(id);
    if (node) node.innerHTML = value;
}

/* ------------------------------
   Badge Display
------------------------------ */
function displayBadges(badges) {
    const area = el("badges");
    if (!area) return;

    if (!badges.length) {
        area.innerHTML = "No badges earned yet ⭐";
        return;
    }

    area.innerHTML = badges
        .map(badge => `<span class="badge">🏆 ${badge}</span>`)
        .join("");
}

/* ------------------------------
   Topic Progress Display
------------------------------ */
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

            const accuracy =
                attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            return `
                <div class="topic-card">
                    <h3>${data.name || topicId}</h3>
                    <p>Completed: ${attempted}</p>
                    <p>Accuracy: ${accuracy}%</p>
                </div>
            `;
        })
        .join("");
}

/* ------------------------------
   Navigation
------------------------------ */
function goHome() {
    window.location.href = "index.html";
}
