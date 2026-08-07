/*
=================================================
Math Learning Center
generator.js (Final Version with Elapsed Time)
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
        case "elapsedTime": return generateElapsedTime();   // ⭐ NEW TOPIC
        default: return generateAddition(difficulty);
    }
}

/* ---------------------------------------------
   Addition
--------------------------------------------- */
function generateAddition(level) {
    const range = difficultyLevels[level] || difficultyLevels.Easy;
    const a = randomNumber(range.min, range.max);
    const b = randomNumber(range.min, range.max);
    const answer = a + b;

    return {
        question: `${a} + ${b} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Subtraction
--------------------------------------------- */
function generateSubtraction(level) {
    const range = difficultyLevels[level] || difficultyLevels.Easy;
    const a = randomNumber(range.min, range.max);
    const b = randomNumber(1, a);
    const answer = a - b;

    return {
        question: `${a} - ${b} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Multiplication
--------------------------------------------- */
function generateMultiplication(level) {
    const range = difficultyLevels[level] || difficultyLevels.Easy;
    const a = randomNumber(range.min, range.max);
    const b = randomNumber(1, 12);
    const answer = a * b;

    return {
        question: `${a} × ${b} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Division
--------------------------------------------- */
function generateDivision(level) {
    const divisor = randomNumber(2, 12);
    const answer = randomNumber(1, 20);
    const dividend = divisor * answer;

    return {
        question: `${dividend} ÷ ${divisor} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Fractions → Decimal
--------------------------------------------- */
function generateFraction() {
    const denominator = randomNumber(2, 10);
    const numerator = randomNumber(1, denominator - 1);
    const answer = Number((numerator / denominator).toFixed(2));

    return {
        question: `What is ${numerator}/${denominator} as a decimal?`,
        answer,
        options: generateOptions(answer).map(x => Number(x).toFixed(2))
    };
}

/* ---------------------------------------------
   Decimals
--------------------------------------------- */
function generateDecimal() {
    const a = Number((randomNumber(10, 99) / 10).toFixed(1));
    const b = Number((randomNumber(10, 99) / 10).toFixed(1));
    const answer = Number((a + b).toFixed(1));

    return {
        question: `${a} + ${b} = ?`,
        answer,
        options: generateOptions(answer).map(x => Number(x).toFixed(1))
    };
}

/* ---------------------------------------------
   Percent
--------------------------------------------- */
function generatePercent() {
    const percent = randomNumber(10, 90);
    const number = randomNumber(10, 200);
    const answer = Math.round(number * percent / 100);

    return {
        question: `${percent}% of ${number} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Ratio
--------------------------------------------- */
function generateRatio() {
    const a = randomNumber(1, 10);
    const b = randomNumber(1, 10);
    const multiplier = randomNumber(2, 5);
    const answer = b * multiplier;

    return {
        question: `If ratio is ${a}:${b}, what is the second number when the first becomes ${a * multiplier}?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   Algebra
--------------------------------------------- */
function generateAlgebra() {
    const x = randomNumber(1, 20);
    const add = randomNumber(1, 20);
    const total = x + add;

    return {
        question: `x + ${add} = ${total}. Find x`,
        answer: x,
        options: generateOptions(x)
    };
}

/* ---------------------------------------------
   Integers
--------------------------------------------- */
function generateInteger() {
    const a = randomNumber(-50, 50);
    const b = randomNumber(-50, 50);
    const answer = a + b;

    return {
        question: `${a} + (${b}) = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/*
=================================================
Dynamic Word Problem Generator (Unique)
=================================================
*/

function generateWordProblem(grade) {

    const ranges = {
        1: { min: 1, max: 20 },
        2: { min: 10, max: 40 },
        3: { min: 20, max: 80 },
        4: { min: 30, max: 120 },
        5: { min: 40, max: 200 },
        6: { min: 50, max: 300 },
        7: { min: 60, max: 500 }
    };

    const { min, max } = ranges[grade] || ranges[1];

    const a = randomNumber(min, max);
    const b = randomNumber(min / 2, max / 2);
    const c = randomNumber(1, 10);

    const templates = [

        () => ({ question: `A student has ${a} stickers and gets ${b} more. How many now?`, answer: a + b }),
        () => ({ question: `A store has ${a} toys and receives ${b} more. Total toys?`, answer: a + b }),

        () => ({ question: `${a} apples were on a tree. ${b} fell. How many remain?`, answer: a - b }),
        () => ({ question: `A box has ${a} crayons. ${b} break. How many work?`, answer: a - b }),

        () => ({ question: `A class has ${a} students. ${b} leave and ${c} join. Total?`, answer: a - b + c }),
        () => ({ question: `A farmer has ${a} cows. Sells ${b}, buys ${c}. Total?`, answer: a - b + c }),

        () => ({ question: `A pack has ${c} pencils. Teacher buys ${a} packs. Total pencils?`, answer: a * c }),
        () => ({ question: `${b} boxes with ${c} candies each. Total candies?`, answer: b * c }),

        () => ({ question: `${a} candies shared among ${c} kids. How many each?`, answer: Math.floor(a / c) }),
        () => ({ question: `${a} markers divided into groups of ${c}. Number of groups?`, answer: Math.floor(a / c) }),

        () => ({ question: `${c * 10}% of ${a} students passed. How many?`, answer: Math.round((c * 10 / 100) * a) }),

        () => ({ question: `Recipe ratio ${c}:${b}. If flour is ${a}, how much sugar?`, answer: Math.round((b / c) * a) })
    ];

    const chosen = templates[randomNumber(0, templates.length - 1)]();

    return {
        question: chosen.question,
        answer: chosen.answer,
        options: generateOptions(chosen.answer)
    };
}

/* ---------------------------------------------
   Exponents
--------------------------------------------- */
function generateExponent() {
    const base = randomNumber(2, 8);
    const power = randomNumber(2, 4);
    const answer = Math.pow(base, power);

    return {
        question: `${base}⁽${power}⁾ = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/*
=================================================
Elapsed Time (Clock Reading + Time Addition)
=================================================
*/

function generateElapsedTime() {

    // Random hour and minute
    const hour = randomNumber(1, 12);
    const minute = randomNumber(0, 59);

    // Random elapsed minutes
    const elapsedChoices = [15, 20, 30, 45, 60];
    const elapsed = elapsedChoices[randomNumber(0, elapsedChoices.length - 1)];

    // Build start time
    const startDate = new Date();
    startDate.setHours(hour);
    startDate.setMinutes(minute);

    // Add elapsed minutes
    const endDate = new Date(startDate.getTime() + elapsed * 60000);

    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const formattedStart = `${hour}:${minute.toString().padStart(2, "0")}`;
    const formattedEnd = `${endHour}:${endMinute.toString().padStart(2, "0")}`;

    return {
        question: `The clock shows ${formattedStart}. What time will it be after ${elapsed} minutes?`,
        answer: formattedEnd,
        options: shuffle([
            formattedEnd,
            `${endHour}:${(endMinute + 10) % 60}`,
            `${endHour}:${(endMinute + 15) % 60}`,
            `${endHour}:${(endMinute + 20) % 60}`,
            `${endHour}:${(endMinute + 25) % 60}`
        ])
    };
}
