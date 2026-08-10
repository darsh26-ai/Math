/* =====================================================
   MATH ADVENTURE
   Student Login + Dashboard + Progress + Math Engine
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let selectedTopic = "mixed";

let selectedAvatar = "🧑‍🚀";

let questions = [];

let answers = [];

let currentQuestion = 0;

let testTimer = null;

let remainingSeconds = 0;

let currentTestStart = null;


/* =====================================================
   STORAGE KEYS
===================================================== */

const STUDENTS_KEY = "mathAdventureStudents";

const CURRENT_STUDENT_KEY = "mathAdventureCurrentStudent";


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTopicButtons();

        initializeApp();

        console.log(
            "Math Adventure loaded successfully."
        );

    }
);


/* =====================================================
   INITIALIZE APP
===================================================== */

function initializeApp() {

    const currentStudent =
        getCurrentStudent();

    if (currentStudent) {

        showDashboard();

    }
    else {

        showLogin();

    }

}


/* =====================================================
   STUDENT STORAGE
===================================================== */

function getStudents() {

    try {

        return JSON.parse(
            localStorage.getItem(
                STUDENTS_KEY
            )
        ) || [];

    }
    catch (error) {

        console.error(
            "Could not read students:",
            error
        );

        return [];

    }

}


function saveStudents(students) {

    localStorage.setItem(
        STUDENTS_KEY,
        JSON.stringify(students)
    );

}


function getCurrentStudent() {

    const name =
        localStorage.getItem(
            CURRENT_STUDENT_KEY
        );

    if (!name) {

        return null;

    }

    const students =
        getStudents();

    return students.find(
        student =>
            student.name.toLowerCase() ===
            name.toLowerCase()
    ) || null;

}


function setCurrentStudent(name) {

    localStorage.setItem(
        CURRENT_STUDENT_KEY,
        name
    );

}


function clearCurrentStudent() {

    localStorage.removeItem(
        CURRENT_STUDENT_KEY
    );

}


/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

function hideAllScreens() {

    const screens = [
        "loginScreen",
        "profileScreen",
        "dashboardScreen",
        "profileViewScreen",
        "progressScreen",
        "setupScreen",
        "testScreen",
        "resultScreen"
    ];

    screens.forEach(
        id => {

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


function showLogin() {

    clearCurrentStudent();

    hideAllScreens();

    document
        .getElementById("loginScreen")
        .classList.remove("hidden");

    updateHeader();

    clearLoginError();

}


function showCreateProfile() {

    hideAllScreens();

    document
        .getElementById("profileScreen")
        .classList.remove("hidden");

    clearProfileError();

}


function showDashboard() {

    const student =
        getCurrentStudent();

    if (!student) {

        showLogin();

        return;

    }

    clearInterval(testTimer);

    hideAllScreens();

    document
        .getElementById("dashboardScreen")
        .classList.remove("hidden");

    updateDashboard();

    updateHeader();

}


function showPracticeSetup() {

    const student =
        getCurrentStudent();

    if (!student) {

        showLogin();

        return;

    }

    hideAllScreens();

    document
        .getElementById("setupScreen")
        .classList.remove("hidden");

    setGradeFromProfile();

}


function showProgress() {

    const student =
        getCurrentStudent();

    if (!student) {

        showLogin();

        return;

    }

    hideAllScreens();

    document
        .getElementById("progressScreen")
        .classList.remove("hidden");

    updateProgressScreen();

}


function showProfile() {

    const student =
        getCurrentStudent();

    if (!student) {

        showLogin();

        return;

    }

    hideAllScreens();

    document
        .getElementById("profileViewScreen")
        .classList.remove("hidden");

    updateProfileScreen();

}


/* =====================================================
   HEADER
===================================================== */

function updateHeader() {

    const student =
        getCurrentStudent();

    const headerStudent =
        document.getElementById(
            "headerStudent"
        );

    if (!student) {

        headerStudent.classList.add(
            "hidden"
        );

        return;

    }

    headerStudent.classList.remove(
        "hidden"
    );

    document.getElementById(
        "headerAvatar"
    ).textContent =
        student.avatar;

    document.getElementById(
        "headerStudentName"
    ).textContent =
        student.name;

}


/* =====================================================
   CREATE PROFILE
===================================================== */

function createStudentProfile() {

    const name =
        document
            .getElementById(
                "profileName"
            )
            .value
            .trim();

    const pin =
        document
            .getElementById(
                "profilePin"
            )
            .value
            .trim();

    const grade =
        parseInt(
            document
                .getElementById(
                    "profileGrade"
                )
                .value
        );


    if (!name) {

        showProfileError(
            "Please enter the student's name."
        );

        return;

    }


    if (!/^\d{4,6}$/.test(pin)) {

        showProfileError(
            "PIN must contain 4 to 6 digits."
        );

        return;

    }


    if (
        !grade ||
        grade < 1 ||
        grade > 7
    ) {

        showProfileError(
            "Please select a grade."
        );

        return;

    }


    const students =
        getStudents();


    const exists =
        students.some(
            student =>
                student.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (exists) {

        showProfileError(
            "A student with this name already exists. Please login."
        );

        return;

    }


    const student = {

        id:
            Date.now().toString(),

        name:
            name,

        pin:
            pin,

        grade:
            grade,

        avatar:
            selectedAvatar,

        createdAt:
            new Date().toISOString(),

        tests:
            []

    };


    students.push(student);

    saveStudents(students);

    setCurrentStudent(name);

    document
        .getElementById(
            "profileName"
        )
        .value = "";

    document
        .getElementById(
            "profilePin"
        )
        .value = "";

    showDashboard();

}


/* =====================================================
   LOGIN
===================================================== */

function loginStudent() {

    const name =
        document
            .getElementById(
                "loginStudentName"
            )
            .value
            .trim();

    const pin =
        document
            .getElementById(
                "loginPin"
            )
            .value
            .trim();


    if (!name || !pin) {

        showLoginError(
            "Please enter your name and PIN."
        );

        return;

    }


    const students =
        getStudents();


    const student =
        students.find(
            item =>
                item.name.toLowerCase() ===
                    name.toLowerCase() &&
                item.pin === pin
        );


    if (!student) {

        showLoginError(
            "Student name or PIN is incorrect."
        );

        return;

    }


    setCurrentStudent(
        student.name
    );


    document
        .getElementById(
            "loginStudentName"
        )
        .value = "";

    document
        .getElementById(
            "loginPin"
        )
        .value = "";


    showDashboard();

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutStudent() {

    clearInterval(testTimer);

    clearCurrentStudent();

    questions = [];

    answers = [];

    currentQuestion = 0;

    showLogin();

}


/* =====================================================
   PROFILE AVATAR
===================================================== */

function selectAvatar(button) {

    document
        .querySelectorAll(
            ".avatar-btn"
        )
        .forEach(
            btn =>
                btn.classList.remove(
                    "selected"
                )
        );


    button.classList.add(
        "selected"
    );


    selectedAvatar =
        button.dataset.avatar;

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const student =
        getCurrentStudent();

    if (!student) {

        return;

    }


    const stats =
        calculateStudentStats(
            student
        );


    document.getElementById(
        "dashboardAvatar"
    ).textContent =
        student.avatar;


    document.getElementById(
        "dashboardName"
    ).textContent =
        student.name;


    document.getElementById(
        "dashboardGrade"
    ).textContent =
        "Grade " + student.grade;


    document.getElementById(
        "testsCompleted"
    ).textContent =
        stats.tests;


    document.getElementById(
        "averageScore"
    ).textContent =
        stats.average + "%";


    document.getElementById(
        "bestScore"
    ).textContent =
        stats.best + "%";


    document.getElementById(
        "questionsAnswered"
    ).textContent =
        stats.questions;


    renderRecentTests(
        student
    );

}


/* =====================================================
   PROFILE SCREEN
===================================================== */

function updateProfileScreen() {

    const student =
        getCurrentStudent();

    if (!student) {

        return;

    }


    const stats =
        calculateStudentStats(
            student
        );


    document.getElementById(
        "profileViewAvatar"
    ).textContent =
        student.avatar;


    document.getElementById(
        "profileViewName"
    ).textContent =
        student.name;


    document.getElementById(
        "profileViewGrade"
    ).textContent =
        "Grade " + student.grade;


    document.getElementById(
        "profileTests"
    ).textContent =
        stats.tests;


    document.getElementById(
        "profileAverage"
    ).textContent =
        stats.average + "%";


    document.getElementById(
        "profileBest"
    ).textContent =
        stats.best + "%";

}


/* =====================================================
   CALCULATE STATISTICS
===================================================== */

function calculateStudentStats(
    student
) {

    const tests =
        student.tests || [];


    if (tests.length === 0) {

        return {

            tests: 0,

            average: 0,

            best: 0,

            questions: 0

        };

    }


    const scores =
        tests.map(
            test =>
                Number(
                    test.percentage
                ) || 0
        );


    const total =
        scores.reduce(
            (sum, score) =>
                sum + score,
            0
        );


    const average =
        Math.round(
            total / scores.length
        );


    const best =
        Math.max(
            ...scores
        );


    const questions =
        tests.reduce(
            (sum, test) =>
                sum +
                Number(
                    test.totalQuestions
                ),
            0
        );


    return {

        tests:
            tests.length,

        average:
            average,

        best:
            best,

        questions:
            questions

    };

}


/* =====================================================
   RECENT TESTS
===================================================== */

function renderRecentTests(
    student
) {

    const container =
        document.getElementById(
            "recentTests"
        );


    const tests =
        student.tests || [];


    if (tests.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div style="font-size:40px;">
                    🚀
                </div>

                <p>
                    No tests completed yet.
                </p>

                <p>
                    Start your first Math Adventure!
                </p>

            </div>

        `;

        return;

    }


    const recent =
        tests
            .slice()
            .reverse()
            .slice(0, 5);


    container.innerHTML =
        recent
            .map(
                test => `

                    <div class="recent-test">

                        <div class="recent-test-left">

                            <strong>
                                ${escapeHTML(
                                    test.topic
                                )}
                            </strong>

                            <small>
                                Grade ${test.grade}
                                •
                                ${test.correct}/${test.totalQuestions}
                                correct
                                •
                                ${formatDate(
                                    test.date
                                )}
                            </small>

                        </div>

                        <div class="test-score">
                            ${test.percentage}%
                        </div>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   PROGRESS SCREEN
===================================================== */

function updateProgressScreen() {

    const student =
        getCurrentStudent();

    if (!student) {

        return;

    }


    const stats =
        calculateStudentStats(
            student
        );


    document.getElementById(
        "progressAvatar"
    ).textContent =
        student.avatar;


    document.getElementById(
        "progressOverall"
    ).textContent =
        stats.average + "%";


    document.getElementById(
        "overallProgressBar"
    ).style.width =
        stats.average + "%";


    renderTopicPerformance(
        student
    );


    renderTestHistory(
        student
    );

}


/* =====================================================
   TOPIC PERFORMANCE
===================================================== */

function renderTopicPerformance(
    student
) {

    const container =
        document.getElementById(
            "topicPerformance"
        );


    const tests =
        student.tests || [];


    if (tests.length === 0) {

        container.innerHTML = `

            <div class="empty-state">
                Complete a test to see
                your topic performance.
            </div>

        `;

        return;

    }


    const topicData = {};


    tests.forEach(
        test => {

            const topic =
                test.topic || "Mixed Practice";


            if (!topicData[topic]) {

                topicData[topic] = {

                    total:
                        0,

                    score:
                        0

                };

            }


            topicData[topic].total++;

            topicData[topic].score +=
                Number(
                    test.percentage
                ) || 0;

        }
    );


    const rows =
        Object.entries(
            topicData
        )
        .map(
            ([topic, data]) => {

                const average =
                    Math.round(
                        data.score /
                        data.total
                    );


                return `

                    <div class="topic-row">

                        <div class="topic-row-header">

                            <span>
                                ${getTopicEmoji(topic)}
                                ${escapeHTML(topic)}
                            </span>

                            <span>
                                ${average}%
                            </span>

                        </div>

                        <div class="topic-bar">

                            <div
                                class="topic-bar-fill"
                                style="width:${average}%"
                            ></div>

                        </div>

                    </div>

                `;

            }
        )
        .join("");


    container.innerHTML =
        rows;

}


/* =====================================================
   TEST HISTORY
===================================================== */

function renderTestHistory(
    student
) {

    const container =
        document.getElementById(
            "testHistory"
        );


    const tests =
        student.tests || [];


    if (tests.length === 0) {

        container.innerHTML = `

            <div class="empty-state">
                No test history yet.
            </div>

        `;

        return;

    }


    container.innerHTML =
        tests
            .slice()
            .reverse()
            .map(
                test => {

                    const score =
                        Number(
                            test.percentage
                        ) || 0;


                    return `

                        <div class="history-item">

                            <div class="history-main">

                                <strong>
                                    ${getTopicEmoji(
                                        test.topic
                                    )}
                                    ${escapeHTML(
                                        test.topic
                                    )}
                                </strong>

                                <small>
                                    Grade ${test.grade}
                                    •
                                    ${test.correct}/${test.totalQuestions}
                                    correct
                                    •
                                    ${formatDate(
                                        test.date
                                    )}
                                </small>

                            </div>

                            <div
                                class="history-score"
                                style="
                                    color:${getScoreColor(score)}
                                "
                            >
                                ${score}%
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   PRACTICE SETUP
===================================================== */

function setGradeFromProfile() {

    const student =
        getCurrentStudent();

    if (!student) {

        return;

    }


    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );


    if (gradeSelect) {

        gradeSelect.value =
            String(
                student.grade
            );

    }

}


/* =====================================================
   TOPIC BUTTONS
===================================================== */

function setupTopicButtons() {

    document
        .querySelectorAll(
            ".topic-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".topic-btn"
                            )
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "selected"
                                    )
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

    const student = getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    const grade =
        parseInt(
            document.getElementById("gradeSelect").value
        );

    const count =
        parseInt(
            document.getElementById("questionCount").value
        );

    const minutes =
        parseInt(
            document.getElementById("timeLimit").value
        );

    const answerType =
        document.getElementById("answerType").value;

    questions = [];
    answers = [];
    currentQuestion = 0;

    currentTestStart = new Date();

    for (let i = 0; i < count; i++) {

        questions.push(
            generateQuestion(
                grade,
                selectedTopic,
                answerType
            )
        );

    }

    hideAllScreens();

    document
        .getElementById("testScreen")
        .classList.remove("hidden");

    if (minutes > 0) {

        remainingSeconds = minutes * 60;

        startTimer();

    } else {

        clearInterval(testTimer);

        document
            .getElementById("timer")
            .textContent = "⏱ No Timer";
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

    let actualTopic =
        topic;


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
            Math.random() < 0.5
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
            ${escapeHTML(q.type)}
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
            option => {

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
                        onclick="selectAnswer(
                            this,
                            '${escapeString(option)}'
                        )"
                    >
                        ${escapeHTML(option)}
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
   SELECT ANSWER
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
            btn =>
                btn.classList.remove(
                    "selected"
                )
        );


    button.classList.add(
        "selected"
    );


    answers[
        currentQuestion
    ] =
        value;

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


    if (
        !questions.length
    ) {

        return;

    }


    let correct = 0;


    questions.forEach(
        (q, index) => {

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


    const student =
        getCurrentStudent();


    if (!student) {

        showLogin();

        return;

    }


    const grade =
        parseInt(
            document
                .getElementById(
                    "gradeSelect"
                )
                .value
        );


    const topicName =
        getTestTopicName();


    const testRecord = {

        id:
            Date.now().toString(),

        date:
            new Date().toISOString(),

        grade:
            grade,

        topic:
            topicName,

        correct:
            correct,

        totalQuestions:
            questions.length,

        percentage:
            percentage

    };


    saveTestResult(
        student.name,
        testRecord
    );


    hideAllScreens();


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


    document
        .getElementById(
            "resultBadge"
        )
        .textContent =
            getAchievement(
                percentage
            );


    createReview();

}


/* =====================================================
   SAVE TEST RESULT
===================================================== */

function saveTestResult(
    studentName,
    testRecord
) {

    const students =
        getStudents();


    const index =
        students.findIndex(
            student =>
                student.name.toLowerCase() ===
                studentName.toLowerCase()
        );


    if (index === -1) {

        return;

    }


    if (
        !Array.isArray(
            students[index].tests
        )
    ) {

        students[index].tests =
            [];

    }


    students[index].tests.push(
        testRecord
    );


    saveStudents(
        students
    );

}


/* =====================================================
   TEST TOPIC NAME
===================================================== */

function getTestTopicName() {

    if (
        selectedTopic === "mixed"
    ) {

        return "Mixed Practice";

    }


    const names = {

        addition:
            "Addition",

        subtraction:
            "Subtraction",

        multiplication:
            "Multiplication",

        division:
            "Division",

        fractions:
            "Fractions",

        decimals:
            "Decimals",

        word:
            "Word Problems",

        time:
            "Time",

        comparison:
            "Compare Numbers"

    };


    return (
        names[
            selectedTopic
        ] ||
        selectedTopic
    );

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
        String(
            userAnswer
        ).trim() === ""
    ) {

        return false;

    }


    const user =
        String(
            userAnswer
        )
            .trim()
            .toLowerCase();


    const correct =
        String(
            correctAnswer
        )
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


    container.innerHTML =
        "";


    questions.forEach(
        (q, index) => {

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
                    ${q.question}

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

        answer:
            answer,

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

        answer:
            answer,

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

        answer:
            answer,

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

        answer:
            answer,

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
            numerator /
            denominator
        ) +
        (
            n2 /
            d2
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

        answer:
            answer,

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

        answer:
            answer,

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
            `in each box. How many toys are there ` +
            `altogether?`;

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

        question:
            question,

        answer:
            answer,

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

        answer:
            answer,

        hour:
            hour,

        minute:
            minute,

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
        String(
            minute
        ).padStart(
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


    let numbers =
        "";


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


    const options = [
        correct
    ];


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


    const options = [
        numeric
    ];


    let safety = 0;


    while (
        options.length < 4 &&
        safety < 100
    ) {

        safety++;


        let difference;


        if (
            Math.abs(
                numeric
            ) < 10
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

        type:
            "Compare Numbers",

        question:
            `${a} &nbsp; ___ &nbsp; ${b}`,

        answer:
            answer,

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
        () =>
            Math.random() - .5
    );

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
        (
            max - min + 1
        )
    ) + min;

}


/* =====================================================
   ACHIEVEMENT
===================================================== */

function getAchievement(
    percentage
) {

    if (
        percentage === 100
    ) {

        return "🏆 Perfect Score!";

    }

    if (
        percentage >= 90
    ) {

        return "🌟 Math Superstar!";

    }

    if (
        percentage >= 80
    ) {

        return "🥇 Excellent Work!";

    }

    if (
        percentage >= 70
    ) {

        return "🥈 Great Progress!";

    }

    if (
        percentage >= 60
    ) {

        return "🥉 Keep Going!";

    }

    return "💪 Practice Makes Progress!";

}


/* =====================================================
   TOPIC EMOJI
===================================================== */

function getTopicEmoji(
    topic
) {

    const emojis = {

        "Mixed Practice":
            "🧩",

        "Addition":
            "➕",

        "Subtraction":
            "➖",

        "Multiplication":
            "✖️",

        "Division":
            "➗",

        "Fractions":
            "🍕",

        "Decimals":
            "🔢",

        "Word Problems":
            "📖",

        "Time":
            "🕐",

        "Compare Numbers":
            "⚖️"

    };


    return (
        emojis[topic] ||
        "📚"
    );

}


/* =====================================================
   SCORE COLOR
===================================================== */

function getScoreColor(
    score
) {

    if (
        score >= 90
    ) {

        return "#10b981";

    }

    if (
        score >= 70
    ) {

        return "#4f8cff";

    }

    if (
        score >= 50
    ) {

        return "#f59e0b";

    }

    return "#ef4444";

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value
    )
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
   STRING ESCAPE FOR BUTTONS
===================================================== */

function escapeString(
    value
) {

    return String(
        value
    )
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
   LOGIN ERROR
===================================================== */

function showLoginError(
    message
) {

    const error =
        document.getElementById(
            "loginError"
        );


    error.textContent =
        message;


    error.classList.remove(
        "hidden"
    );

}


function clearLoginError() {

    const error =
        document.getElementById(
            "loginError"
        );


    if (error) {

        error.textContent =
            "";

        error.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   PROFILE ERROR
===================================================== */

function showProfileError(
    message
) {

    const error =
        document.getElementById(
            "profileError"
        );


    error.textContent =
        message;


    error.classList.remove(
        "hidden"
    );

}


function clearProfileError() {

    const error =
        document.getElementById(
            "profileError"
        );


    if (error) {

        error.textContent =
            "";

        error.classList.add(
            "hidden"
        );

    }

}

// =====================================================
// FIREBASE IMPORTS
// =====================================================

import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "./firebase.js";


// =====================================================
// STUDENT VARIABLES
// =====================================================

let currentStudent = null;

let selectedAvatar = "👧";


// =====================================================
// AUTH ELEMENTS
// =====================================================

const loginScreen =
    document.getElementById("loginScreen");

const registerScreen =
    document.getElementById("registerScreen");

const dashboardScreen =
    document.getElementById("dashboardScreen");

const setupScreen =
    document.getElementById("setupScreen");


// =====================================================
// SHOW LOGIN
// =====================================================

function showLoginScreen() {

    loginScreen.classList.remove("hidden");

    registerScreen.classList.add("hidden");

    dashboardScreen.classList.add("hidden");

    setupScreen.classList.add("hidden");

    document
        .getElementById("testScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.add("hidden");
}


// =====================================================
// SHOW REGISTER
// =====================================================

function showRegisterScreen() {

    loginScreen.classList.add("hidden");

    registerScreen.classList.remove("hidden");

    dashboardScreen.classList.add("hidden");

    setupScreen.classList.add("hidden");
}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard() {

    loginScreen.classList.add("hidden");

    registerScreen.classList.add("hidden");

    dashboardScreen.classList.remove("hidden");

    setupScreen.classList.add("hidden");

    document
        .getElementById("testScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.add("hidden");

    loadStudentDashboard();
}


// =====================================================
// SHOW PRACTICE SETUP
// =====================================================

function showPracticeSetup() {

    dashboardScreen.classList.add("hidden");

    setupScreen.classList.remove("hidden");

    document
        .getElementById("testScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.add("hidden");


    if (currentStudent) {

        document
            .getElementById("gradeSelect")
            .value = currentStudent.grade;

    }

}


// =====================================================
// CREATE INTERNAL FIREBASE EMAIL
// =====================================================

function createStudentEmail(name) {

    return (
        name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
        + "@mathadventure.app"
    );

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(elementId, message) {

    const element =
        document.getElementById(elementId);

    element.textContent = message;

    element.classList.remove("hidden");

}


// =====================================================
// CLEAR ERROR
// =====================================================

function clearError(elementId) {

    const element =
        document.getElementById(elementId);

    element.textContent = "";

    element.classList.add("hidden");

}


// =====================================================
// AVATAR SELECTION
// =====================================================

document
    .querySelectorAll(".avatar-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".avatar-btn")
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                selectedAvatar =
                    this.dataset.avatar;

            }
        );

    });


// =====================================================
// SHOW REGISTER BUTTON
// =====================================================

document
    .getElementById("showRegisterButton")
    .addEventListener(
        "click",
        showRegisterScreen
    );


// =====================================================
// BACK TO LOGIN
// =====================================================

document
    .getElementById("backToLoginButton")
    .addEventListener(
        "click",
        showLoginScreen
    );


// =====================================================
// CREATE STUDENT
// =====================================================

document
    .getElementById("registerButton")
    .addEventListener(
        "click",
        createStudent
    );


async function createStudent() {

    clearError("registerError");


    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const grade =
        parseInt(
            document
                .getElementById("registerGrade")
                .value
        );


    const pin =
        document
            .getElementById("registerPin")
            .value
            .trim();


    const confirmPin =
        document
            .getElementById("registerPinConfirm")
            .value
            .trim();


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name) {

        showError(
            "registerError",
            "Please enter the student's name."
        );

        return;

    }


    if (name.length < 2) {

        showError(
            "registerError",
            "Student name must be at least 2 characters."
        );

        return;

    }


    if (!/^\d{6}$/.test(pin)) {

        showError(
            "registerError",
            "PIN must contain exactly 6 numbers."
        );

        return;

    }


    if (pin !== confirmPin) {

        showError(
            "registerError",
            "The PINs do not match."
        );

        return;

    }


    const email =
        createStudentEmail(name);


    const button =
        document.getElementById(
            "registerButton"
        );


    button.disabled = true;

    button.textContent =
        "⏳ Creating Profile...";


    try {

        // -------------------------------------------------
        // CREATE FIREBASE AUTH USER
        // -------------------------------------------------

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            userCredential.user;


        // -------------------------------------------------
        // CREATE FIRESTORE PROFILE
        // -------------------------------------------------

        const profile = {

            name: name,

            grade: grade,

            avatar: selectedAvatar,

            email: email,

            createdAt: serverTimestamp(),

            statistics: {

                tests: 0,

                correct: 0,

                questions: 0,

                accuracy: 0

            },

            topics: {

                addition: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                subtraction: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                multiplication: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                division: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                }

            }

        };


        await setDoc(
            doc(
                db,
                "students",
                user.uid
            ),
            profile
        );


        currentStudent = {

            uid: user.uid,

            ...profile

        };


        // -------------------------------------------------
        // OPEN DASHBOARD
        // -------------------------------------------------

        showDashboard();


    }
    catch (error) {

        console.error(
            "Create student error:",
            error
        );


        let message =
            "Unable to create profile.";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            message =
                "A student with this name already exists. Please use Login.";

        }


        else if (
            error.code ===
            "auth/weak-password"
        ) {

            message =
                "Please use a 6-digit PIN.";

        }


        showError(
            "registerError",
            message
        );

    }


    finally {

        button.disabled = false;

        button.textContent =
            "🚀 Create My Profile";

    }

}


// =====================================================
// LOGIN
// =====================================================

document
    .getElementById("loginButton")
    .addEventListener(
        "click",
        loginStudent
    );


async function loginStudent() {

    clearError("loginError");


    const name =
        document
            .getElementById("loginName")
            .value
            .trim();


    const pin =
        document
            .getElementById("loginPin")
            .value
            .trim();


    if (!name) {

        showError(
            "loginError",
            "Please enter your name."
        );

        return;

    }


    if (!/^\d{6}$/.test(pin)) {

        showError(
            "loginError",
            "Please enter your 6-digit PIN."
        );

        return;

    }


    const email =
        createStudentEmail(name);


    const button =
        document.getElementById(
            "loginButton"
        );


    button.disabled = true;

    button.textContent =
        "⏳ Logging in...";


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            pin
        );


    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );


        showError(
            "loginError",
            "Incorrect student name or PIN."
        );

    }


    finally {

        button.disabled = false;

        button.textContent =
            "🔐 Login";

    }

}


// =====================================================
// FIREBASE AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            currentStudent = null;

            showLoginScreen();

            return;

        }


        try {

            const profileSnapshot =
                await getDoc(
                    doc(
                        db,
                        "students",
                        user.uid
                    )
                );


            if (
                profileSnapshot.exists()
            ) {

                currentStudent = {

                    uid: user.uid,

                    ...profileSnapshot.data()

                };


                showDashboard();

            }
            else {

                await signOut(auth);

                showLoginScreen();

            }

        }
        catch (error) {

            console.error(
                "Loading student profile:",
                error
            );

            showError(
                "loginError",
                "Unable to load your profile."
            );

        }

    }
);


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadStudentDashboard() {

    if (!auth.currentUser) {
        return;
    }


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "students",
                    auth.currentUser.uid
                )
            );


        if (!snapshot.exists()) {

            return;

        }


        currentStudent = {

            uid: auth.currentUser.uid,

            ...snapshot.data()

        };


        const student =
            currentStudent;


        // -------------------------------------------------
        // PROFILE
        // -------------------------------------------------

        document
            .getElementById("dashboardName")
            .textContent =
            student.name;


        document
            .getElementById("profileName")
            .textContent =
            student.name;


        document
            .getElementById("dashboardAvatar")
            .textContent =
            student.avatar || "👧";


        document
            .getElementById("profileGrade")
            .textContent =
            "Grade " + student.grade;


        // -------------------------------------------------
        // STATISTICS
        // -------------------------------------------------

        const stats =
            student.statistics || {};


        const tests =
            stats.tests || 0;


        const correct =
            stats.correct || 0;


        const questions =
            stats.questions || 0;


        const accuracy =
            questions > 0
                ? Math.round(
                    correct /
                    questions *
                    100
                )
                : 0;


        document
            .getElementById("statTests")
            .textContent =
            tests;


        document
            .getElementById("statCorrect")
            .textContent =
            correct;


        document
            .getElementById("statAccuracy")
            .textContent =
            accuracy + "%";


        document
            .getElementById("overallProgressText")
            .textContent =
            accuracy + "%";


        document
            .getElementById("overallProgressBar")
            .style.width =
            accuracy + "%";


        // -------------------------------------------------
        // TOPICS
        // -------------------------------------------------

        const topics =
            student.topics || {};


        updateTopicProgress(
            "addition",
            topics.addition
        );


        updateTopicProgress(
            "subtraction",
            topics.subtraction
        );


        updateTopicProgress(
            "multiplication",
            topics.multiplication
        );


        updateTopicProgress(
            "division",
            topics.division
        );


    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// =====================================================
// UPDATE TOPIC PROGRESS
// =====================================================

function updateTopicProgress(
    topic,
    data
) {

    const questions =
        data?.questions || 0;


    const correct =
        data?.correct || 0;


    const percentage =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;


    const bar =
        document.getElementById(
            topic + "Progress"
        );


    const label =
        document.getElementById(
            topic + "Percent"
        );


    if (bar) {

        bar.style.width =
            percentage + "%";

    }


    if (label) {

        label.textContent =
            percentage + "%";

    }

}


// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                currentStudent = null;

                showLoginScreen();

            }
            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );


// =====================================================
// START PRACTICE
// =====================================================

document
    .getElementById("startPracticeButton")
    .addEventListener(
        "click",
        showPracticeSetup
    );


// =====================================================
// BACK TO DASHBOARD
// =====================================================

document
    .getElementById("backDashboardButton")
    .addEventListener(
        "click",
        showDashboard
    );


document
    .getElementById("resultDashboardButton")
    .addEventListener(
        "click",
        showDashboard
    );


// =====================================================
// PROFILE BUTTON
// =====================================================

document
    .getElementById("profileButton")
    .addEventListener(
        "click",
        function () {

            if (!currentStudent) {
                return;
            }


            document
                .getElementById("registerName")
                .value =
                currentStudent.name;


            document
                .getElementById("registerGrade")
                .value =
                currentStudent.grade;


            showRegisterScreen();

        }
    );

// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML onclick EVENTS
// =====================================================

window.showCreateProfile = showCreateProfile;
window.showLogin = showLogin;
window.loginStudent = loginStudent;
window.createStudentProfile = createStudentProfile;
window.selectAvatar = selectAvatar;
window.logoutStudent = logoutStudent;
window.showDashboard = showDashboard;
window.showProgress = showProgress;
window.showProfile = showProfile;
window.startTest = startTest;
