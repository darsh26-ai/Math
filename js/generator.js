/*
=================================================
Math Learning Center
generator.js (Improved Production Version)
=================================================
*/

/* ---------------------------------------------
   Random Number Helper
--------------------------------------------- */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------------------------------------------
   Shuffle Array (Fisher-Yates)
--------------------------------------------- */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* ---------------------------------------------
   Generate Wrong Options (Smart Variation)
--------------------------------------------- */
function generateOptions(answer) {
    const options = new Set([answer]);

    while (options.size < 4) {
        let wrong;

        if (typeof answer === "number") {
            wrong = answer + randomNumber(-10, 10);
        } else {
            wrong = randomNumber(1, 20);
        }

        if (wrong !== answer) options.add(wrong);
    }

    return shuffle([...options]);
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
        case "elapsedTime": return generateElapsedTime();   // ⭐ Clock questions
        default:
            return {
                question: "Unknown topic: " + topic,
                answer: 0,
                options: [0, 1, 2, 3]
            };
    }
}

/* ---------------------------------------------
   ADDITION
--------------------------------------------- */
function generateAddition(difficulty) {
    const { min, max } = difficultyLevels[difficulty];
    const a = randomNumber(min, max);
    const b = randomNumber(min, max);

    return {
        question: `${a} + ${b} = ?`,
        answer: a + b,
        options: generateOptions(a + b)
    };
}

/* ---------------------------------------------
   SUBTRACTION
--------------------------------------------- */
function generateSubtraction(difficulty) {
    const { min, max } = difficultyLevels[difficulty];
    const a = randomNumber(min, max);
    const b = randomNumber(min, max);

    return {
        question: `${a} - ${b} = ?`,
        answer: a - b,
        options: generateOptions(a - b)
    };
}

/* ---------------------------------------------
   MULTIPLICATION
--------------------------------------------- */
function generateMultiplication(difficulty) {
    const { min, max } = difficultyLevels[difficulty];
    const a = randomNumber(min, max);
    const b = randomNumber(min, max);

    return {
        question: `${a} × ${b} = ?`,
        answer: a * b,
        options: generateOptions(a * b)
    };
}

/* ---------------------------------------------
   DIVISION
--------------------------------------------- */
function generateDivision(difficulty) {
    const { min, max } = difficultyLevels[difficulty];
    const b = randomNumber(min, max);
    const answer = randomNumber(min, max);
    const a = b * answer;

    return {
        question: `${a} ÷ ${b} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   FRACTIONS
--------------------------------------------- */
function generateFraction() {
    const n1 = randomNumber(1, 9);
    const d1 = randomNumber(2, 9);
    const n2 = randomNumber(1, 9);
    const d2 = randomNumber(2, 9);

    const question = `${n1}/${d1} + ${n2}/${d2}`;
    const answer = (n1 / d1) + (n2 / d2);

    return {
        question,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   DECIMALS
--------------------------------------------- */
function generateDecimal() {
    const a = (Math.random() * 10).toFixed(1);
    const b = (Math.random() * 10).toFixed(1);

    const answer = Number(a) + Number(b);

    return {
        question: `${a} + ${b} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   PERCENT
--------------------------------------------- */
function generatePercent() {
    const base = randomNumber(50, 200);
    const pct = randomNumber(5, 50);

    const answer = Math.round(base * (pct / 100));

    return {
        question: `${pct}% of ${base} = ?`,
        answer,
        options: generateOptions(answer)
    };
}

/* ---------------------------------------------
   RATIO
--------------------------------------------- */
function generateRatio() {
    const a = randomNumber(1, 10);
    const b = randomNumber(1, 10);

    return {
        question: `Simplify ratio ${a}:${b}`,
        answer: a / b,
        options: generateOptions(a / b)
    };
}

/* ---------------------------------------------
   ALGEBRA
--------------------------------------------- */
function generateAlgebra() {
    const x = randomNumber(1, 20);
    return {
        question: `Solve: x + ${randomNumber(1, 10)} = ${x + randomNumber(1, 10)}`,
        answer: x,
        options: generateOptions(x)
    };
}

/* ---------------------------------------------
   INTEGERS
--------------------------------------------- */
function generateInteger() {
    const a = randomNumber(-20, 20);
    const b = randomNumber(-20, 20);

    return {
        question: `${a} + ${b} = ?`,
        answer: a + b,
        options: generateOptions(a + b)
    };
}

/* ---------------------------------------------
   EXPONENTS
--------------------------------------------- */
function generateExponent() {
    const base = randomNumber(2, 5);
    const exp = randomNumber(2, 4);

    return {
        question: `${base}^${exp} = ?`,
        answer: Math.pow(base, exp),
        options: generateOptions(Math.pow(base, exp))
    };
}

/* ---------------------------------------------
   WORD PROBLEMS
--------------------------------------------- */
function generateWordProblem(grade) {
    const problems = wordProblems[grade] || wordProblems[1];
    const p = problems[randomNumber(0, problems.length - 1)];

    return {
        question: p.question,
        answer: p.answer,
        options: generateOptions(p.answer)
    };
}

/* ---------------------------------------------
   ELAPSED TIME (Clock Questions)
--------------------------------------------- */
function generateElapsedTime() {
    const hour = randomNumber(1, 12);
    const minute = randomNumber(0, 59);

    const added = randomNumber(5, 60); // minutes added
    const finalMinutes = hour * 60 + minute + added;

    const finalHour = Math.floor(finalMinutes / 60) % 12 || 12;
    const finalMinute = finalMinutes % 60;

    return {
        question: `If the time is ${hour}:${minute.toString().padStart(2, "0")} and ${added} minutes pass, what time is it?`,
        answer: `${finalHour}:${finalMinute.toString().padStart(2, "0")}`,
        clockTime: `${hour}:${minute.toString().padStart(2, "0")}`,
        options: shuffle([
            `${finalHour}:${finalMinute.toString().padStart(2, "0")}`,
            `${hour}:${minute.toString().padStart(2, "0")}`,
            `${hour}:${(minute + 5).toString().padStart(2, "0")}`,
            `${hour}:${(minute + 10).toString().padStart(2, "0")}`
        ])
    };
}

console.log("Improved generator.js loaded");
