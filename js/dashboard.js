document.addEventListener(
"DOMContentLoaded",
()=>{


loadDashboard();


});



function loadDashboard(){


let student = getStudent();



if(!student){

document.getElementById(
"studentName"
).innerHTML =
"Guest Student";


return;

}



document.getElementById(
"studentName"
).innerHTML =
"👋 " + student.name;



document.getElementById(
"studentGrade"
).innerHTML =
student.grade;



document.getElementById(
"questionsCompleted"
).innerHTML =
student.stats?.attempted || 0;



document.getElementById(
"accuracy"
).innerHTML =
(student.stats?.accuracy || 0)
+
"%";



document.getElementById(
"streak"
).innerHTML =
(student.streak?.current || 0)
+
" Days";



let badges =
student.achievements || [];



document.getElementById(
"badgeCount"
).innerHTML =
badges.length;



displayBadges(badges);


displayTopics(
student.topics
);


}



function displayBadges(badges){


let area =
document.getElementById(
"badges"
);



if(badges.length===0){

area.innerHTML =
"No badges earned yet ⭐";

return;

}



area.innerHTML =
badges
.map(
badge =>
`
<span class="badge">
🏆 ${badge}
</span>
`
)
.join("");

}




function displayTopics(topics){


let area =
document.getElementById(
"topicProgress"
);



if(!topics){

area.innerHTML =
"No practice data yet";

return;

}



area.innerHTML =
Object.keys(topics)
.map(
topic=>{


let data =
topics[topic];


return `

<div class="topic-card">

<h3>${topic}</h3>

<p>
Completed:
${data.attempted}
</p>

<p>
Accuracy:
${Math.round(
data.correct /
data.attempted * 100
) || 0}%

</p>

</div>

`;

}
)
.join("");

}




function goHome(){

window.location.href =
"index.html";

}
