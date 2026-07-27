/*
=================================================
Math Learning Center

quiz.js

Controls:
- Quiz flow
- Practice mode
- Answer checking
- Score tracking
- Results

=================================================
*/


let currentQuiz = {

    questions: [],

    currentIndex: 0,

    score: 0,

    selectedTopic: "",

    difficulty: "Easy",

    totalQuestions: 10,

    mode: "quiz"

};




/*
=====================================
Start Quiz
=====================================
*/


function startQuiz(mode){


currentQuiz.mode = mode;


currentQuiz.questions=[];

currentQuiz.currentIndex=0;

currentQuiz.score=0;



let count =
Number(
document.getElementById(
"questionCount"
).value
);



currentQuiz.totalQuestions=count;



let topic =
selectedTopic;



let difficulty =
document.getElementById(
"difficulty"
).value;



currentQuiz.selectedTopic=topic;

currentQuiz.difficulty=difficulty;




for(
let i=0;
i<count;
i++
){


let question =
generateQuestion(
topic,
difficulty
);


currentQuiz.questions.push(
question
);

console.log(
currentQuiz.questions
);

}



showPage(
"quizPage"
);



loadQuestion();


}







/*
=====================================
Load Question
=====================================
*/


function loadQuestion(){


let index =
currentQuiz.currentIndex;



let question =
currentQuiz.questions[index];



document.getElementById(
"progressText"
)
.innerHTML =

`Question ${index+1}
of
${currentQuiz.totalQuestions}`;



document.getElementById(
"questionContainer"
)
.innerHTML =

question.question;



let answerBox =
document.getElementById(
"answerContainer"
);



answerBox.innerHTML="";




question.options.forEach(
option=>{


let button =
document.createElement(
"button"
);



button.className=
"answerButton";



button.innerHTML=
option;



button.onclick=function(){


checkAnswer(
option,
button
);


};



answerBox.appendChild(
button
);


}

);



document.getElementById(
"nextButton"
)
.style.display="none";


}








/*
=====================================
Check Answer
=====================================
*/


/*
=====================================
Check Answer
=====================================
*/


function checkAnswer(
selected,
button
){


let question =
currentQuiz.questions[
currentQuiz.currentIndex
];



let buttons =
document.querySelectorAll(
".answerButton"
);



buttons.forEach(
btn=>{

btn.disabled=true;

}

);



let isCorrect = false;



if(
String(selected)
===
String(question.answer)
){


button.classList.add(
"correct"
);


currentQuiz.score++;


isCorrect = true;


}

else{


button.classList.add(
"wrong"
);



buttons.forEach(
btn=>{


if(
String(btn.innerHTML)
===
String(question.answer)
){

btn.classList.add(
"correct"
);

}


}

);


}




// ===============================
// SAVE PROGRESS
// ===============================

recordAnswer(

currentQuiz.selectedTopic,

isCorrect

);




// show next button

document.getElementById(
"nextButton"
)
.style.display="block";


}

/*
=====================================
Next Question
=====================================
*/

function nextQuestion(){


console.log(
"Next clicked"
);


console.log(
"Current Index:",
currentQuiz.currentIndex
);


console.log(
"Total Questions:",
currentQuiz.totalQuestions
);



currentQuiz.currentIndex++;



if(
currentQuiz.currentIndex >= currentQuiz.totalQuestions
){


console.log(
"Quiz Finished"
);


finishQuiz();


}

else{


console.log(
"Loading Question:",
currentQuiz.currentIndex + 1
);


loadQuestion();


}


}


/*
=====================================
Finish Quiz
=====================================
*/


function finishQuiz(){


let percentage =

Math.round(

(
currentQuiz.score /
currentQuiz.totalQuestions
)
*
100

);



showPage(
"resultsPage"
);



document.getElementById(
"scoreBox"
)
.innerHTML =

`

<h3>
Score
</h3>

<h1>
${currentQuiz.score}
/
${currentQuiz.totalQuestions}
</h1>


<p>
Accuracy:
${percentage}%
</p>


<p>

${getRating(percentage)}

</p>

`;



saveQuizResult(

currentQuiz.selectedTopic,

currentQuiz.score,

currentQuiz.totalQuestions

);


}

function saveQuizResult(
topic,
score,
total
){


let result = {


topic:topic,

score:score,

total:total,

percentage:
Math.round(
(score/total)*100
),

date:
new Date().toISOString()


};



let history =
JSON.parse(
localStorage.getItem(
"quizHistory"
)
)
||
[];



history.push(result);



localStorage.setItem(
"quizHistory",
JSON.stringify(history)
);


}






/*
=====================================
Performance Rating
=====================================
*/


function getRating(percent){


if(percent===100){

return "🏆 Perfect Score!";

}


if(percent>=90){

return "⭐⭐⭐⭐ Excellent";

}


if(percent>=70){

return "⭐⭐⭐ Good Job";

}


if(percent>=50){

return "⭐⭐ Keep Practicing";

}


return "⭐ Try Again";

}








/*
=====================================
Restart
=====================================
*/


function restartQuiz(){


startQuiz(
currentQuiz.mode
);


}
