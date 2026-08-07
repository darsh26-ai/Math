/*
=================================================
Math Learning Center
quiz.js (Improved Production Version)
=================================================
*/

let currentQuiz = null;

/* ---------------------------------------------
   Create Fresh Quiz State
--------------------------------------------- */
function createQuizState(mode, topic, difficulty, grade, totalQuestions) {
    return {
        mode,
        selectedTopic: topic,
        difficulty,
        selectedGrade: grade,
        totalQuestions,
        currentIndex: 0,
        score: 0,
        questions: []
    };
}

/* ---------------------------------------------
   Start Quiz
--------------------------------------------- */
function startQuiz(mode) {
    const topic = selectedTopic;
    const difficulty = el("difficulty")?.value || "Easy";
    const totalQuestions = Number(el("questionCount")?.value || 10);
    const grade = Number(window.selectedGrade || 1);

    if (!topic) {
        alert("Please select a topic first.");
        return;
    }

    currentQuiz = createQuizState(mode, topic, difficulty, grade, totalQuestions);

    for (let i = 0; i < totalQuestions; i++) {
        let q = (topic === "wordProblems")
            ? generateWordProblem(grade)
            : generateQuestion(topic, difficulty, grade);

        if (!q.options || q.options.length === 0) {
            q.options = generateOptions(q.answer);
        }

        q.options = shuffle(q.options);
        currentQuiz.questions.push(q);
    }

    showPage("quizPage");
    loadQuestion();
}

/* ---------------------------------------------
   Load Question
--------------------------------------------- */
function loadQuestion() {
    const q = currentQuiz.questions[currentQuiz.currentIndex];

    el("progressText").textContent =
        `Question ${currentQuiz.currentIndex + 1} of ${currentQuiz.totalQuestions}`;

    el("questionBox").textContent = q.question;

    if (q.clockTime) {
        renderClock(q.clockTime);
    } else {
        el("clockContainer").innerHTML = "";
    }

    el("optionsBox").innerHTML = "";
    el("resultBox").innerHTML = "";
    el("nextButton").style.display = "none";

    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "answerButton";
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        el("optionsBox").appendChild(btn);
    });
}

/* ---------------------------------------------
   Normalize Answer (Topic-Aware)
--------------------------------------------- */
function normalizeAnswer(value) {
    if (typeof value === "number") return Number(value);

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (/^\d+:\d+$/.test(trimmed)) {
            const [h, m] = trimmed.split(":").map(Number);
            return h * 60 + m;
        }

        if (/^\d+\/\d+$/.test(trimmed)) {
            const [n, d] = trimmed.split("/").map(Number);
            return n / d;
        }

        if (!isNaN(Number(trimmed))) {
            return Number(trimmed);
        }

        return trimmed.toLowerCase();
    }

    return value;
}

/* ---------------------------------------------
   Check Answer
--------------------------------------------- */
function checkAnswer(selected, button) {
    const q = currentQuiz.questions[currentQuiz.currentIndex];
    const correct = normalizeAnswer(q.answer);
    const chosen = normalizeAnswer(selected);

    const isCorrect = chosen === correct;

    document.querySelectorAll(".answerButton").forEach(btn => btn.disabled = true);

    if (isCorrect) {
        button.classList.add("correct");
        currentQuiz.score++;
        el("resultBox").textContent = "Correct!";
        el("resultBox").style.color = "green";
    } else {
        button.classList.add("wrong");
        el("resultBox").textContent = "Try again!";
        el("resultBox").style.color = "red";

        document.querySelectorAll(".answerButton").forEach(btn => {
            if (normalizeAnswer(btn.textContent) === correct) {
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
    const percent = Math.round(
        (currentQuiz.score / currentQuiz.totalQuestions) * 100
    );

    showPage("resultsPage");

    el("scoreBox").innerHTML = `
        <h3>Score</h3>
        <h1>${currentQuiz.score} / ${currentQuiz.totalQuestions}</h1>
        <p>Accuracy: ${percent}%</p>
        <p>${getRating(percent)}</p>
    `;

    saveQuizHistory(currentQuiz.selectedTopic, currentQuiz.score, currentQuiz.totalQuestions);
    saveQuizResult(currentQuiz.score, currentQuiz.totalQuestions);
}

/* ---------------------------------------------
   Save Quiz History (with cleanup)
--------------------------------------------- */
function saveQuizHistory(topic, score, total) {
    const entry = {
        topic,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString()
    };

    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    history.push(entry);

    if (history.length > 200) history.shift();

    localStorage.setItem("quizHistory", JSON.stringify(history));
}

/* ---------------------------------------------
   Rating
--------------------------------------------- */
function getRating(p) {
    if (p === 100) return "🏆 Perfect Score!";
    if (p >= 90) return "⭐⭐⭐⭐ Excellent";
    if (p >= 70) return "⭐⭐⭐ Good Job";
    if (p >= 50) return "⭐⭐ Keep Practicing";
    return "⭐ Try Again";
}

/* ---------------------------------------------
   Restart Quiz
--------------------------------------------- */
function restartQuiz() {
    startQuiz(currentQuiz.mode);
}

console.log("Improved quiz.js loaded");
