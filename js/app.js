/*
=================================================
Math Learning Center
data.js

Contains:
- Grades
- Topics
- Difficulty settings
- Learning categories

=================================================
*/


const mathData = {


/* ============================
   GRADE 1
============================ */

1: {

name:"Grade 1",

topics:[

{
id:"addition",
name:"➕ Addition",
description:"Add numbers up to 100"
},

{
id:"subtraction",
name:"➖ Subtraction",
description:"Subtract numbers up to 100"
},

{
id:"comparison",
name:"⚖️ Greater / Less Than",
description:"Compare numbers"
},

{
id:"counting",
name:"🔢 Counting",
description:"Counting numbers and patterns"
},

{
id:"shapes",
name:"🔺 Shapes",
description:"Basic geometry shapes"
},

{
id:"time",
name:"🕒 Time",
description:"Learn clocks and hours"
},

{
id:"money",
name:"💵 Money",
description:"Learn coins and values"
},

{
id:"wordProblems",
name:"📖 Word Problems",
description:"Simple math stories"
}

]

},



/* ============================
   GRADE 2
============================ */

2: {

name:"Grade 2",

topics:[

{
id:"addition",
name:"➕ Addition",
description:"3 digit addition"
},

{
id:"subtraction",
name:"➖ Subtraction",
description:"Borrowing subtraction"
},

{
id:"multiplication",
name:"✖️ Multiplication",
description:"Learn multiplication tables"
},

{
id:"division",
name:"➗ Division",
description:"Basic division"
},

{
id:"fractions",
name:"🍕 Fractions",
description:"Halves, thirds and quarters"
},

{
id:"money",
name:"💵 Money",
description:"Adding money amounts"
},

{
id:"measurement",
name:"📏 Measurement",
description:"Length and weight"
},

{
id:"wordProblems",
name:"📖 Word Problems",
description:"Math story problems"
}

]

},



/* ============================
   GRADE 3
============================ */

3: {

name:"Grade 3",

topics:[

{
id:"addition",
name:"➕ Addition",
description:"Large number addition"
},

{
id:"subtraction",
name:"➖ Subtraction",
description:"Large number subtraction"
},

{
id:"multiplication",
name:"✖️ Multiplication",
description:"Multiply numbers"
},

{
id:"division",
name:"➗ Division",
description:"Division practice"
},

{
id:"fractions",
name:"🍕 Fractions",
description:"Equivalent fractions"
},

{
id:"area",
name:"📐 Area & Perimeter",
description:"Calculate shapes"
},

{
id:"graphs",
name:"📊 Graphs",
description:"Read charts"
},

{
id:"wordProblems",
name:"📖 Word Problems",
description:"Multi-step problems"
}

]

},



/* ============================
   GRADE 4
============================ */

4: {

name:"Grade 4",

topics:[

{
id:"multiplication",
name:"✖️ Multiplication",
description:"Multi digit multiplication"
},

{
id:"division",
name:"➗ Division",
description:"Long division"
},

{
id:"fractions",
name:"🍕 Fractions",
description:"Fraction operations"
},

{
id:"decimals",
name:"🔢 Decimals",
description:"Introduction to decimals"
},

{
id:"factors",
name:"🔍 Factors & Multiples",
description:"Prime numbers"
},

{
id:"geometry",
name:"📐 Geometry",
description:"Angles and shapes"
},

{
id:"measurement",
name:"📏 Measurement",
description:"Units and conversions"
}

]

},



/* ============================
   GRADE 5
============================ */

5: {

name:"Grade 5",

topics:[

{
id:"fractions",
name:"🍕 Fractions",
description:"Mixed numbers"
},

{
id:"decimals",
name:"🔢 Decimals",
description:"Decimal operations"
},

{
id:"percent",
name:"%",
description:"Percent calculations"
},

{
id:"ratio",
name:"⚖️ Ratios",
description:"Ratios and proportions"
},

{
id:"algebra",
name:"🧮 Algebra",
description:"Basic equations"
},

{
id:"volume",
name:"📦 Volume",
description:"Volume calculations"
},

{
id:"geometry",
name:"📐 Geometry",
description:"Advanced shapes"
}

]

},



/* ============================
   GRADE 6
============================ */

6: {

name:"Grade 6",

topics:[

{
id:"integers",
name:"🔢 Integers",
description:"Positive and negative numbers"
},

{
id:"fractions",
name:"🍕 Fractions",
description:"Advanced fractions"
},

{
id:"decimals",
name:"🔢 Decimals",
description:"Decimal calculations"
},

{
id:"ratio",
name:"⚖️ Ratios",
description:"Rates and proportions"
},

{
id:"percent",
name:"%",
description:"Percent problems"
},

{
id:"algebra",
name:"🧮 Algebra",
description:"Expressions and equations"
},

{
id:"statistics",
name:"📊 Statistics",
description:"Mean, median and graphs"
}

]

},



/* ============================
   GRADE 7
============================ */

7: {

name:"Grade 7",

topics:[

{
id:"rational",
name:"🔢 Rational Numbers",
description:"Fractions and decimals"
},

{
id:"algebra",
name:"🧮 Algebra",
description:"Linear equations"
},

{
id:"exponents",
name:"⬆️ Exponents",
description:"Powers and roots"
},

{
id:"percent",
name:"%",
description:"Percent applications"
},

{
id:"geometry",
name:"📐 Geometry",
description:"Angles and formulas"
},

{
id:"probability",
name:"🎲 Probability",
description:"Chance and outcomes"
},

{
id:"statistics",
name:"📊 Statistics",
description:"Data analysis"
}

]

}

};





/*
=====================================
Difficulty Settings
=====================================
*/

const difficultyLevels = {


Easy:{

min:1,

max:20

},


Medium:{

min:10,

max:100

},


Hard:{

min:50,

max:1000

}


};





/*
=====================================
Quiz Options
=====================================
*/


const quizSettings = {


questionOptions:[

10,

20,

50,

100

],


timerOptions:[

0,

30,

60,

120,

300

]


};
/*
=================================================

Math Learning Center

app.js

Controls:
- Application startup
- Grade selection
- Topic selection
- Navigation
- Theme

=================================================
*/


let selectedGrade = null;

let selectedTopic = "";





/*
=====================================
Start Application
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
function(){


loadGrades();


setupButtons();


loadTheme();

updateStatistics();

});








/*
=====================================
Load Grade Cards
=====================================
*/


function loadGrades(){


let container =
document.getElementById(
"gradeGrid"
);


container.innerHTML="";



Object.keys(mathData)
.forEach(
grade=>{


let data =
mathData[grade];



let card =
document.createElement(
"div"
);



card.className =
"gradeCard";



card.innerHTML =

`

<h3>
${data.name}
</h3>

<p>
${data.topics.length}
Topics Available
</p>

`;



card.onclick=function(){

selectGrade(
grade
);

};



container.appendChild(
card
);



}

);



}










/*
=====================================
Select Grade
=====================================
*/


function selectGrade(grade){


selectedGrade=grade;



let data =
mathData[grade];



document.getElementById(
"gradeTitle"
)
.innerHTML=

data.name;



let container =
document.getElementById(
"topicGrid"
);



container.innerHTML="";



data.topics.forEach(
topic=>{


let card =
document.createElement(
"div"
);



card.className=
"topicCard";



card.innerHTML=

`

<h3>
${topic.name}
</h3>

<p>
${topic.description}
</p>

`;



card.onclick=function(){


selectedTopic =
topic.id;



showPage(
"settingsPage"
);



};



container.appendChild(
card
);


}

);



showPage(
"topicPage"
);


}









/*
=====================================
Page Navigation
=====================================
*/


function showPage(pageId){


let pages =
document.querySelectorAll(
"section"
);



pages.forEach(
page=>{


page.classList.add(
"hidden"
);


});



document.getElementById(
pageId
)
.classList.remove(
"hidden"
);



}








/*
=====================================
Buttons Setup
=====================================
*/


function setupButtons(){



/*
Back Buttons
*/

let backs =
document.querySelectorAll(
".backButton"
);



backs.forEach(
button=>{


button.onclick=function(){


if(
selectedGrade
){

showPage(
"topicPage"
);

}

else{

showPage(
"homePage"
);

}


};


});





/*
Theme Button
*/


document.getElementById(
"themeButton"
)
.onclick=function(){


toggleTheme();


};





/*
Home Button
*/


document.getElementById(
"homeButton"
)
.onclick=function(){


showPage(
"homePage"
);


};





}










/*
=====================================
Dark Mode
=====================================
*/


function toggleTheme(){


document.body.classList.toggle(
"dark"
);



let dark =
document.body.classList.contains(
"dark"
);



localStorage.setItem(
"darkMode",
dark
);



document.getElementById(
"themeButton"
)
.innerHTML =

dark

?

"☀️ Light Mode"

:

"🌙 Dark Mode";


}







function loadTheme(){


let dark =
localStorage.getItem(
"darkMode"
);



if(
dark==="true"
){


document.body.classList.add(
"dark"
);



document.getElementById(
"themeButton"
)
.innerHTML=

"☀️ Light Mode";


}



}
