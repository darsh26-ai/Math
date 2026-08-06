/*
=================================================
Math Learning Center
data.js (Improved Version)
=================================================
*/

/* ---------------------------------------------
   Core Math Data (Grades + Topics)
--------------------------------------------- */

const mathData = {
    1: {
        name: "Grade 1",
        topics: [
            { id: "addition", name: "➕ Addition", description: "Add numbers up to 100" },
            { id: "subtraction", name: "➖ Subtraction", description: "Subtract numbers up to 100" }
        ]
    },

    2: {
        name: "Grade 2",
        topics: [
            { id: "addition", name: "➕ Addition", description: "3-digit addition" },
            { id: "subtraction", name: "➖ Subtraction", description: "3-digit subtraction" },
            { id: "multiplication", name: "✖️ Multiplication", description: "Multiplication tables" },
            { id: "division", name: "➗ Division", description: "Basic division" },
            { id: "fractions", name: "🍕 Fractions", description: "Halves, thirds and quarters" },
            { id: "money", name: "💵 Money", description: "Money calculations" },
            { id: "measurement", name: "📏 Measurement", description: "Length and weight" },
            { id: "time", name: "🕒 Time", description: "Elapsed time" },
            { id: "wordProblems", name: "📖 Word Problems", description: "Math story problems" }
        ]
    },

    3: {
        name: "Grade 3",
        topics: [
            { id: "addition", name: "➕ Addition", description: "Large number addition" },
            { id: "subtraction", name: "➖ Subtraction", description: "Large number subtraction" },
            { id: "multiplication", name: "✖️ Multiplication", description: "Multiply up to 12×12" },
            { id: "division", name: "➗ Division", description: "Division practice" },
            { id: "fractions", name: "🍕 Fractions", description: "Equivalent fractions" },
            { id: "area", name: "📐 Area & Perimeter", description: "Area and perimeter" },
            { id: "graphs", name: "📊 Graphs", description: "Read graphs" },
            { id: "measurement", name: "📏 Measurement", description: "Metric units" },
            { id: "wordProblems", name: "📖 Word Problems", description: "Multi-step problems" }
        ]
    },

    4: {
        name: "Grade 4",
        topics: [
            { id: "addition", name: "➕ Addition", description: "Large number addition" },
            { id: "subtraction", name: "➖ Subtraction", description: "Large number subtraction" },
            { id: "multiplication", name: "✖️ Multiplication", description: "Multi-digit multiplication" },
            { id: "division", name: "➗ Division", description: "Long division" },
            { id: "fractions", name: "🍕 Fractions", description: "Fraction operations" },
            { id: "decimals", name: "🔢 Decimals", description: "Decimal numbers" },
            { id: "geometry", name: "📐 Geometry", description: "Angles and shapes" },
            { id: "measurement", name: "📏 Measurement", description: "Conversions" },
            { id: "wordProblems", name: "📖 Word Problems", description: "Problem solving" }
        ]
    },

    5: {
        name: "Grade 5",
        topics: [
            { id: "addition", name: "➕ Addition", description: "Large number operations" },
            { id: "subtraction", name: "➖ Subtraction", description: "Large number subtraction" },
            { id: "multiplication", name: "✖️ Multiplication", description: "Large multiplication" },
            { id: "division", name: "➗ Division", description: "Long division" },
            { id: "fractions", name: "🍕 Fractions", description: "Mixed numbers" },
            { id: "decimals", name: "🔢 Decimals", description: "Decimal operations" },
            { id: "percent", name: "📈 Percent", description: "Percent calculations" },
            { id: "ratio", name: "⚖️ Ratio", description: "Ratios and proportions" },
            { id: "geometry", name: "📐 Geometry", description: "Volume and area" },
            { id: "algebra", name: "🧮 Algebra", description: "Basic algebra" }
        ]
    },

    6: {
        name: "Grade 6",
        topics: [
            { id: "integers", name: "➕➖ Integers", description: "Positive and negative numbers" },
            { id: "fractions", name: "🍕 Fractions", description: "Fraction operations" },
            { id: "decimals", name: "🔢 Decimals", description: "Decimal operations" },
            { id: "ratio", name: "⚖️ Ratio", description: "Ratios and rates" },
            { id: "percent", name: "📈 Percent", description: "Percent applications" },
            { id: "algebra", name: "🧮 Algebra", description: "Expressions and equations" },
            { id: "geometry", name: "📐 Geometry", description: "Area and surface area" },
            { id: "statistics", name: "📊 Statistics", description: "Mean, median and mode" },
            { id: "probability", name: "🎲 Probability", description: "Basic probability" }
        ]
    },

    7: {
        name: "Grade 7",
        topics: [
            { id: "integers", name: "➕➖ Integers", description: "Integer operations" },
            { id: "rational", name: "🔢 Rational Numbers", description: "Fractions and decimals" },
            { id: "algebra", name: "🧮 Algebra", description: "Linear equations" },
            { id: "exponents", name: "⬆️ Exponents", description: "Powers and roots" },
            { id: "percent", name: "📈 Percent", description: "Percent increase/decrease" },
            { id: "geometry", name: "📐 Geometry", description: "Angles and circles" },
            { id: "probability", name: "🎲 Probability", description: "Probability" },
            { id: "statistics", name: "📊 Statistics", description: "Data analysis" },
            { id: "expressions", name: "📘 Expressions", description: "Simplifying expressions" }
        ]
    }
};

/* ---------------------------------------------
   Difficulty Levels
--------------------------------------------- */

const difficultyLevels = {
    Easy:   { min: 1,   max: 20 },
    Medium: { min: 10,  max: 100 },
    Hard:   { min: 50,  max: 1000 }
};

/* ---------------------------------------------
   Quiz Settings
--------------------------------------------- */

const quizSettings = {
    questionOptions: [10, 20, 50, 100],
    timerOptions: [0, 30, 60, 120, 300]
};

/* ---------------------------------------------
   Word Problems (Grade-based)
--------------------------------------------- */

const wordProblems = {
    1: [
        { question: "Rita has 5 apples. She buys 3 more. How many apples now?", answer: 8 },
        { question: "Tom has 10 balloons. 4 flew away. How many left?", answer: 6 }
    ],

    2: [
        { question: "A box has 24 crayons. Sarah adds 13 more. How many crayons now?", answer: 37 }
    ],

    3: [
        { question: "A farmer has 45 cows. He sells 18. How many cows remain?", answer: 27 }
    ]
};

console.log("data.js loaded", mathData);
