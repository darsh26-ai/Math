// =====================================================
// MATH ADVENTURE
// Firebase Authentication + Firestore
// Grades 1–7 Math Practice
// =====================================================

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
// GLOBAL VARIABLES
// =====================================================

let currentStudent = null;

let selectedTopic = "mixed";

let selectedAvatar = "🧑‍🚀";

let questions = [];

let answers = [];

let currentQuestion = 0;

let testTimer = null;

let remainingSeconds = 0;

let currentTestStart = null;


// =====================================================
// INITIALIZE APP
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    setupTopicButtons();

    setupEnterKeyHandlers();

    setupFirebaseAuth();

    console.log("Math Adventure loaded successfully.");

});


// =====================================================
// FIREBASE AUTH STATE
// =====================================================

function setupFirebaseAuth() {

    onAuthStateChanged(
        auth,
        async (user) => {

            if (!user) {

                currentStudent = null;

                showLogin();

                return;
            }

            try {

                await loadCurrentStudent(user.uid);

                if (currentStudent) {

                    showDashboard();

                }
                else {

                    await signOut(auth);

                    showLogin();

                }

            }
            catch (error) {

                console.error(
                    "Authentication state error:",
                    error
                );

                currentStudent = null;

                showLogin();

                showLoginError(
                    "Unable to load your student profile."
                );

            }

        }
    );

}


// =====================================================
// LOAD CURRENT STUDENT
// =====================================================

async function loadCurrentStudent(uid) {

    const studentRef =
        doc(
            db,
            "students",
            uid
        );

    const snapshot =
        await getDoc(
            studentRef
        );

    if (!snapshot.exists()) {

        currentStudent = null;

        return null;
    }

    currentStudent = {

        uid: uid,

        ...snapshot.data()

    };

    return currentStudent;

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
// SCREEN MANAGEMENT
// =====================================================

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

    screens.forEach((id) => {

        const element =
            document.getElementById(id);

        if (element) {

            element.classList.add("hidden");

        }

    });

}


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    clearInterval(testTimer);

    hideAllScreens();

    const screen =
        document.getElementById(
            "loginScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    updateHeader();

    clearLoginError();

}


// =====================================================
// SHOW CREATE PROFILE
// =====================================================

function showCreateProfile() {

    hideAllScreens();

    const screen =
        document.getElementById(
            "profileScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    clearProfileError();

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard() {

    if (!currentStudent) {

        showLogin();

        return;

    }

    clearInterval(testTimer);

    hideAllScreens();

    const screen =
        document.getElementById(
            "dashboardScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    updateHeader();

    updateDashboard();

    loadStudentDashboard();

}


// =====================================================
// SHOW PRACTICE SETUP
// =====================================================

function showPracticeSetup() {

    if (!currentStudent) {

        showLogin();

        return;

    }

    clearInterval(testTimer);

    hideAllScreens();

    const screen =
        document.getElementById(
            "setupScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    setGradeFromProfile();

}


// =====================================================
// SHOW PROFILE
// =====================================================

function showProfile() {

    if (!currentStudent) {

        showLogin();

        return;

    }

    hideAllScreens();

    const screen =
        document.getElementById(
            "profileViewScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    updateProfileScreen();

}


// =====================================================
// SHOW PROGRESS
// =====================================================

function showProgress() {

    if (!currentStudent) {

        showLogin();

        return;

    }

    hideAllScreens();

    const screen =
        document.getElementById(
            "progressScreen"
        );

    if (screen) {

        screen.classList.remove("hidden");

    }

    updateProgressScreen();

}


// =====================================================
// HEADER
// =====================================================

function updateHeader() {

    const headerStudent =
        document.getElementById(
            "headerStudent"
        );

    if (!headerStudent) {

        return;

    }

    if (!currentStudent) {

        headerStudent.classList.add(
            "hidden"
        );

        return;

    }

    headerStudent.classList.remove(
        "hidden"
    );

    const avatar =
        document.getElementById(
            "headerAvatar"
        );

    const name =
        document.getElementById(
            "headerStudentName"
        );

    if (avatar) {

        avatar.textContent =
            currentStudent.avatar ||
            "🧑‍🚀";

    }

    if (name) {

        name.textContent =
            currentStudent.name ||
            "Student";

    }

}


// =====================================================
// CREATE STUDENT PROFILE
// =====================================================

async function createStudentProfile() {

    clearProfileError();

    const nameInput =
        document.getElementById(
            "profileName"
        );

    const pinInput =
        document.getElementById(
            "profilePin"
        );

    const gradeInput =
        document.getElementById(
            "profileGrade"
        );

    if (
        !nameInput ||
        !pinInput ||
        !gradeInput
    ) {

        return;

    }

    const name =
        nameInput.value.trim();

    const pin =
        pinInput.value.trim();

    const grade =
        parseInt(
            gradeInput.value,
            10
        );

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!name) {

        showProfileError(
            "Please enter the student's name."
        );

        return;

    }

    if (name.length < 2) {

        showProfileError(
            "Student name must be at least 2 characters."
        );

        return;

    }

    if (!/^\d{6}$/.test(pin)) {

        showProfileError(
            "PIN must contain exactly 6 digits."
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

    const email =
        createStudentEmail(name);

    const button =
        document.getElementById(
            "createProfileButton"
        ) ||
        document.querySelector(
            '#profileScreen .main-btn'
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            "⏳ Creating Profile...";

    }

    try {

        // -------------------------------------------------
        // CREATE FIREBASE AUTH ACCOUNT
        // -------------------------------------------------

        const credential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                pin
            );

        const user =
            credential.user;

        // -------------------------------------------------
        // FIRESTORE PROFILE
        // -------------------------------------------------

        const profile = {

            name: name,

            grade: grade,

            avatar: selectedAvatar,

            email: email,

            createdAt:
                serverTimestamp(),

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
                },

                fractions: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                decimals: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                word: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                time: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                },

                comparison: {
                    correct: 0,
                    questions: 0,
                    accuracy: 0
                }

            },

            testsHistory: []

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
        // CLEAR FORM
        // -------------------------------------------------

        nameInput.value = "";

        pinInput.value = "";

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
            "auth/invalid-email"
        ) {

            message =
                "That student name cannot be used. Please choose another name.";

        }
        else if (
            error.code ===
            "auth/weak-password"
        ) {

            message =
                "PIN must contain exactly 6 digits.";

        }

        showProfileError(
            message
        );

    }
    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🎉 Create My Profile";

        }

    }

}


// =====================================================
// LOGIN
// =====================================================

async function loginStudent() {

    clearLoginError();

    const nameInput =
        document.getElementById(
            "loginStudentName"
        );

    const pinInput =
        document.getElementById(
            "loginPin"
        );

    if (
        !nameInput ||
        !pinInput
    ) {

        return;

    }

    const name =
        nameInput.value.trim();

    const pin =
        pinInput.value.trim();

    if (!name) {

        showLoginError(
            "Please enter the student's name."
        );

        return;

    }

    if (!/^\d{6}$/.test(pin)) {

        showLoginError(
            "Please enter your 6-digit PIN."
        );

        return;

    }

    const email =
        createStudentEmail(name);

    const button =
        document.querySelector(
            '#loginScreen .main-btn'
        );

    if (button) {

        button.disabled = true;

        button.textContent =
            "⏳ Logging in...";

    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            pin
        );

        // onAuthStateChanged()
        // will load the profile.

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );

        showLoginError(
            "Incorrect student name or PIN."
        );

    }
    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🚀 Login";

        }

    }

}


// =====================================================
// LOGOUT
// =====================================================

async function logoutStudent() {

    clearInterval(testTimer);

    try {

        await signOut(auth);

        currentStudent = null;

        questions = [];

        answers = [];

        currentQuestion = 0;

        showLogin();

    }
    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


// =====================================================
// AVATAR SELECTION
// =====================================================

function selectAvatar(button) {

    if (!button) {

        return;

    }

    document
        .querySelectorAll(
            ".avatar-btn"
        )
        .forEach(
            (btn) => {

                btn.classList.remove(
                    "selected"
                );

            }
        );

    button.classList.add(
        "selected"
    );

    selectedAvatar =
        button.dataset.avatar ||
        "🧑‍🚀";

}


// =====================================================
// TOPIC BUTTONS
// =====================================================

function setupTopicButtons() {

    document
        .querySelectorAll(
            ".topic-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".topic-btn"
                            )
                            .forEach(
                                (btn) => {

                                    btn.classList.remove(
                                        "selected"
                                    );

                                }
                            );

                        button.classList.add(
                            "selected"
                        );

                        selectedTopic =
                            button.dataset.topic ||
                            "mixed";

                    }
                );

            }
        );

}


// =====================================================
// ENTER KEY HANDLERS
// =====================================================

function setupEnterKeyHandlers() {

    const loginPin =
        document.getElementById(
            "loginPin"
        );

    if (loginPin) {

        loginPin.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    loginStudent();

                }

            }
        );

    }

    const profilePin =
        document.getElementById(
            "profilePin"
        );

    if (profilePin) {

        profilePin.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    createStudentProfile();

                }

            }
        );

    }

}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    if (!currentStudent) {

        return;

    }

    const stats =
        calculateStudentStats(
            currentStudent
        );

    setText(
        "dashboardAvatar",
        currentStudent.avatar ||
        "🧑‍🚀"
    );

    setText(
        "dashboardName",
        currentStudent.name ||
        "Student"
    );

    setText(
        "dashboardGrade",
        "Grade " +
        currentStudent.grade
    );

    setText(
        "testsCompleted",
        stats.tests
    );

    setText(
        "averageScore",
        stats.average + "%"
    );

    setText(
        "bestScore",
        stats.best + "%"
    );

    setText(
        "questionsAnswered",
        stats.questions
    );

    renderRecentTests(
        currentStudent
    );

}


// =====================================================
// LOAD DASHBOARD FROM FIRESTORE
// =====================================================

async function loadStudentDashboard() {

    if (!auth.currentUser) {

        return;

    }

    try {

        await loadCurrentStudent(
            auth.currentUser.uid
        );

        if (!currentStudent) {

            return;

        }

        updateHeader();

        updateDashboard();

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// =====================================================
// CALCULATE STUDENT STATS
// =====================================================

function calculateStudentStats(student) {

    const history =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];

    if (history.length > 0) {

        const scores =
            history.map(
                (test) =>
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
                total /
                scores.length
            );

        const best =
            Math.max(
                ...scores
            );

        const questions =
            history.reduce(
                (sum, test) =>
                    sum +
                    (
                        Number(
                            test.totalQuestions
                        ) || 0
                    ),
                0
            );

        return {

            tests:
                history.length,

            average:
                average,

            best:
                best,

            questions:
                questions

        };

    }

    const stats =
        student.statistics || {};

    const questions =
        Number(
            stats.questions
        ) || 0;

    const correct =
        Number(
            stats.correct
        ) || 0;

    const accuracy =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;

    return {

        tests:
            Number(
                stats.tests
            ) || 0,

        average:
            accuracy,

        best:
            accuracy,

        questions:
            questions

    };

}


// =====================================================
// RECENT TESTS
// =====================================================

function renderRecentTests(student) {

    const container =
        document.getElementById(
            "recentTests"
        );

    if (!container) {

        return;

    }

    const tests =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];

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
                (test) => `

                    <div class="recent-test">

                        <div class="recent-test-left">

                            <strong>
                                ${getTopicEmoji(
                                    test.topic
                                )}
                                ${escapeHTML(
                                    test.topic ||
                                    "Math Practice"
                                )}
                            </strong>

                            <small>
                                Grade ${escapeHTML(
                                    test.grade
                                )}
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
                            class="test-score"
                            style="
                                color:${getScoreColor(
                                    Number(
                                        test.percentage
                                    ) || 0
                                )}
                            "
                        >
                            ${Number(
                                test.percentage
                            ) || 0}%
                        </div>

                    </div>

                `
            )
            .join("");

}


// =====================================================
// PROFILE SCREEN
// =====================================================

function updateProfileScreen() {

    if (!currentStudent) {

        return;

    }

    const stats =
        calculateStudentStats(
            currentStudent
        );

    setText(
        "profileViewAvatar",
        currentStudent.avatar ||
        "🧑‍🚀"
    );

    setText(
        "profileViewName",
        currentStudent.name ||
        "Student"
    );

    setText(
        "profileViewGrade",
        "Grade " +
        currentStudent.grade
    );

    setText(
        "profileTests",
        stats.tests
    );

    setText(
        "profileAverage",
        stats.average + "%"
    );

    setText(
        "profileBest",
        stats.best + "%"
    );

}


// =====================================================
// PROGRESS SCREEN
// =====================================================

function updateProgressScreen() {

    if (!currentStudent) {

        return;

    }

    const stats =
        calculateStudentStats(
            currentStudent
        );

    setText(
        "progressAvatar",
        currentStudent.avatar ||
        "🧑‍🚀"
    );

    setText(
        "progressOverall",
        stats.average + "%"
    );

    const progressBar =
        document.getElementById(
            "overallProgressBar"
        );

    if (progressBar) {

        progressBar.style.width =
            Math.min(
                100,
                Math.max(
                    0,
                    stats.average
                )
            ) + "%";

    }

    renderTopicPerformance(
        currentStudent
    );

    renderTestHistory(
        currentStudent
    );

}


// =====================================================
// TOPIC PERFORMANCE
// =====================================================

function renderTopicPerformance(student) {

    const container =
        document.getElementById(
            "topicPerformance"
        );

    if (!container) {

        return;

    }

    const tests =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];

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
        (test) => {

            const topic =
                test.topic ||
                "Mixed Practice";

            if (!topicData[topic]) {

                topicData[topic] = {

                    total: 0,

                    score: 0

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
                                ${getTopicEmoji(
                                    topic
                                )}
                                ${escapeHTML(
                                    topic
                                )}
                            </span>

                            <span>
                                ${average}%
                            </span>

                        </div>

                        <div class="topic-bar">

                            <div
                                class="topic-bar-fill"
                                style="
                                    width:${average}%
                                "
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


// =====================================================
// TEST HISTORY
// =====================================================

function renderTestHistory(student) {

    const container =
        document.getElementById(
            "testHistory"
        );

    if (!container) {

        return;

    }

    const tests =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];

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
                (test) => {

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
                                        test.topic ||
                                        "Math Practice"
                                    )}

                                </strong>

                                <small>

                                    Grade ${escapeHTML(
                                        test.grade
                                    )}

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
                                    color:${getScoreColor(
                                        score
                                    )}
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


// =====================================================
// SET GRADE FROM PROFILE
// =====================================================

function setGradeFromProfile() {

    if (!currentStudent) {

        return;

    }

    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );

    if (gradeSelect) {

        gradeSelect.value =
            String(
                currentStudent.grade
            );

    }

}


// =====================================================
// START TEST
// =====================================================

function startTest() {

    if (!currentStudent) {

        showLogin();

        return;

    }

    const gradeElement =
        document.getElementById(
            "gradeSelect"
        );

    const countElement =
        document.getElementById(
            "questionCount"
        );

    const timeElement =
        document.getElementById(
            "timeLimit"
        );

    const answerTypeElement =
        document.getElementById(
            "answerType"
        );

    if (
        !gradeElement ||
        !countElement ||
        !timeElement ||
        !answerTypeElement
    ) {

        return;

    }

    const grade =
        parseInt(
            gradeElement.value,
            10
        );

    const count =
        parseInt(
            countElement.value,
            10
        );

    const minutes =
        parseInt(
            timeElement.value,
            10
        );

    const answerType =
        answerTypeElement.value;

    questions = [];

    answers = [];

    currentQuestion = 0;

    currentTestStart =
        new Date();

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

    hideAllScreens();

    const testScreen =
        document.getElementById(
            "testScreen"
        );

    if (testScreen) {

        testScreen.classList.remove(
            "hidden"
        );

    }

    if (minutes > 0) {

        remainingSeconds =
            minutes * 60;

        startTimer();

    }
    else {

        clearInterval(
            testTimer
        );

        remainingSeconds = 0;

        const timer =
            document.getElementById(
                "timer"
            );

        if (timer) {

            timer.textContent =
                "⏱ No Timer";

            timer.classList.remove(
                "warning"
            );

        }

    }

    showQuestion();

}


// =====================================================
// TIMER
// =====================================================

function startTimer() {

    clearInterval(
        testTimer
    );

    updateTimerDisplay();

    testTimer =
        setInterval(
            () => {

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


// =====================================================
// UPDATE TIMER
// =====================================================

function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "timer"
        );

    if (!timer) {

        return;

    }

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


// =====================================================
// GENERATE QUESTION
// =====================================================

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

            actualTopic =
                "addition";

    }

    question.topicKey =
        actualTopic;

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


// =====================================================
// SHOW QUESTION
// =====================================================

function showQuestion() {

    const q =
        questions[
            currentQuestion
        ];

    if (!q) {

        return;

    }

    const progressText =
        document.getElementById(
            "progressText"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    if (progressText) {

        progressText.textContent =
            "Question " +
            (currentQuestion + 1) +
            " of " +
            questions.length;

    }

    if (progressBar) {

        progressBar.style.width =
            (
                (
                    currentQuestion + 1
                ) /
                questions.length *
                100
            ) + "%";

    }

    const container =
        document.getElementById(
            "questionContainer"
        );

    if (!container) {

        return;

    }

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
            (option) => {

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
                        type="button"
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
            () => {

                answers[
                    currentQuestion
                ] =
                    input.value;

            }
        );

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    nextQuestion();

                }

            }
        );

    }

}


// =====================================================
// SELECT MULTIPLE CHOICE ANSWER
// =====================================================

function selectAnswer(
    button,
    value
) {

    document
        .querySelectorAll(
            ".answer-btn"
        )
        .forEach(
            (btn) => {

                btn.classList.remove(
                    "selected"
                );

            }
        );

    if (button) {

        button.classList.add(
            "selected"
        );

    }

    answers[
        currentQuestion
    ] =
        value;

}


// =====================================================
// SAVE TEXT ANSWER
// =====================================================

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


// =====================================================
// NEXT QUESTION
// =====================================================

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


// =====================================================
// PREVIOUS QUESTION
// =====================================================

function previousQuestion() {

    saveTextAnswer();

    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        showQuestion();

    }

}


// =====================================================
// FINISH TEST
// =====================================================

async function finishTest() {

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

    const gradeElement =
        document.getElementById(
            "gradeSelect"
        );

    const grade =
        gradeElement
            ? parseInt(
                gradeElement.value,
                10
            )
            : currentStudent.grade;

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

        topicKey:
            selectedTopic,

        correct:
            correct,

        totalQuestions:
            questions.length,

        percentage:
            percentage

    };

    try {

        await saveTestResult(
            testRecord
        );

    }
    catch (error) {

        console.error(
            "Unable to save test:",
            error
        );

    }

    hideAllScreens();

    const resultScreen =
        document.getElementById(
            "resultScreen"
        );

    if (resultScreen) {

        resultScreen.classList.remove(
            "hidden"
        );

    }

    setText(
        "scorePercent",
        percentage + "%"
    );

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

    setText(
        "resultMessage",
        message
    );

    setText(
        "resultDetails",
        "You got " +
        correct +
        " out of " +
        questions.length +
        " questions correct."
    );

    setText(
        "resultBadge",
        getAchievement(
            percentage
        )
    );

    createReview();

}


// =====================================================
// SAVE TEST RESULT TO FIRESTORE
// =====================================================

async function saveTestResult(
    testRecord
) {

    if (
        !auth.currentUser ||
        !currentStudent
    ) {

        throw new Error(
            "No authenticated student."
        );

    }

    const studentRef =
        doc(
            db,
            "students",
            auth.currentUser.uid
        );

    const snapshot =
        await getDoc(
            studentRef
        );

    if (!snapshot.exists()) {

        throw new Error(
            "Student profile not found."
        );

    }

    const student =
        snapshot.data();

    const oldStats =
        student.statistics || {};

    const oldTopics =
        student.topics || {};

    const oldHistory =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];

    const oldQuestions =
        Number(
            oldStats.questions
        ) || 0;

    const oldCorrect =
        Number(
            oldStats.correct
        ) || 0;

    const newQuestions =
        oldQuestions +
        testRecord.totalQuestions;

    const newCorrect =
        oldCorrect +
        testRecord.correct;

    const newTests =
        (
            Number(
                oldStats.tests
            ) || 0
        ) + 1;

    const newAccuracy =
        newQuestions > 0
            ? Math.round(
                newCorrect /
                newQuestions *
                100
            )
            : 0;

    const topicKey =
        testRecord.topicKey;

    const oldTopic =
        oldTopics[
            topicKey
        ] || {

            correct: 0,

            questions: 0,

            accuracy: 0

        };

    const topicCorrect =
        (
            Number(
                oldTopic.correct
            ) || 0
        ) +
        testRecord.correct;

    const topicQuestions =
        (
            Number(
                oldTopic.questions
            ) || 0
        ) +
        testRecord.totalQuestions;

    const topicAccuracy =
        topicQuestions > 0
            ? Math.round(
                topicCorrect /
                topicQuestions *
                100
            )
            : 0;

    const updatedTopics = {

        ...oldTopics,

        [topicKey]: {

            correct:
                topicCorrect,

            questions:
                topicQuestions,

            accuracy:
                topicAccuracy

        }

    };

    const updatedHistory =
        [
            ...oldHistory,
            testRecord
        ];

    // Keep history manageable.
    const limitedHistory =
        updatedHistory.slice(-100);

    await updateDoc(
        studentRef,
        {

            statistics: {

                tests:
                    newTests,

                correct:
                    newCorrect,

                questions:
                    newQuestions,

                accuracy:
                    newAccuracy

            },

            topics:
                updatedTopics,

            testsHistory:
                limitedHistory,

            updatedAt:
                serverTimestamp()

        }
    );

    currentStudent = {

        uid:
            auth.currentUser.uid,

        ...student,

        statistics: {

            tests:
                newTests,

            correct:
                newCorrect,

            questions:
                newQuestions,

            accuracy:
                newAccuracy

        },

        topics:
            updatedTopics,

        testsHistory:
            limitedHistory

    };

}


// =====================================================
// TEST TOPIC NAME
// =====================================================

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


// =====================================================
// CHECK ANSWER
// =====================================================

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
        !Number.isNaN(
            userNumber
        ) &&
        !Number.isNaN(
            correctNumber
        ) &&
        user !== ""
    ) {

        return (
            Math.abs(
                userNumber -
                correctNumber
            ) < 0.000001
        );

    }

    return (
        user === correct
    );

}


// =====================================================
// CREATE REVIEW
// =====================================================

function createReview() {

    const container =
        document.getElementById(
            "reviewContainer"
        );

    if (!container) {

        return;

    }

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


// =====================================================
// AVAILABLE TOPICS
// =====================================================

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


// =====================================================
// ADDITION
// =====================================================

function additionQuestion(
    grade
) {

    let max;

    if (
        grade === 1
    )
        max = 20;

    else if (
        grade === 2
    )
        max = 100;

    else if (
        grade === 3
    )
        max = 1000;

    else if (
        grade === 4
    )
        max = 10000;

    else if (
        grade === 5
    )
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

        type:
            "Addition",

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


// =====================================================
// SUBTRACTION
// =====================================================

function subtractionQuestion(
    grade
) {

    let max;

    if (
        grade === 1
    )
        max = 20;

    else if (
        grade === 2
    )
        max = 100;

    else if (
        grade === 3
    )
        max = 1000;

    else if (
        grade === 4
    )
        max = 10000;

    else if (
        grade === 5
    )
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

        type:
            "Subtraction",

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


// =====================================================
// MULTIPLICATION
// =====================================================

function multiplicationQuestion(
    grade
) {

    let maxA;

    let maxB;

    if (
        grade === 1
    ) {

        maxA = 5;
        maxB = 5;

    }
    else if (
        grade === 2
    ) {

        maxA = 10;
        maxB = 10;

    }
    else if (
        grade === 3
    ) {

        maxA = 12;
        maxB = 12;

    }
    else if (
        grade === 4
    ) {

        maxA = 20;
        maxB = 20;

    }
    else if (
        grade === 5
    ) {

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

        type:
            "Multiplication",

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


// =====================================================
// DIVISION
// =====================================================

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
        divisor *
        answer;

    return {

        type:
            "Division",

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


// =====================================================
// FRACTIONS
// =====================================================

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

            type:
                "Fractions",

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

        type:
            "Fractions",

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


// =====================================================
// DECIMALS
// =====================================================

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
            (
                a + b
            ) * 100
        ) / 100;

    return {

        type:
            "Decimals",

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


// =====================================================
// WORD PROBLEM
// =====================================================

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

        type:
            "Word Problem",

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


// =====================================================
// TIME
// =====================================================

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

        type:
            "Time",

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


// =====================================================
// FORMAT TIME
// =====================================================

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


// =====================================================
// CLOCK HTML
// =====================================================

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
        minute * 0.5;

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


// =====================================================
// TIME OPTIONS
// =====================================================

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

    let safety = 0;

    while (
        options.length < 4 &&
        safety < 100
    ) {

        safety++;

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


// =====================================================
// NUMBER OPTIONS
// =====================================================

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
                            ) * 0.2
                        )
                    )
                );

        }

        const value =
            numeric +
            (
                Math.random() < 0.5
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


// =====================================================
// COMPARISON
// =====================================================

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


// =====================================================
// SHUFFLE
// =====================================================

function shuffle(array) {

    const copy =
        [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }

    return copy;

}


// =====================================================
// RANDOM INTEGER
// =====================================================

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


// =====================================================
// ACHIEVEMENT
// =====================================================

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


// =====================================================
// TOPIC EMOJI
// =====================================================

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
        emojis[
            topic
        ] ||
        "📚"
    );

}


// =====================================================
// SCORE COLOR
// =====================================================

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


// =====================================================
// DATE FORMAT
// =====================================================

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

            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"

        }
    );

}


// =====================================================
// SET TEXT SAFELY
// =====================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

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


// =====================================================
// STRING ESCAPE FOR BUTTONS
// =====================================================

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


// =====================================================
// LOGIN ERROR
// =====================================================

function showLoginError(
    message
) {

    const error =
        document.getElementById(
            "loginError"
        );

    if (!error) {

        return;

    }

    error.textContent =
        message;

    error.classList.remove(
        "hidden"
    );

}


// =====================================================
// CLEAR LOGIN ERROR
// =====================================================

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


// =====================================================
// PROFILE ERROR
// =====================================================

function showProfileError(
    message
) {

    const error =
        document.getElementById(
            "profileError"
        );

    if (!error) {

        return;

    }

    error.textContent =
        message;

    error.classList.remove(
        "hidden"
    );

}


// =====================================================
// CLEAR PROFILE ERROR
// =====================================================

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
// GLOBAL HTML HANDLERS
// =====================================================
// IMPORTANT:
// app.js is loaded as type="module".
// Inline onclick="" attributes in index.html
// therefore need these functions attached to window.
// =====================================================

window.showCreateProfile =
    showCreateProfile;

window.showLogin =
    showLogin;

window.showDashboard =
    showDashboard;

window.showPracticeSetup =
    showPracticeSetup;

window.showProgress =
    showProgress;

window.showProfile =
    showProfile;

window.createStudentProfile =
    createStudentProfile;

window.loginStudent =
    loginStudent;

window.logoutStudent =
    logoutStudent;

window.selectAvatar =
    selectAvatar;

window.startTest =
    startTest;

window.selectAnswer =
    selectAnswer;

window.nextQuestion =
    nextQuestion;

window.previousQuestion =
    previousQuestion;

window.finishTest =
    finishTest;

// =====================================================
// MAKE HTML ONCLICK FUNCTIONS GLOBALLY AVAILABLE
// =====================================================

window.showCreateProfile = showCreateProfile;
window.showLogin = showLogin;
window.createStudentProfile = createStudentProfile;
window.selectAvatar = selectAvatar;
window.loginStudent = loginStudent;
window.logoutStudent = logoutStudent;

window.showDashboard = showDashboard;
window.showPracticeSetup = showPracticeSetup;
window.showProgress = showProgress;
window.showProfile = showProfile;

window.startTest = startTest;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
