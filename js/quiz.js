let currentQuestion = 0;
let score = 0;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = quizData[currentQuestion];
  if (!q) {
    alert(`Quiz complete! Score: ${score}/${quizData.length}`);
    Storage.set("completedQuestions", quizData.length);
    window.location.href = "dashboard.html";
    return;
  }

  const choice = prompt(
    `${q.question}\n\n` +
    q.options.map((option, i) => `${i + 1}. ${option}`).join("\n")
  );

  const answer = Number(choice) - 1;
  if (answer === q.answer) score++;

  Storage.set("completedQuestions", currentQuestion + 1);
  currentQuestion++;
  renderQuestion();
}

document.addEventListener("DOMContentLoaded", startQuiz);
