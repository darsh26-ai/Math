/*
=================================================
Math Learning Center
ui.js (Full Working Version with clockTime Support)
=================================================
*/

/* ---------------------------------------------
   Safe DOM Getter
--------------------------------------------- */
function el(id) {
    return document.getElementById(id);
}

/* ---------------------------------------------
   Global State
--------------------------------------------- */
let selectedTopic = null;
let currentQuestion = null;
let currentMode = null;

/* ---------------------------------------------
   Attach Button Handlers
--------------------------------------------- */
const practiceBtn = el("practiceBtn");
const quizBtn = el("quizBtn");

if (practiceBtn) {
    practiceBtn.onclick = () => startQuiz("practice");
}

if (quizBtn) {
    quizBtn.onclick = () => startQuiz("quiz");
}

/* ---------------------------------------------
   Topic Selection
--------------------------------------------- */
function chooseTopic(topic) {
    selectedTopic = topic;

    const topicButtons = document.querySelectorAll(".topicCard");
    topicButtons.forEach(btn => {
        btn.classList.remove("selectedTopic");
        if (btn.dataset.topic === topic) {
            btn.classList.add("selectedTopic");
        }
    });

    console.log("Selected topic:", selectedTopic);
}

/* ---------------------------------------------
   Start Quiz / Practice Mode
--------------------------------------------- */
function startQuiz(mode) {
    currentMode = mode;

    if (!selectedTopic) {
        alert("Please select a topic first.");
        return;
    }

    console.log("Starting mode:", mode);

    // Generate question
    currentQuestion = generateQuestion(selectedTopic, "Easy", 3);

    // Render question
    renderQuestion(currentQuestion);
}

/* ---------------------------------------------
   Render Question
--------------------------------------------- */
function renderQuestion(question) {
    const questionBox = el("questionBox");
    const optionsBox = el("optionsBox");
    const clockContainer = el("clockContainer");

    if (!questionBox || !optionsBox) {
        console.error("Missing UI elements: questionBox or optionsBox");
        return;
    }

    // Render question text
    questionBox.innerText = question.question;

    // Render clock if needed
    if (question.clockTime) {
        renderClock(question.clockTime);
    } else if (clockContainer) {
        clockContainer.innerHTML = ""; // Clear clock for normal questions
    }

    // Render options safely
    if (!question.options || !Array.isArray(question.options)) {
        console.error("Invalid options:", question);
        return;
    }

    optionsBox.innerHTML = "";

    question.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "optionBtn";
        btn.innerText = opt;

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

    if (selected === currentQuestion.answer) {
        resultBox.innerText = "Correct!";
        resultBox.style.color = "green";
    } else {
        resultBox.innerText = "Try again!";
        resultBox.style.color = "red";
    }

    // Auto-load next question in practice mode
    if (currentMode === "practice") {
        setTimeout(() => {
            currentQuestion = generateQuestion(selectedTopic, "Easy", 3);
            renderQuestion(currentQuestion);
            resultBox.innerText = "";
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
