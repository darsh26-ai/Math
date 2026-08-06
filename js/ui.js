
// Attach button handlers
document.getElementById("practiceBtn").onclick = function () {
    startQuiz("practice");
};

document.getElementById("quizBtn").onclick = function () {
    startQuiz("quiz");
};

function chooseTopic(topic) {
    selectedTopic = topic;
}

