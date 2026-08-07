function generateStudyQuestion() {
  const random = quizData[Math.floor(Math.random() * quizData.length)];
  return random;
}
