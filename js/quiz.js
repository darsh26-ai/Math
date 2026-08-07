/*
=================================================
Math Learning Center
quiz.js (Final Working Version)
=================================================
*/

let currentQuiz = {
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedTopic: "",
    difficulty: "Easy",
    totalQuestions: 10,
    selectedGrade: 1,
    mode: "quiz"
};

/* ---------------------------------------------
   Start Quiz
--------------------------------------------- */
function startQuiz(mode) {
    currentQuiz.mode = mode;
    currentQuiz.questions = [];
    currentQuiz.currentIndex = 0;
    currentQuiz.score = 0;

    const count = Number(el("questionCount")?.value || 10);
    currentQuiz.totalQuestions = count;

    const topic = selectedTopic || "addition";
    const difficulty = el("difficulty")?.value || "Easy";

    // ⭐ Use grade selected from gradeGrid (app.js)
    const selectedGrade = Number(window.selectedGrade || 1);

    currentQuiz.selectedTopic = topic;
    currentQuiz.difficulty = difficulty;
    currentQuiz.selectedGrade = selectedGrade;

    // Generate questions
    for (let i = 0; i < count; i++) {
        let question;

        if (topic === "wordProblems") {
            question = generateWordProblem(selectedGrade);
        } else {
            question = generateQuestion(topic, difficulty, selectedGrade);
        }

        if (!question.options || question.options.length === 0) {
            question.options = generateOptions(question.answer);
        }

        currentQuiz.questions.push(question);
    }

    // Show quiz page
    showPage("quizPage");

    // Load first question
    loadQuestion();
}

/* ---------------------------------------------
   Load Question
--------------------------------------------- */
function loadQuestion() {
    const index = currentQuiz.currentIndex;
    const question = currentQuiz.questions[index];

    const progressText = el("progressText");
    const questionBox = el("questionBox");
    const clockContainer = el("clockContainer");
    const optionsBox = el("optionsBox");
    const resultBox = el("resultBox");
    const nextButton = el("nextButton");

    if (!progressText || !questionBox || !optionsBox || !nextButton) {
        console.error("Quiz DOM elements missing");
        return;
    }

    progressText.innerHTML = `Question ${index + 1} of ${currentQuiz.totalQuestions}`;

    // Render question text
    questionBox.innerHTML = question.question;

    // Render clock if needed
    if (question.clockTime) {
        renderClock(question.clockTime);
    } else {
        clockContainer.innerHTML = "";
    }

    // Render options
    optionsBox.innerHTML = "";
    resultBox.innerHTML = "";

    question.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "answerButton";
        btn.innerHTML = option;

        btn.onclick = () => checkAnswer(option, btn);

        optionsBox.appendChild(btn);
    });

    nextButton.style.display = "none";
}

/* ---------------------------------------------
   Check Answer
--------------------------------------------- */
function checkAnswer(selected, button) {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const buttons = document.querySelectorAll(".answerButton");
    const resultBox = el("resultBox");

    buttons.forEach(btn => (btn.disabled = true));

    const isCorrect = String(selected) === String(question.answer);

    if (isCorrect) {
        button.classList.add("correct");
        currentQuiz.score++;
        resultBox.innerHTML = "Correct!";
        resultBox.style.color = "green";
    } else {
        button.classList.add("wrong");
        resultBox.innerHTML = "Try again!";
        resultBox.style.color = "red";

        buttons.forEach(btn => {
            if (String(btn.innerHTML) === String(question.answer)) {
                btn.classList.add("correct");
            }
        });
    }

    recordAnswer(currentQuiz.selectedTopic, isCorrect);

    el("nextButton").style.display = "block";
}

/* ---------------------------------------------
   Next Question
--------------------------------------------- */
function nextQuestion() {
    currentQuiz.currentIndex++;

    if (currentQuiz.currentIndex >= currentQuiz.totalQuestions) {
        finishQuiz();
    } else {
        loadQuestion();
    }
}

/* ---------------------------------------------
   Finish Quiz
--------------------------------------------- */
function finishQuiz() {
    const percentage = Math.round(
        (currentQuiz.score / currentQuiz.totalQuestions) * 100
    );

    showPage("resultsPage");

    const scoreBox = el("scoreBox");

    scoreBox.innerHTML = `
        <h3>Score</h3>
        <h1>${currentQuiz.score} / ${currentQuiz.totalQuestions}</h1>
        <p>Accuracy: ${percentage}%</p>
        <p>${getRating(percentage)}</p>
    `;

    saveQuizHistory(
        currentQuiz.selectedTopic,
        currentQuiz.score,
        currentQuiz.totalQuestions
    );

    saveQuizResult(currentQuiz.score, currentQuiz.totalQuestions);
}

/* ---------------------------------------------
   Save Quiz History
--------------------------------------------- */
function saveQuizHistory(topic, score, total) {
    const result = {
        topic,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString()
    };

    const history =
        JSON.parse(localStorage.getItem("quizHistory")) || [];

    history.push(result);

    localStorage.setItem("quizHistory", JSON.stringify(history));
}

/* ---------------------------------------------
   Rating
--------------------------------------------- */
function getRating(percent) {
    if (percent === 100) return "🏆 Perfect Score!";
    if (percent >= 90) return "⭐⭐⭐⭐ Excellent";
    if (percent >= 70) return "⭐⭐⭐ Good Job";
    if (percent >= 50) return "⭐⭐ Keep Practicing";
    return "⭐ Try Again";
}

/* ---------------------------------------------
   Restart Quiz
--------------------------------------------- */
function restartQuiz() {
    startQuiz(currentQuiz.mode);
}

console.log("quiz.js loaded");
