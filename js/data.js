/*
=================================================
Math Learning Center
data.js
=================================================
*/


const mathData = {

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
}

]

}


// Continue Grade 2 - Grade 7 here...

};




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


console.log(
"data.js loaded",
mathData
);
