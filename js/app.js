/*
=================================================
Math Learning Center
app.js (Improved Production Version)
=================================================
*/

/* ---------------------------------------------
   Global State
--------------------------------------------- */
let selectedGrade = null;
let selectedTopic = null;

/* ---------------------------------------------
   Initialize App
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Math Learning Center: app.js loaded");

    if (typeof mathData === "undefined") {
        console.error("ERROR: mathData is not defined. Load data.js before app.js.");
        return;
    }

    loadGrades();
    setupButtons();
    loadTheme();

    if (typeof updateStatistics === "function") {
        updateStatistics();
    }

    showPage("homePage");
});

/* ---------------------------------------------
   Setup Buttons
--------------------------------------------- */
function setupButtons() {
    const homeButton = el("homeButton");
    if (homeButton) homeButton.onclick = () => showPage("homePage");

    const themeButton = el("themeButton");
    if (themeButton) {
        themeButton.onclick = () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("darkMode", document.body.classList.contains("dark"));
        };
    }

    document.querySelectorAll(".backButton").forEach(btn => {
        btn.onclick = () => showPage("homePage");
    });

    const practiceBtn = el("practiceBtn");
    if (practiceBtn) practiceBtn.onclick = () => startSelectedMode("practice");

    const quizBtn = el("quizBtn");
    if (quizBtn) quizBtn.onclick = () => startSelectedMode("quiz");

    const nextBtn = el("nextButton");
    if (nextBtn) nextBtn.onclick = () => {
        if (typeof nextQuestion === "function") nextQuestion();
    };

    const restartBtn = el("restartButton");
    if (restartBtn) restartBtn.onclick = () => {
        if (typeof restartQuiz === "function") restartQuiz();
        else showPage("settingsPage");
    };
}

/* ---------------------------------------------
   Load Grades
--------------------------------------------- */
function loadGrades() {
    const container = el("gradeGrid");
    if (!container) return;

    container.innerHTML = "";

    const grades = Object.keys(mathData);
    if (!grades.length) {
        container.innerHTML = `<div class="errorMessage">No grades available.</div>`;
        return;
    }

    grades.forEach(grade => {
        const data = mathData[grade];
        if (!data) return;

        const card = document.createElement("div");
        card.className = "gradeCard";

        const topicCount = Array.isArray(data.topics) ? data.topics.length : 0;

        card.innerHTML = `
            <h3>${data.name || "Grade " + grade}</h3>
            <p>${topicCount} ${topicCount === 1 ? "Topic" : "Topics"} Available</p>
        `;

        card.onclick = () => selectGrade(grade);
        card.tabIndex = 0;
        card.onkeydown = e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectGrade(grade);
            }
        };

        container.appendChild(card);
    });
}

/* ---------------------------------------------
   Select Grade
--------------------------------------------- */
function selectGrade(grade) {
    selectedGrade = String(grade);

    const data = mathData[grade];
    if (!data) return;

    const gradeTitle = el("gradeTitle");
    if (gradeTitle) gradeTitle.textContent = data.name;

    const gradeSelect = el("gradeSelect");
    if (gradeSelect) gradeSelect.value = selectedGrade;

    const container = el("topicGrid");
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data.topics) || !data.topics.length) {
        container.innerHTML = `<div class="errorMessage">No topics available.</div>`;
        showPage("topicPage");
        return;
    }

    data.topics.forEach(topic => {
        const card = document.createElement("div");
        card.className = "topicCard";

        card.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description || "Practice this topic."}</p>
        `;

        card.onclick = () => {
            selectedTopic = topic.id;
            showPage("settingsPage");
        };

        card.tabIndex = 0;
        card.onkeydown = e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectedTopic = topic.id;
                showPage("settingsPage");
            }
        };

        container.appendChild(card);
    });

    showPage("topicPage");
}

/* ---------------------------------------------
   Show Page
--------------------------------------------- */
function showPage(pageId) {
    const pages = [
        "homePage",
        "topicPage",
        "settingsPage",
        "quizPage",
        "resultsPage",
        "statsPage"
    ];

    pages.forEach(id => {
        const page = el(id);
        if (!page) return;
        page.classList.toggle("hidden", id !== pageId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------------------------------------
   Start Selected Mode
--------------------------------------------- */
function startSelectedMode(mode) {
    if (!selectedGrade) {
        const gradeSelect = el("gradeSelect");
        if (gradeSelect) selectedGrade = gradeSelect.value;
    }

    if (!selectedTopic) {
        alert("Please select a topic first.");
        return;
    }

    const difficulty = el("difficulty")?.value || "Easy";
    const questionCount = Number(el("questionCount")?.value || 10);
    const timer = Number(el("timer")?.value || 0);

    const settings = {
        grade: selectedGrade,
        topic: selectedTopic,
        difficulty,
        questionCount,
        timer,
        mode
    };

    window.currentQuizSettings = settings;

    if (typeof startQuiz === "function") {
        startQuiz(settings);
    } else {
        alert("Quiz engine is not loaded.");
    }
}

/* ---------------------------------------------
   Legacy Support
--------------------------------------------- */
function chooseTopic(topic) {
    selectedTopic = topic;
}

/* ---------------------------------------------
   Load Theme
--------------------------------------------- */
function loadTheme() {
    const dark = localStorage.getItem("darkMode");
    document.body.classList.toggle("dark", dark === "true");
}

/* ---------------------------------------------
   Refresh Statistics
--------------------------------------------- */
function refreshStatistics() {
    if (typeof updateStatistics === "function") updateStatistics();
}

