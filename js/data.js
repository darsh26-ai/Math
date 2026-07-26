/*
=================================================
Math Learning Center

data.js

Contains:
- Grade information
- Topics for each grade
- Difficulty levels
- Quiz settings

=================================================
*/


const mathData = {


/* ==========================
   GRADE 1
========================== */

1: {

name: "Grade 1",

topics: [

{
id:"addition",
name:"➕ Addition",
description:"Add numbers up to 100"
},

{
id:"subtraction",
name:"➖ Subtraction",
description:"Subtract numbers"
},

{
id:"comparison",
name:"⚖️ Compare Numbers",
description:"Greater than and less than"
},

{
id:"counting",
name:"🔢 Counting",
description:"Counting and number patterns"
},

{
id:"shapes",
name:"🔺 Shapes",
description:"Basic shapes"
},

{
id:"time",
name:"🕒 Time",
description:"Learn clock reading"
},

{
id:"money",
name:"💵 Money",
description:"Coins and values"
},

{
id:"wordProblems",
name:"📖 Word Problems",
description:"Simple math stories"
}

]

},




/* ==========================
   GRADE 2
========================== */

2: {

name:"Grade 2",

topics:[

{
id:"addition",
name:"➕ Addition",
description:"Three digit addition"
},

{
id:"subtraction",
name:"➖ Subtraction",
description:"Borrowing subtraction"
},

{
id:"multiplication",
name:"✖️ Multiplication",
description:"Multiplication tables"
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
description:"Money calculations"
},

{
id:"measurement",
name:"📏 Measurement",
description:"Length and weight"
},

{
id:"wordProblems",
name:"📖 Word Problems",
description:"Story problems"
}

]

},




/* ==========================
   GRADE 3
========================== */

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




/* ==========================
   GRADE 4
========================== */

4: {

name:"Grade 4",

topics:[

{
id:"multiplication",
name:"✖️ Multiplication",
description:"Multi-digit multiplication"
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
description:"Decimal introduction"
},

{
id:"factors",
name:"🔍 Factors",
description:"Factors and multiples"
},

{
id:"geometry",
name:"📐 Geometry",
description:"Angles and shapes"
},

{
id:"measurement",
name:"📏 Measurement",
description:"Units and conversion"
}

]

},




/* ==========================
   GRADE 5
========================== */

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
name:"% Percent",
description:"Percentage calculations"
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
description:"Advanced geometry"
}

]

},




/* ==========================
   GRADE 6
========================== */

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
name:"% Percent",
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




/* ==========================
   GRADE 7
========================== */

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
name:"% Percent",
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
Quiz Settings
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





console.log(
"data.js loaded successfully",
mathData
);
