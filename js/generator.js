/*
=================================================
Math Learning Center

generator.js

Creates random math questions

Supports:
- Addition
- Subtraction
- Multiplication
- Division
- Fractions
- Decimals
- Percent
- Ratio
- Algebra
- Integers
- Exponents

=================================================
*/

let count =
Number(
document.getElementById(
"questionCount"
).value
);

/*
=====================================
Random Number Helper
=====================================
*/

function randomNumber(min,max){

return Math.floor(
Math.random()*(max-min+1)
)+min;

}


/*
=====================================
Shuffle Array
=====================================
*/

function shuffle(array){

return array.sort(
()=>Math.random()-0.5
);

}



/*
=====================================
Generate Wrong Answers
=====================================
*/

function generateOptions(answer){


let options=[answer];


while(options.length<4){


let wrong;


let variation=randomNumber(
-10,
10
);


wrong=answer+variation;


if(
wrong!==answer &&
!options.includes(wrong)
){

options.push(wrong);

}


}


return shuffle(options);


}



/*
=====================================
MAIN QUESTION GENERATOR
=====================================
*/


function generateQuestion(topic,difficulty){


switch(topic){


case "addition":

return generateAddition(difficulty);



case "subtraction":

return generateSubtraction(difficulty);



case "multiplication":

return generateMultiplication(difficulty);



case "division":

return generateDivision(difficulty);



case "fractions":

return generateFraction();



case "decimals":

return generateDecimal();



case "percent":

return generatePercent();



case "ratio":

return generateRatio();



case "algebra":

return generateAlgebra();



case "integers":

return generateInteger();



case "exponents":

return generateExponent();



default:

return generateAddition(difficulty);


}



}





/*
=====================================
Addition
=====================================
*/


function generateAddition(level){


let range=difficultyLevels[level];


let a=randomNumber(
range.min,
range.max
);


let b=randomNumber(
range.min,
range.max
);


let answer=a+b;


return {


question:`${a} + ${b} = ?`,


answer:answer,


options:
generateOptions(answer)


};


}





/*
=====================================
Subtraction
=====================================
*/


function generateSubtraction(level){


let range=difficultyLevels[level];


let a=randomNumber(
range.min,
range.max
);


let b=randomNumber(
1,
a
);


let answer=a-b;


return {


question:`${a} - ${b} = ?`,


answer:answer,


options:
generateOptions(answer)


};


}







/*
=====================================
Multiplication
=====================================
*/


function generateMultiplication(level){


let max;


if(level==="Easy"){

max=10;

}

else if(level==="Medium"){

max=20;

}

else{

max=50;

}



let a=randomNumber(
1,
max
);


let b=randomNumber(
1,
12
);


let answer=a*b;



return {


question:`${a} × ${b} = ?`,


answer:answer,


options:
generateOptions(answer)


};



}







/*
=====================================
Division
=====================================
*/


function generateDivision(level){


let divisor=randomNumber(
2,
12
);


let answer=randomNumber(
1,
20
);


let dividend=
divisor*answer;



return {


question:`${dividend} ÷ ${divisor} = ?`,


answer:answer,


options:
generateOptions(answer)


};


}








/*
=====================================
Fractions
=====================================
*/


function generateFraction(){


let denominator=randomNumber(
2,
10
);


let numerator=randomNumber(
1,
denominator-1
);



let answer=
(numerator/denominator)
.toFixed(2);



return {


question:

`What is ${numerator}/${denominator} as decimal?`,


answer:answer,


options:
generateOptions(
Number(answer)
)
.map(
x=>Number(x).toFixed(2)
)


};



}








/*
=====================================
Decimals
=====================================
*/


function generateDecimal(){


let a=
(randomNumber(10,99)/10)
.toFixed(1);


let b=
(randomNumber(10,99)/10)
.toFixed(1);



let answer=
(
Number(a)+Number(b)
)
.toFixed(1);



return {


question:

`${a} + ${b} = ?`,


answer:answer,


options:

generateOptions(
Number(answer)
)
.map(
x=>Number(x).toFixed(1)
)


};



}








/*
=====================================
Percent
=====================================
*/


function generatePercent(){


let percent=randomNumber(
10,
90
);


let number=randomNumber(
10,
200
);



let answer=
(
number*percent/100
)
.toFixed(0);



return {


question:

`${percent}% of ${number} = ?`,


answer:Number(answer),


options:
generateOptions(
Number(answer)
)


};



}








/*
=====================================
Ratio
=====================================
*/


function generateRatio(){


let a=randomNumber(
1,
10
);


let b=randomNumber(
1,
10
);


let multiply=randomNumber(
2,
5
);



return {


question:

`If ratio is ${a}:${b}, 
what is the second number when first becomes ${a*multiply}?`,


answer:b*multiply,


options:
generateOptions(
b*multiply
)


};


}








/*
=====================================
Algebra
=====================================
*/


function generateAlgebra(){


let x=randomNumber(
1,
20
);


let add=randomNumber(
1,
20
);


let total=x+add;



return {


question:

`x + ${add} = ${total}. Find x`,


answer:x,


options:
generateOptions(x)


};


}








/*
=====================================
Integers
=====================================
*/


function generateInteger(){


let a=randomNumber(
-50,
50
);


let b=randomNumber(
-50,
50
);


let answer=a+b;



return {


question:

`${a} + (${b}) = ?`,


answer:answer,


options:
generateOptions(answer)


};


}



/*
=====================================
Word problem
=====================================
*/

function generateWordProblem(grade) {
    const problems = wordProblems[grade];
    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
}



/*
=====================================
Exponents
=====================================
*/


function generateExponent(){


let base=randomNumber(
2,
8
);


let power=randomNumber(
2,
4
);



let answer=
Math.pow(
base,
power
);



return {


question:

`${base}⁽${power}⁾ = ?`,


answer:answer,


options:
generateOptions(answer)


};


}
