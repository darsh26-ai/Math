/*
=================================================
Math Learning Center
app.js (Final Working Version)
=================================================
*/

let selectedGrade = null;
let selectedTopic = "";

/* ---------------------------------------------
   Initialize App
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    loadGrades();
    setupButtons();
    loadTheme();
    updateStatistics();
});

/* ---------------------------------------------
   Setup Buttons
--------------------------------------------- */
function setupButtons() {
    const homeButton = document.getElementById("homeButton");
    if (homeButton) {
        homeButton.onclick = function () {
            showPage("homePage");
        };
    }

    const themeButton = document.getElementById("themeButton");
    if (themeButton) {
        themeButton.onclick = function () {
            document.body.classList.toggle("dark");
            localStorage.setItem("darkMode", document.body.classList.contains("dark"));
        };
    }

    // Back buttons
    document.querySelectorAll(".backButton").forEach(button => {
        button.onclick = function () {
            showPage("homePage");
        };
    });
}

/* ---------------------------------------------
   Load Grades
--------------------------------------------- */
function loadGrades() {
    let container = document.getElementById("gradeGrid");

    if (!container) {
        console.log("gradeGrid not found");
        return;
    }

    container.innerHTML = "";

    Object.keys(mathData).forEach(grade => {
        let data = mathData[grade];

        let card = document.createElement("div");
        card.className = "gradeCard";

        card.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.topics.length} Topics Available</p>
        `;

        card.onclick = function () {
            selectGrade(grade);
        };

        container.appendChild(card);
    });
}

/* ---------------------------------------------
   Select Grade
--------------------------------------------- */
function selectGrade(grade) {
    selectedGrade = grade;

    let data = mathData[grade];

    document.getElementById("gradeTitle").innerHTML = data.name;

    let container = document.getElementById("topicGrid");
    container.innerHTML = "";

    data.topics.forEach(topic => {
        let card = document.createElement("div");
        card.className = "topicCard";

        card.innerHTML = `
            <h3>${topic.name}</h3>
            <p>${topic.description}</p>
        `;

        card.onclick = function () {
            selectedTopic = topic.id;
            showPage("settingsPage");
        };

        container.appendChild(card);
    });

    showPage("topicPage");
}

/* ---------------------------------------------
   Show Page (Navigation System)
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
        const page = document.getElementById(id);
        if (page) {
            if (id === pageId) {
                page.classList.remove("hidden");
            } else {
                page.classList.add("hidden");
            }
        }
    });
}

/* ---------------------------------------------
   Choose Topic (Legacy Support)
--------------------------------------------- */
function chooseTopic(topic) {
    selectedTopic = topic;
}

/* ---------------------------------------------
   Load Theme
--------------------------------------------- */
function loadTheme() {
    let dark = localStorage.getItem("darkMode");

    if (dark === "true") {
        document.body.classList.add("dark");
    }
}
