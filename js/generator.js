/*
=================================================
Math Learning Center
generator.js (Final Version with Elapsed Time + clockTime)
=================================================
*/

/* ---------------------------------------------
   Random Number Helper
--------------------------------------------- */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------------------------------------------
   Shuffle Array
--------------------------------------------- */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* ---------------------------------------------
   Generate Wrong Options
--------------------------------------------- */
function generateOptions(answer) {
    const options = [answer];

    while (options.length < 4) {
        const variation = randomNumber(-10, 10);
        const wrong = answer + variation;

        if (wrong !== answer && !options.includes(wrong)) {
            options.push(wrong);
        }
    }

    return shuffle(options);
}

/* ---------------------------------------------
   MAIN QUESTION GENERATOR
--------------------------------------------- */
function generateQuestion(topic, difficulty, grade) {
    if (!topic) topic = "addition";

    switch (topic) {
        case "addition": return generateAddition(difficulty);
        case "subtraction": return generateSubtraction(difficulty);
        case "multiplication": return generateMultiplication(difficulty);
        case "division": return generateDivision(difficulty);
        case "fractions": return generateFraction();
        case "decimals": return generateDecimal();
        case "percent": return generatePercent();
        case "ratio": return generateRatio();
        case "algebra": return generateAlgebra();
        case "integers": return generateInteger();
        case "exponents": return generateExponent();
        case "wordProblems": return generateWordProblem(grade);
        case "elapsedTime": return generateElapsedTime();   // ⭐ NEW
