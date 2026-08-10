/* =====================================================
   MATH ADVENTURE
   Student Profile + Quiz System
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let selectedTopic = "mixed";

let selectedAvatar = "🦊";

let studentProfile = null;

let questions = [];

let answers = [];

let currentQuestion = 0;

let testTimer = null;

let remainingSeconds = 0;


/* =====================================================
   STORAGE KEY
===================================================== */

const PROFILE_STORAGE_KEY =
    "mathAdventureStudentProfile";


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudentProfile();

        setupTopicButtons();

        setupGradeChange();

        console.log(
            "Math Adventure loaded successfully."
        );

    }
);


/* =====================================================
   LOAD STUDENT PROFILE
===================================================== */

function loadStudentProfile() {

    const savedProfile =
        localStorage.getItem(
            PROFILE_STORAGE_KEY
        );


    if (savedProfile) {

        try {

            studentProfile =
                JSON.parse(
                    savedProfile
                );

            selectedAvatar =
                studentProfile.avatar ||
                "🦊";


            showDashboard();

        }

        catch (error) {

            console.error(
                "Unable to load student profile:",
                error
            );

            showProfileScreen();

        }

    }

    else {

        showProfileScreen();

    }

}


/* =====================================================
   SHOW PROFILE SCREEN
===================================================== */

function showProfileScreen() {

    hideAllScreens();

    document
        .getElementById("profileScreen")
        .classList.remove("hidden");

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    if (!studentProfile) {

        showProfileScreen();

        return;

    }


    hideAllScreens();


    document
        .getElementById("dashboardScreen")
        .classList.remove("hidden");


    updateStudentUI();

    updateStatistics();

}


/* =====================================================
   SHOW PRACTICE SCREEN
===================================================== */

function showPracticeScreen() {

    hideAllScreens();


    document
        .getElementById("setupScreen")
        .classList.remove("hidden");


    updateStudentUI();


    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );


    if (
        studentProfile &&
        gradeSelect
    ) {

        gradeSelect.value =
            String(
                studentProfile.grade
            );

    }

}


/* =====================================================
   HIDE ALL SCREENS
===================================================== */

function hideAllScreens() {

    const screens = [

        "profileScreen",

        "dashboardScreen",

        "setupScreen",

        "testScreen",

        "resultScreen"

    ];


    screens.forEach(
        function (id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =====================================================
   SELECT AVATAR
===================================================== */

function selectAvatar(button) {

    document
        .querySelectorAll(".avatar-btn")
        .forEach(
            function (btn) {

                btn.classList.remove(
                    "selected"
                );

            }
        );


    button.classList.add(
        "selected"
    );


    selectedAvatar =
        button.dataset.avatar;

}


/* =====================================================
   SAVE STUDENT PROFILE
===================================================== */

function saveStudentProfile() {

    const nameInput =
        document.getElementById(
            "studentName"
        );


    const gradeInput =
        document.getElementById(
            "profileGrade"
        );


    const error =
        document.getElementById(
            "profileError"
        );


    const name =
        nameInput.value.trim();


    const grade =
        parseInt(
            gradeInput.value
        );


    error.textContent = "";


    if (!name) {

        error.textContent =
            "Please enter the student's name.";

        nameInput.focus();

        return;

    }


    if (
        name.length < 2
    ) {

        error.textContent =
            "Please enter at least 2 characters.";

        nameInput.focus();

        return;

    }


    studentProfile = {

        name: name,

        grade: grade,

        avatar: selectedAvatar,

        testsCompleted: 0,

        questionsAnswered: 0,

        bestScore: 0

    };


    localStorage.setItem(

        PROFILE_STORAGE_KEY,

        JSON.stringify(
            studentProfile
        )

    );


    showDashboard();

}


/* =====================================================
   EDIT STUDENT PROFILE
===================================================== */

function editStudentProfile() {

    if (!studentProfile) {

        showProfileScreen();

        return;

    }


    hideAllScreens();


    document
        .getElementById("profileScreen")
        .classList.remove("hidden");


    document
        .getElementById("studentName")
        .value =
            studentProfile.name;


    document
        .getElementById("profileGrade")
        .value =
            String(
                studentProfile.grade
            );


    selectedAvatar =
        studentProfile.avatar ||
        "🦊";


    document
        .querySelectorAll(".avatar-btn")
        .forEach(
            function (button) {

                button.classList.toggle(

                    "selected",

                    button.dataset.avatar ===
                    selectedAvatar

                );

            }
        );


    document
        .getElementById("profileTitle")
        .textContent =
            "✏️ Edit Your Profile";


    document
        .getElementById("profileSubtitle")
        .textContent =
            "Update your name, avatar, or grade.";


    document
        .querySelector(".profile-start-btn")
        .textContent =
            "💾 Save Profile";

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutStudent() {

    const confirmed =
        confirm(
            "Do you want to switch student?"
        );


    if (!confirmed) {

        return;

    }


    clearInterval(testTimer);


    studentProfile = null;

    localStorage.removeItem(
        PROFILE_STORAGE_KEY
    );


    document
        .getElementById("studentName")
        .value = "";


    document
        .getElementById("profileGrade")
        .value = "1";


    selectedAvatar = "🦊";


    document
        .querySelectorAll(".avatar-btn")
        .forEach(
            function (button, index) {

                button.classList.toggle(
                    "selected",
                    index === 0
                );

            }
        );


    document
        .getElementById("profileTitle")
        .textContent =
            "Welcome to Math Adventure!";


    document
        .getElementById("profileSubtitle")
        .textContent =
            "Create your student profile to begin.";


    document
        .querySelector(".profile-start-btn")
        .textContent =
            "🚀 Create My Profile";


    showProfileScreen();

}


/* =====================================================
   UPDATE STUDENT UI
===================================================== */

function updateStudentUI() {

    if (!studentProfile) {

        return;

    }


    const name =
        studentProfile.name;


    const grade =
        studentProfile.grade;


    const avatar =
        studentProfile.avatar ||
        "🦊";


    /* HEADER */

    document
        .getElementById(
            "headerAvatar"
        )
        .textContent = avatar;


    document
        .getElementById(
            "headerStudentName"
        )
        .textContent = name;


    document
        .getElementById(
            "headerStudentGrade"
        )
        .textContent =
            "Grade " + grade;


    document
        .getElementById(
            "headerProfile"
        )
        .classList.remove(
            "hidden"
        );


    /* DASHBOARD */

    document
        .getElementById(
            "dashboardAvatar"
        )
        .textContent = avatar;


    document
        .getElementById(
            "dashboardName"
        )
        .textContent = name;


    document
        .getElementById(
            "dashboardGrade"
        )
        .textContent =
            "📚 Grade " + grade;


    /* SETUP */

    document
        .getElementById(
            "setupAvatar"
        )
        .textContent = avatar;


    document
        .getElementById(
            "setupStudentName"
        )
        .textContent = name;


    document
        .getElementById(
            "setupStudentGrade"
        )
        .textContent =
            "Grade " + grade;


    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );


    if (gradeSelect) {

        gradeSelect.value =
            String(grade);

    }

}


/* =====================================================
   GRADE CHANGE
===================================================== */

function setupGradeChange() {

    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );


    if (!gradeSelect) {

        return;

    }


    gradeSelect.addEventListener(
        "change",
        function () {

            if (
                studentProfile
            ) {

                studentProfile.grade =
                    parseInt(
                        this.value
                    );


                localStorage.setItem(

                    PROFILE_STORAGE_KEY,

                    JSON.stringify(
                        studentProfile
                    )

                );


                updateStudentUI();

            }

        }
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    if (!studentProfile) {

        return;

    }


    document
        .getElementById(
            "testsCompleted"
        )
        .textContent =
            studentProfile.testsCompleted ||
            0;


    document
        .getElementById(
            "questionsAnswered"
        )
        .textContent =
            studentProfile.questionsAnswered ||
            0;


    document
        .getElementById(
            "bestScore"
        )
        .textContent =
            (
                studentProfile.bestScore ||
                0
            ) + "%";

}


/* =====================================================
   TOPIC BUTTONS
===================================================== */

function setupTopicButtons() {

    document
        .querySelectorAll(".topic-btn")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".topic-btn"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        this.classList.add(
                            "selected"
                        );


                        selectedTopic =
                            this.dataset.topic;

                    }
                );

            }
        );

}


/* =====================================================
   START TEST
===================================================== */

function startTest() {

    const grade =
        parseInt(
            document
                .getElementById(
                    "gradeSelect"
                )
                .value
        );


    const count =
        parseInt(
            document
                .getElementById(
                    "questionCount"
                )
                .value
        );


    const minutes =
        parseInt(
            document
                .getElementById(
                    "timeLimit"
                )
                .value
        );


    const answerType =
        document
            .getElementById(
                "answerType"
            )
            .value;


    questions = [];

    answers = [];

    currentQuestion = 0;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        questions.push(

            generateQuestion(

                grade,

                selectedTopic,

                answerType

            )

        );

    }


    document
        .getElementById(
            "setupScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "resultScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "testScreen"
        )
        .classList.remove(
            "hidden"
        );


    if (minutes > 0) {

        remainingSeconds =
            minutes * 60;

        startTimer();

    }

    else {

        clearInterval(
            testTimer
        );


        document
            .getElementById(
                "timer"
            )
            .textContent =
                "⏱ No Timer";

    }


    showQuestion();

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(
        testTimer
    );


    updateTimerDisplay();


    testTimer =
        setInterval(
            function () {

                remainingSeconds--;

                updateTimerDisplay();


                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        testTimer
                    );


                    alert(
                        "⏰ Time is up!"
                    );


                    finishTest();

                }

            },
            1000
        );

}


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "timer"
        );


    if (
        remainingSeconds <= 0
    ) {

        timer.textContent =
            "⏰ 0:00";

        return;

    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timer.textContent =
        "⏱ " +
        minutes +
        ":" +
        String(seconds)
            .padStart(
                2,
                "0"
            );


    if (
        remainingSeconds <= 60
    ) {

        timer.classList.add(
            "warning"
        );

    }

    else {

        timer.classList.remove(
            "warning"
        );

    }

}


/* =====================================================
   GENERATE QUESTION
===================================================== */

function generateQuestion(
    grade,
    topic,
    answerType
) {

    let actualTopic = topic;


    if (
        topic === "mixed"
    ) {

        const topics =
            getAvailableTopics(
                grade
            );


        actualTopic =
            topics[
                randomInt(
                    0,
                    topics.length - 1
                )
            ];

    }


    let question;


    switch (actualTopic) {

        case "addition":

            question =
                additionQuestion(
                    grade
                );

            break;


        case "subtraction":

            question =
                subtractionQuestion(
                    grade
                );

            break;


        case "multiplication":

            question =
                multiplicationQuestion(
                    grade
                );

            break;


        case "division":

            question =
                divisionQuestion(
                    grade
                );

            break;


        case "fractions":

            question =
                fractionQuestion(
                    grade
                );

            break;


        case "decimals":

            question =
                decimalQuestion(
                    grade
                );

            break;


        case "word":

            question =
                wordQuestion(
                    grade
                );

            break;


        case "time":

            question =
                timeQuestion(
                    grade
                );

            break;


        case "comparison":

            question =
                comparisonQuestion(
                    grade
                );

            break;


        default:

            question =
                additionQuestion(
                    grade
                );

    }


    if (
        answerType === "choice"
    ) {

        question.answerMode =
            "choice";

    }


    else if (
        answerType === "blank"
    ) {

        question.answerMode =
            "blank";

    }


    else {

        question.answerMode =
            Math.random() < .5
                ? "choice"
                : "blank";

    }


    return question;

}


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuestion() {

    const q =
        questions[
            currentQuestion
        ];


    document
        .getElementById(
            "progressText"
        )
        .textContent =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            questions.length;


    document
        .getElementById(
            "progressBar"
        )
        .style.width =
            (
                (
                    currentQuestion + 1
                ) /
                questions.length *
                100
            ) + "%";


    const container =
        document.getElementById(
            "questionContainer"
        );


    let html = `

        <div class="question-number">
            ${q.type}
        </div>

    `;


    if (
        q.type === "Time"
    ) {

        html +=
            createClockHTML(
                q.hour,
                q.minute
            );

    }


    html += `

        <div class="question">

            ${q.question}

        </div>

    `;


    if (
        q.answerMode === "choice"
    ) {

        html += `

            <div class="answer-mode-label">
                Choose the correct answer
            </div>

        `;

    }

    else {

        html += `

            <div class="answer-mode-label">
                Type your answer below
            </div>

        `;

    }


    if (
        q.answerMode === "choice" &&
        q.options
    ) {

        html +=
            `<div class="answer-grid">`;


        q.options.forEach(
            function (option) {

                const selected =
                    String(
                        answers[
                            currentQuestion
                        ]
                    ) ===
                    String(option)
                        ? "selected"
                        : "";


                html += `

                    <button
                        class="answer-btn ${selected}"
                        onclick="selectAnswer(this, '${escapeString(option)}')"
                    >

                        ${option}

                    </button>

                `;

            }
        );


        html +=
            `</div>`;

    }

    else {

        const existing =
            answers[
                currentQuestion
            ] || "";


        html += `

            <div class="text-answer">

                <input
                    type="text"
                    id="textAnswer"
                    value="${escapeHTML(existing)}"
                    placeholder="Type your answer"
                    autocomplete="off"
                >

            </div>

        `;

    }


    container.innerHTML =
        html;


    const input =
        document.getElementById(
            "textAnswer"
        );


    if (input) {

        input.focus();


        input.addEventListener(
            "input",
            function () {

                answers[
                    currentQuestion
                ] =
                    this.value;

            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    nextQuestion();

                }

            }
        );

    }

}


/* =====================================================
   ESCAPE STRING
===================================================== */

function escapeString(value) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   SELECT MULTIPLE CHOICE
===================================================== */

function selectAnswer(
    button,
    value
) {

    document
        .querySelectorAll(
            ".answer-btn"
        )
        .forEach(
            function (btn) {

                btn.classList.remove(
                    "selected"
                );

            }
        );


    button.classList.add(
        "selected"
    );


    answers[
        currentQuestion
    ] = value;

}


/* =====================================================
   SAVE TEXT ANSWER
===================================================== */

function saveTextAnswer() {

    const input =
        document.getElementById(
            "textAnswer"
        );


    if (input) {

        answers[
            currentQuestion
        ] =
            input.value.trim();

    }

}


/* =====================================================
   NEXT QUESTION
===================================================== */

function nextQuestion() {

    saveTextAnswer();


    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        showQuestion();

    }

    else {

        finishTest();

    }

}


/* =====================================================
   PREVIOUS QUESTION
===================================================== */

function previousQuestion() {

    saveTextAnswer();


    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        showQuestion();

    }

}


/* =====================================================
   FINISH TEST
===================================================== */

function finishTest() {

    saveTextAnswer();


    clearInterval(
        testTimer
    );


    let correct = 0;


    questions.forEach(
        function (q, index) {

            if (
                isCorrectAnswer(
                    answers[index],
                    q.answer
                )
            ) {

                correct++;

            }

        }
    );


    const percentage =
        Math.round(
            correct /
            questions.length *
            100
        );


    /* SAVE STUDENT STATISTICS */

    if (studentProfile) {

        studentProfile.testsCompleted =
            (
                studentProfile.testsCompleted ||
                0
            ) + 1;


        studentProfile.questionsAnswered =
            (
                studentProfile.questionsAnswered ||
                0
            ) + questions.length;


        studentProfile.bestScore =
            Math.max(
                studentProfile.bestScore || 0,
                percentage
            );


        localStorage.setItem(

            PROFILE_STORAGE_KEY,

            JSON.stringify(
                studentProfile
            )

        );

    }


    document
        .getElementById(
            "testScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "resultScreen"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "scorePercent"
        )
        .textContent =
            percentage + "%";


    let message;


    if (
        percentage >= 90
    ) {

        message =
            "🏆 Amazing! You are a Math Superstar!";

    }

    else if (
        percentage >= 75
    ) {

        message =
            "🌟 Great Job! Keep practicing!";

    }

    else if (
        percentage >= 60
    ) {

        message =
            "👍 Good Work! You are improving!";

    }

    else {

        message =
            "💪 Keep practicing. You can do it!";

    }


    document
        .getElementById(
            "resultMessage"
        )
        .textContent =
            message;


    document
        .getElementById(
            "resultDetails"
        )
        .textContent =
            "You got " +
            correct +
            " out of " +
            questions.length +
            " questions correct.";


    createReview();

}


/* =====================================================
   CHECK ANSWER
===================================================== */

function isCorrectAnswer(
    userAnswer,
    correctAnswer
) {

    if (
        userAnswer === undefined ||
        userAnswer === null ||
        String(userAnswer).trim() === ""
    ) {

        return false;

    }


    const user =
        String(userAnswer)
            .trim()
            .toLowerCase();


    const correct =
        String(correctAnswer)
            .trim()
            .toLowerCase();


    const userNumber =
        Number(user);


    const correctNumber =
        Number(correct);


    if (
        !Number.isNaN(userNumber) &&
        !Number.isNaN(correctNumber) &&
        user !== ""
    ) {

        return (
            Math.abs(
                userNumber -
                correctNumber
            ) < 0.000001
        );

    }


    return user === correct;

}


/* =====================================================
   REVIEW
===================================================== */

function createReview() {

    const container =
        document.getElementById(
            "reviewContainer"
        );


    container.innerHTML = "";


    questions.forEach(
        function (q, index) {

            const userAnswer =
                answers[index] ||
                "No Answer";


            const correct =
                isCorrectAnswer(
                    userAnswer,
                    q.answer
                );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "review-item " +
                (
                    correct
                        ? "correct"
                        : "incorrect"
                );


            div.innerHTML = `

                <div class="review-question">

                    ${index + 1}.
                    ${escapeHTML(q.question)}

                </div>


                <div>

                    Your answer:

                    <span class="${
                        correct
                            ? "correct-answer"
                            : "wrong-answer"
                    }">

                        ${escapeHTML(
                            userAnswer
                        )}

                    </span>

                </div>


                ${
                    correct
                        ? ""
                        : `

                    <div>

                        Correct answer:

                        <span class="correct-answer">

                            ${escapeHTML(
                                q.answer
                            )}

                        </span>

                    </div>

                    `
                }

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =====================================================
   NEW TEST
===================================================== */

function newTest() {

    clearInterval(
        testTimer
    );


    document
        .getElementById(
            "resultScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "testScreen"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "setupScreen"
        )
        .classList.remove(
            "hidden"
        );


    updateStudentUI();

}


/* =====================================================
   RANDOM NUMBER
===================================================== */

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


/* =====================================================
   AVAILABLE TOPICS
===================================================== */

function getAvailableTopics(
    grade
) {

    if (
        grade === 1
    ) {

        return [

            "addition",
            "subtraction",
            "time",
            "comparison",
            "word"

        ];

    }


    if (
        grade === 2
    ) {

        return [

            "addition",
            "subtraction",
            "multiplication",
            "division",
            "time",
            "comparison",
            "word"

        ];

    }


    if (
        grade === 3
    ) {

        return [

            "addition",
            "subtraction",
            "multiplication",
            "division",
            "fractions",
            "time",
            "word",
            "comparison"

        ];

    }


    return [

        "addition",
        "subtraction",
        "multiplication",
        "division",
        "fractions",
        "decimals",
        "time",
        "word",
        "comparison"

    ];

}


/* =====================================================
   ADDITION
===================================================== */

function additionQuestion(
    grade
) {

    let max;


    if (grade === 1)
        max = 20;

    else if (grade === 2)
        max = 100;

    else if (grade === 3)
        max = 1000;

    else if (grade === 4)
        max = 10000;

    else if (grade === 5)
        max = 100000;

    else
        max = 1000000;


    const a =
        randomInt(
            1,
            max
        );


    const b =
        randomInt(
            1,
            max
        );


    const answer =
        a + b;


    return {

        type: "Addition",

        question:
            `${a} + ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   SUBTRACTION
===================================================== */

function subtractionQuestion(
    grade
) {

    let max;


    if (grade === 1)
        max = 20;

    else if (grade === 2)
        max = 100;

    else if (grade === 3)
        max = 1000;

    else if (grade === 4)
        max = 10000;

    else if (grade === 5)
        max = 100000;

    else
        max = 1000000;


    const a =
        randomInt(
            1,
            max
        );


    const b =
        randomInt(
            1,
            a
        );


    const answer =
        a - b;


    return {

        type: "Subtraction",

        question:
            `${a} − ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   MULTIPLICATION
===================================================== */

function multiplicationQuestion(
    grade
) {

    let maxA;

    let maxB;


    if (grade === 1) {

        maxA = 5;
        maxB = 5;

    }

    else if (grade === 2) {

        maxA = 10;
        maxB = 10;

    }

    else if (grade === 3) {

        maxA = 12;
        maxB = 12;

    }

    else if (grade === 4) {

        maxA = 20;
        maxB = 20;

    }

    else if (grade === 5) {

        maxA = 50;
        maxB = 20;

    }

    else {

        maxA = 100;
        maxB = 50;

    }


    const a =
        randomInt(
            1,
            maxA
        );


    const b =
        randomInt(
            1,
            maxB
        );


    const answer =
        a * b;


    return {

        type: "Multiplication",

        question:
            `${a} × ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   DIVISION
===================================================== */

function divisionQuestion(
    grade
) {

    let divisorMax;


    if (
        grade <= 2
    ) {

        divisorMax = 5;

    }

    else if (
        grade === 3
    ) {

        divisorMax = 10;

    }

    else if (
        grade <= 5
    ) {

        divisorMax = 20;

    }

    else {

        divisorMax = 50;

    }


    const divisor =
        randomInt(
            1,
            divisorMax
        );


    const answer =
        randomInt(
            1,
            divisorMax
        );


    const dividend =
        divisor * answer;


    return {

        type: "Division",

        question:
            `${dividend} ÷ ${divisor} = ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   FRACTIONS
===================================================== */

function fractionQuestion(
    grade
) {

    const denominator =
        randomInt(
            2,
            grade >= 6
                ? 12
                : 8
        );


    const numerator =
        randomInt(
            1,
            denominator - 1
        );


    if (
        grade <= 4
    ) {

        return {

            type: "Fractions",

            question:
                `Which fraction represents ` +
                `${numerator} out of ${denominator}?`,

            answer:
                `${numerator}/${denominator}`,

            options: [

                `${numerator}/${denominator}`,

                `${numerator + 1}/${denominator}`,

                `${numerator}/${denominator + 1}`,

                `${denominator}/${numerator}`

            ]

        };

    }


    const n2 =
        randomInt(
            1,
            9
        );


    const d2 =
        randomInt(
            2,
            10
        );


    const value =
        (
            numerator / denominator
            +
            n2 / d2
        );


    const answer =
        Math.round(
            value * 100
        ) / 100;


    return {

        type: "Fractions",

        question:
            `${numerator}/${denominator} + ` +
            `${n2}/${d2} ≈ ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   DECIMALS
===================================================== */

function decimalQuestion(
    grade
) {

    const a =
        randomInt(
            1,
            grade <= 5
                ? 99
                : 999
        ) / 10;


    const b =
        randomInt(
            1,
            grade <= 5
                ? 99
                : 999
        ) / 10;


    const answer =
        Math.round(
            (a + b) * 100
        ) / 100;


    return {

        type: "Decimals",

        question:
            `${a} + ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   WORD PROBLEM
===================================================== */

function wordQuestion(
    grade
) {

    const names = [

        "Emma",
        "Liam",
        "Noah",
        "Mia",
        "Ava",
        "Lucas",
        "Sophia"

    ];


    const name =
        names[
            randomInt(
                0,
                names.length - 1
            )
        ];


    const operation =
        randomInt(
            1,
            4
        );


    let a;

    let b;

    let answer;

    let question;


    if (
        operation === 1
    ) {

        a =
            randomInt(
                5,
                grade <= 2
                    ? 50
                    : 500
            );


        b =
            randomInt(
                1,
                grade <= 2
                    ? 20
                    : 300
            );


        answer =
            a + b;


        question =
            `${name} has ${a} apples. ` +
            `A friend gives ${b} more apples. ` +
            `How many apples does ${name} have now?`;

    }


    else if (
        operation === 2
    ) {

        a =
            randomInt(
                10,
                grade <= 2
                    ? 50
                    : 500
            );


        b =
            randomInt(
                1,
                a
            );


        answer =
            a - b;


        question =
            `${name} has ${a} stickers. ` +
            `${name} gives ${b} stickers away. ` +
            `How many stickers are left?`;

    }


    else if (
        operation === 3
    ) {

        a =
            randomInt(
                2,
                grade <= 3
                    ? 10
                    : 20
            );


        b =
            randomInt(
                2,
                grade <= 3
                    ? 10
                    : 20
            );


        answer =
            a * b;


        question =
            `There are ${a} boxes with ${b} toys ` +
            `in each box. How many toys are there altogether?`;

    }


    else {

        b =
            randomInt(
                2,
                grade <= 3
                    ? 8
                    : 20
            );


        answer =
            randomInt(
                2,
                grade <= 3
                    ? 10
                    : 30
            );


        a =
            b * answer;


        question =
            `${a} candies are shared equally among ` +
            `${b} children. How many candies does ` +
            `each child get?`;

    }


    return {

        type: "Word Problem",

        question: question,

        answer: answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =====================================================
   TIME
===================================================== */

function timeQuestion(
    grade
) {

    const hour =
        randomInt(
            1,
            12
        );


    let minute;


    if (
        grade <= 2
    ) {

        const values = [

            0,
            15,
            30,
            45

        ];


        minute =
            values[
                randomInt(
                    0,
                    values.length - 1
                )
            ];

    }

    else {

        minute =
            randomInt(
                0,
                11
            ) * 5;

    }


    const answer =
        formatTime(
            hour,
            minute
        );


    return {

        type: "Time",

        question:
            "What time is shown on the clock?",

        answer: answer,

        hour: hour,

        minute: minute,

        options:
            makeTimeOptions(
                hour,
                minute
            )

    };

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(
    hour,
    minute
) {

    return (

        hour +
        ":" +
        String(minute)
            .padStart(
                2,
                "0"
            )

    );

}


/* =====================================================
   CLOCK HTML
===================================================== */

function createClockHTML(
    hour,
    minute
) {

    const minuteAngle =
        minute * 6;


    const hourAngle =
        (
            hour % 12
        ) * 30 +
        minute * .5;


    let numbers = "";


    for (
        let i = 1;
        i <= 12;
        i++
    ) {

        numbers += `

            <div
                class="clock-number clock-${i}"
            >
                ${i}
            </div>

        `;

    }


    return `

        <div class="clock-question">

            <div class="clock">

                ${numbers}

                <div
                    class="hand hour-hand"
                    style="
                        transform:
                        translateX(-50%)
                        rotate(${hourAngle}deg);
                    "
                ></div>

                <div
                    class="hand minute-hand"
                    style="
                        transform:
                        translateX(-50%)
                        rotate(${minuteAngle}deg);
                    "
                ></div>

                <div class="clock-center"></div>

            </div>

        </div>

    `;

}


/* =====================================================
   TIME OPTIONS
===================================================== */

function makeTimeOptions(
    hour,
    minute
) {

    const correct =
        formatTime(
            hour,
            minute
        );


    const options =
        [correct];


    while (
        options.length < 4
    ) {

        const h =
            randomInt(
                1,
                12
            );


        const m =
            randomInt(
                0,
                11
            ) * 5;


        const value =
            formatTime(
                h,
                m
            );


        if (
            !options.includes(
                value
            )
        ) {

            options.push(
                value
            );

        }

    }


    return shuffle(
        options
    );

}


/* =====================================================
   NUMBER OPTIONS
===================================================== */

function makeNumberOptions(
    answer
) {

    const numeric =
        Number(answer);


    const options =
        [numeric];


    let safety = 0;


    while (
        options.length < 4 &&
        safety < 100
    ) {

        safety++;


        let difference;


        if (
            Math.abs(numeric) < 10
        ) {

            difference =
                randomInt(
                    1,
                    5
                );

        }

        else {

            difference =
                randomInt(
                    1,
                    Math.max(
                        5,
                        Math.floor(
                            Math.abs(
                                numeric
                            ) * .2
                        )
                    )
                );

        }


        const value =
            numeric +
            (
                Math.random() < .5
                    ? -difference
                    : difference
            );


        if (
            value >= 0 &&
            !options.includes(
                value
            )
        ) {

            options.push(
                value
            );

        }

    }


    return shuffle(
        options.map(
            String
        )
    );

}


/* =====================================================
   COMPARISON
===================================================== */

function comparisonQuestion(
    grade
) {

    let max;


    if (
        grade <= 2
    ) {

        max = 50;

    }

    else if (
        grade <= 4
    ) {

        max = 1000;

    }

    else {

        max = 100000;

    }


    const a =
        randomInt(
            1,
            max
        );


    const b =
        randomInt(
            1,
            max
        );


    let answer;


    if (
        a > b
    ) {

        answer = ">";

    }

    else if (
        a < b
    ) {

        answer = "<";

    }

    else {

        answer = "=";

    }


    return {

        type: "Compare Numbers",

        question:
            `${a} &nbsp; ___ &nbsp; ${b}`,

        answer: answer,

        options: [

            ">",
            "<",
            "="

        ]

    };

}


/* =====================================================
   SHUFFLE
===================================================== */

function shuffle(
    array
) {

    return array.sort(
        function () {

            return (
                Math.random() - .5
            );

        }
    );

}
