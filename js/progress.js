/*
=================================================

Math Learning Center

progress.js

Handles:
- Statistics
- Quiz history
- Accuracy
- Dashboard

=================================================
*/



/*
=====================================
Save Quiz Result
=====================================
*/


function saveQuizResult(
score,
total
){


let progress =
loadProgress();



let wrong =
total-score;



progress.totalQuestions += total;


progress.correctAnswers += score;


progress.wrongAnswers += wrong;


progress.quizzesCompleted++;





let accuracy =

Math.round(

(progress.correctAnswers /
progress.totalQuestions)

*

100

);





progress.history.push({

date:new Date()
.toLocaleDateString(),

score:score,

total:total,

accuracy:accuracy

});




saveProgress(
progress
);



updateStatistics();


}








/*
=====================================
Calculate Accuracy
=====================================
*/


function getAccuracy(){


let progress =
loadProgress();



if(
progress.totalQuestions===0
){

return 0;

}



return Math.round(

(
progress.correctAnswers /
progress.totalQuestions
)

*

100

);


}








/*
=====================================
Update Dashboard
=====================================
*/


function updateStatistics(){


let container =

document.getElementById(
"statsContainer"
);



if(!container){

return;

}



let progress =
loadProgress();



let accuracy =
getAccuracy();




container.innerHTML=

`

<div class="statCard">


<div class="statTitle">
Questions Completed
</div>


<h2>
${progress.totalQuestions}
</h2>


</div>




<div class="statCard">


<div class="statTitle">
Correct Answers
</div>


<h2>
${progress.correctAnswers}
</h2>


</div>





<div class="statCard">


<div class="statTitle">
Accuracy
</div>


<h2>
${accuracy}%
</h2>



<div class="progress">

<div 
class="progressFill"
style="width:${accuracy}%">

</div>

</div>


</div>





<div class="statCard">


<div class="statTitle">
Quizzes Completed
</div>


<h2>
${progress.quizzesCompleted}
</h2>


</div>

`;



}








/*
=====================================
Load Statistics on Start
=====================================
*/


document.addEventListener(

"DOMContentLoaded",

function(){

updateStatistics();

}

);



console.log(
"progress.js loaded"
);
