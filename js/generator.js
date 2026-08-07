/*
=================================================
Math Learning Center
generator.js (Improved Version)
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
   MAIN QUESTION GENERATOR (fixed)
--------------------------------------------- */
function generateQuestion(topic, difficulty, grade) {
    if (!topic) {
        console.warn("No topic provided. Defaulting to addition.");
        topic = "addition";
    }

    switch (topic) {
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

        case "wordProblems":
            return generateWordProblem(grade);

        default:
            console.warn("Unknown topic:", topic);
            return generateAddition(difficulty);
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

/* ---------------------------------------------
   Word Problems
--------------------------------------------- */
function generateWordProblem(grade) {
    const problems = wordProblems[grade];

    if (!problems || problems.length === 0) {
        return {
            question: "No word problems available for this grade.",
            answer: null,
            options: []
        };
    }

    const randomIndex = randomNumber(0, problems.length - 1);
    return problems[randomIndex];
}

/*
=================================================
Dynamic Word Problem Generator
=================================================
*/

function generateWordProblem(grade) {

    // Difficulty scaling by grade
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

    // Random numbers for story
    const a = randomNumber(min, max);
    const b = randomNumber(min / 2, max / 2);
    const c = randomNumber(1, 10);

    // Story templates
    const templates = [

        // Addition
        {
            question: `A student has ${a} stickers and gets ${b} more. How many stickers now?`,
            answer: a + b
        },

        {
            question: `A store has ${a} toys. They receive ${b} new toys. How many toys now?`,
            answer: a + b
        },

        // Subtraction
        {
            question: `${a} apples were on a tree. ${b} fell down. How many remain?`,
            answer: a - b
        },

        {
            question: `A box has ${a} crayons. ${b} break. How many crayons still work?`,
            answer: a - b
        },

        // Multi-step
        {
            question: `A class has ${a} students. ${b} go home early and ${c} new students join. How many students now?`,
            answer: a - b + c
        },

        {
            question: `A farmer has ${a} cows. He sells ${b} and buys ${c} more. How many cows now?`,
            answer: a - b + c
        },

        // Multiplication
        {
            question: `A pack has ${c} pencils. A teacher buys ${a} packs. How many pencils total?`,
            answer: a * c
        },

        {
            question: `Each box has ${c} candies. ${b} boxes are filled. How many candies total?`,
            answer: b * c
        },

        // Division
        {
            question: `${a} candies are shared equally among ${c} kids. How many candies per kid?`,
            answer: Math.floor(a / c)
        },

        {
            question: `A teacher divides ${a} markers into groups of ${c}. How many groups?`,
            answer: Math.floor(a / c)
        },

        // Percent (Grades 5–7)
        {
            question: `${c * 10}% of ${a} students passed the test. How many passed?`,
            answer: Math.round((c * 10 / 100) * a)
        },

        // Ratio (Grades 6–7)
        {
            question: `A recipe uses ratio ${c}:${b}. If you use ${a} cups of flour, how much sugar?`,
            answer: Math.round((b / c) * a)
        }
    ];

    // Pick a random template
    const chosen = randomItem(templates);

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
