/*
=================================================
Math Learning Center
quiz.js (Improved Version)
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

    const count = Number(document.getElementById("questionCount")?.value || 10);
    currentQuiz.totalQuestions = count;

    const topic = selectedTopic || "addition";
    const difficulty = document.getElementById("difficulty")?.value || "Easy";
    const selectedGrade = Number(document.getElementById("gradeSelect")?.value || 1);

    currentQuiz.selectedTopic = topic;
    currentQuiz.difficulty = difficulty;
    currentQuiz.selectedGrade = selectedGrade;

    for (let i = 0; i < count; i++) {
        let question;

        if (topic === "wordProblems") {
            question = generateWordProblem(selectedGrade);
        } else {
            question = generateQuestion(topic, difficulty, selectedGrade);
        }

        // Ensure word problems have options
        if (!question.options || question.options.length === 0) {
            question.options = generateOptions(question.answer);
        }

        currentQuiz.questions.push(question);
    }

    showPage("quizPage");
    loadQuestion();
}

/* ---------------------------------------------
   Load Question
--------------------------------------------- */
function loadQuestion() {
    const index = currentQuiz.currentIndex;
    const question = currentQuiz.questions[index];

    const progressText = document.getElementById("progressText");
    const questionContainer = document.getElementById("questionContainer");
    const answerBox = document.getElementById("answerContainer");
    const nextButton = document.getElementById("nextButton");

    if (!progressText || !questionContainer || !answerBox || !nextButton) {
        console.error("Quiz DOM elements missing");
        return;
    }

    progressText.innerHTML = `Question ${index + 1} of ${currentQuiz.totalQuestions}`;
    questionContainer.innerHTML = question.question;

    answerBox.innerHTML = "";

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.className = "answerButton";
        button.innerHTML = option;

        button.onclick = () => checkAnswer(option, button);

        answerBox.appendChild(button);
    });

    nextButton.style.display = "none";
}

/* ---------------------------------------------
   Check Answer
--------------------------------------------- */
function checkAnswer(selected, button) {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const buttons = document.querySelectorAll(".answerButton");

    buttons.forEach(btn => (btn.disabled = true));

    const isCorrect = String(selected) === String(question.answer);

    if (isCorrect) {
        button.classList.add("correct");
        currentQuiz.score++;
    } else {
        button.classList.add("wrong");

        buttons.forEach(btn => {
            if (String(btn.innerHTML) === String(question.answer)) {
                btn.classList.add("correct");
            }
        });
    }

    // Save student progress
    recordAnswer(currentQuiz.selectedTopic, isCorrect);

    const nextButton = document.getElementById("nextButton");
    nextButton.style.display = "block";
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

    const scoreBox = document.getElementById("scoreBox");

    scoreBox.innerHTML = `
        <h3>Score</h3>
        <h1>${currentQuiz.score} / ${currentQuiz.totalQuestions}</h1>
        <p>Accuracy: ${percentage}%</p>
        <p>${getRating(percentage)}</p>
    `;

    // Save quiz history
    saveQuizHistory(
        currentQuiz.selectedTopic,
        currentQuiz.score,
        currentQuiz.totalQuestions
    );

    // Save global progress
    saveQuizResult(currentQuiz.score, currentQuiz.totalQuestions);
}

/* ---------------------------------------------
   Save Quiz History (localStorage)
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
   Performance Rating
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
