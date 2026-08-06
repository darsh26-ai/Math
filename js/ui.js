/*
=================================================
Math Learning Center
ui.js (Improved Version)
=================================================
*/

/* ---------------------------------------------
   Safe DOM Getter
--------------------------------------------- */
function el(id) {
    return document.getElementById(id);
}

/* ---------------------------------------------
   Attach Button Handlers (Safe)
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

    // Optional: highlight selected topic in UI
    const topicButtons = document.querySelectorAll(".topicCard");
    topicButtons.forEach(btn => {
        btn.classList.remove("selectedTopic");
        if (btn.dataset.topic === topic) {
            btn.classList.add("selectedTopic");
        }
    });

    console.log("Selected topic:", selectedTopic);
}
