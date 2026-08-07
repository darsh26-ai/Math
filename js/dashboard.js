document.addEventListener("DOMContentLoaded", () => {
  const completed = Storage.get("completedQuestions", 0);
  const total = quizData.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  document.getElementById("questionCount").textContent = total;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("progressPercent").textContent = percent + "%";

  document.getElementById("startQuiz").addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
});
