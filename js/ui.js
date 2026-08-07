/*
=================================================
Math Learning Center
ui.js (Improved Production Version)
=================================================
*/

/* ---------------------------------------------
   Safe DOM Getter
--------------------------------------------- */
function el(id) {
    return document.getElementById(id);
}

/* ---------------------------------------------
   Global UI State
--------------------------------------------- */
let selectedTopic = null;

/* ---------------------------------------------
   Attach Button Handlers
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const practiceBtn = el("practiceBtn");
    const quizBtn = el("quizBtn");

    if (practiceBtn) practiceBtn.onclick = () => startQuiz("practice");
    if (quizBtn) quizBtn.onclick = () => startQuiz("quiz");
});

/* ---------------------------------------------
   Topic Selection
--------------------------------------------- */
function chooseTopic(topicId) {
    selectedTopic = topicId;

    document.querySelectorAll(".topicCard").forEach(card => {
        card.classList.toggle("selectedTopic", card.dataset.topic === topicId);
    });

    console.log("Selected topic:", selectedTopic);
}

/* ---------------------------------------------
   Start Quiz / Practice Mode
--------------------------------------------- */
function startQuiz(mode) {
    if (!selectedTopic) {
        alert("Please select a topic first.");
        return;
    }

    console.log("Starting mode:", mode);

    // Use your improved quiz engine
    currentMode = mode;
    currentQuestion = generateQuestion(selectedTopic, "Easy", Number(window.selectedGrade || 1));

    renderQuestion(currentQuestion);
    showPage("quizPage");
}

/* ---------------------------------------------
   Render Question
--------------------------------------------- */
function renderQuestion(question) {
    const questionBox = el("questionBox");
    const optionsBox = el("optionsBox");
    const clockContainer = el("clockContainer");
    const resultBox = el("resultBox");

    if (!questionBox || !optionsBox) {
        console.error("Missing UI elements");
        return;
    }

    // Render question text
    questionBox.textContent = question.question;

    // Render clock if needed
    if (question.clockTime) {
        renderClock(question.clockTime);
    } else if (clockContainer) {
        clockContainer.innerHTML = "";
    }

    // Render options
    optionsBox.innerHTML = "";
    resultBox.innerHTML = "";

    if (!Array.isArray(question.options)) {
        console.error("Invalid options:", question);
        return;
    }

    question.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "optionBtn";
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(opt);
        optionsBox.appendChild(btn);
    });
}

/* ---------------------------------------------
   Handle Answer Click
--------------------------------------------- */
function handleAnswer(selected) {
    const resultBox = el("resultBox");
    if (!resultBox) return;

    const correct = normalizeAnswer(currentQuestion.answer);
    const chosen = normalizeAnswer(selected);

    if (chosen === correct) {
        resultBox.textContent = "Correct!";
        resultBox.style.color = "green";
    } else {
        resultBox.textContent = "Try again!";
        resultBox.style.color = "red";
    }

    // Practice mode auto-next
    if (currentMode === "practice") {
        setTimeout(() => {
            currentQuestion = generateQuestion(selectedTopic, "Easy", Number(window.selectedGrade || 1));
            renderQuestion(currentQuestion);
            resultBox.textContent = "";
        }, 800);
    }
}

/* ---------------------------------------------
   Render Clock (SVG)
--------------------------------------------- */
function renderClock(time) {
    const clockContainer = el("clockContainer");
    if (!clockContainer) return;

    const [hour, minute] = time.split(":").map(Number);

    const hourAngle = (hour % 12) * 30 + (minute / 2);
    const minuteAngle = minute * 6;

    clockContainer.innerHTML = `
        <svg width="150" height="150" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="black" stroke-width="3" fill="white" />
            <line x1="50" y1="50"
                  x2="${50 + 25 * Math.sin(hourAngle * Math.PI/180)}"
                  y2="${50 - 25 * Math.cos(hourAngle * Math.PI/180)}"
                  stroke="black" stroke-width="3" />
            <line x1="50" y1="50"
                  x2="${50 + 35 * Math.sin(minuteAngle * Math.PI/180)}"
                  y2="${50 - 35 * Math.cos(minuteAngle * Math.PI/180)}"
                  stroke="red" stroke-width="2" />
        </svg>
    `;
}

console.log("Improved ui.js loaded");
