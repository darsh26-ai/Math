/* =========================================================
   MATH ADVENTURE
   Firebase Authentication + Firestore
   Student Login + Dashboard + Progress + Math Engine
   ========================================================= */

/* =========================================================
   FIREBASE IMPORTS
   ========================================================= */

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


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentStudent = null;

let selectedTopic = "mixed";

let selectedAvatar = "🧑‍🚀";

let questions = [];

let answers = [];

let currentQuestion = 0;

let testTimer = null;

let remainingSeconds = 0;

let currentTestStart = null;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", initializeApp);


function initializeApp() {

    setupTopicButtons();

    setupAvatarButtons();

    setupAuthButtons();

    setupNavigationButtons();

    setupPracticeButtons();

    setupKeyboardShortcuts();

    console.log("Math Adventure loaded successfully.");
}


/* =========================================================
   DOM HELPERS
   ========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }

}


function showElement(id) {

    const element = getElement(id);

    if (element) {
        element.classList.remove("hidden");
    }

}


function hideElement(id) {

    const element = getElement(id);

    if (element) {
        element.classList.add("hidden");
    }

}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function hideAllScreens() {

    const screens = [
        "loginScreen",
        "registerScreen",
        "profileScreen",
        "dashboardScreen",
        "profileViewScreen",
        "progressScreen",
        "setupScreen",
        "testScreen",
        "resultScreen"
    ];

    screens.forEach(id => {
        hideElement(id);
    });

}


function showLoginScreen() {

    clearInterval(testTimer);

    hideAllScreens();

    showElement("loginScreen");

    clearError("loginError");

}


function showRegisterScreen() {

    hideAllScreens();

    showElement("registerScreen");

    clearError("registerError");

}


function showDashboard() {

    if (!currentStudent) {
        showLoginScreen();
        return;
    }

    clearInterval(testTimer);

    hideAllScreens();

    showElement("dashboardScreen");

    updateDashboard();

}


function showPracticeSetup() {

    if (!currentStudent) {
        showLoginScreen();
        return;
    }

    hideAllScreens();

    showElement("setupScreen");

    setGradeFromProfile();

}


function showProfile() {

    if (!currentStudent) {
        showLoginScreen();
        return;
    }

    hideAllScreens();

    if (getElement("profileViewScreen")) {

        showElement("profileViewScreen");

        updateProfileScreen();

    }
    else if (getElement("registerScreen")) {

        populateProfileForm();

        showElement("registerScreen");

    }

}


function showProgress() {

    if (!currentStudent) {
        showLoginScreen();
        return;
    }

    hideAllScreens();

    showElement("progressScreen");

    updateProgressScreen();

}


/* =========================================================
   ERROR HANDLING
   ========================================================= */

function showError(elementId, message) {

    const element = getElement(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove("hidden");

}


function clearError(elementId) {

    const element = getElement(elementId);

    if (!element) {
        return;
    }

    element.textContent = "";

    element.classList.add("hidden");

}


/* =========================================================
   FIREBASE AUTHENTICATION
   ========================================================= */

/*
   Firebase Authentication uses email/password.

   Students only enter:
       Name
       6-digit PIN

   We internally convert the name to:
       normalizedname@mathadventure.app
*/

function createStudentEmail(name) {

    const normalizedName =
        String(name)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    return `${normalizedName}@mathadventure.app`;

}


/* =========================================================
   CREATE STUDENT
   ========================================================= */

async function createStudent() {

    clearError("registerError");

    const nameElement = getElement("registerName");
    const gradeElement = getElement("registerGrade");
    const pinElement = getElement("registerPin");
    const confirmPinElement =
        getElement("registerPinConfirm");

    if (
        !nameElement ||
        !gradeElement ||
        !pinElement ||
        !confirmPinElement
    ) {

        showError(
            "registerError",
            "Registration form could not be found."
        );

        return;

    }


    const name =
        nameElement.value.trim();

    const grade =
        parseInt(
            gradeElement.value,
            10
        );

    const pin =
        pinElement.value.trim();

    const confirmPin =
        confirmPinElement.value.trim();


    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

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


    if (
        !grade ||
        grade < 1 ||
        grade > 7
    ) {

        showError(
            "registerError",
            "Please select a grade."
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
        getElement("registerButton");


    if (button) {

        button.disabled = true;

        button.textContent =
            "⏳ Creating Profile...";

    }


    try {

        /* -------------------------------------------------
           CREATE FIREBASE AUTH ACCOUNT
           ------------------------------------------------- */

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                pin
            );


        const user =
            userCredential.user;


        /* -------------------------------------------------
           CREATE FIRESTORE PROFILE
           ------------------------------------------------- */

        const profile = {

            name,

            grade,

            avatar:
                selectedAvatar || "🧑‍🚀",

            email,

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


        /* -------------------------------------------------
           CLEAR FORM
           ------------------------------------------------- */

        clearRegistrationForm();


        /* -------------------------------------------------
           OPEN DASHBOARD
           ------------------------------------------------- */

        showDashboard();

    }
    catch (error) {

        console.error(
            "Create student error:",
            error
        );


        showError(
            "registerError",
            getFirebaseAuthErrorMessage(error)
        );

    }
    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🚀 Create My Profile";

        }

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginStudent() {

    clearError("loginError");

    const nameElement =
        getElement("loginName");

    const pinElement =
        getElement("loginPin");


    if (!nameElement || !pinElement) {

        showError(
            "loginError",
            "Login form could not be found."
        );

        return;

    }


    const name =
        nameElement.value.trim();

    const pin =
        pinElement.value.trim();


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
        getElement("loginButton");


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

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );


        showError(
            "loginError",
            getFirebaseLoginErrorMessage(error)
        );

    }
    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🔐 Login";

        }

    }

}


/* =========================================================
   FIREBASE ERROR MESSAGES
   ========================================================= */

function getFirebaseAuthErrorMessage(error) {

    switch (error.code) {

        case "auth/email-already-in-use":

            return (
                "A student with this name already exists. " +
                "Please use Login."
            );

        case "auth/weak-password":

            return (
                "Please use a 6-digit PIN."
            );

        case "auth/invalid-email":

            return (
                "The student name could not be used."
            );

        default:

            return (
                "Unable to create the student profile. " +
                "Please try again."
            );

    }

}


function getFirebaseLoginErrorMessage(error) {

    switch (error.code) {

        case "auth/user-not-found":

        case "auth/wrong-password":

        case "auth/invalid-credential":

            return (
                "Incorrect student name or PIN."
            );

        case "auth/too-many-requests":

            return (
                "Too many login attempts. Please try again later."
            );

        default:

            return (
                "Unable to log in. Please try again."
            );

    }

}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            currentStudent = null;

            showLoginScreen();

            return;

        }


        try {

            await loadCurrentStudent(user.uid);


            if (!currentStudent) {

                await signOut(auth);

                showLoginScreen();

                return;

            }


            showDashboard();

        }
        catch (error) {

            console.error(
                "Loading student profile:",
                error
            );


            showError(
                "loginError",
                "Unable to load your student profile."
            );

        }

    }
);


/* =========================================================
   LOAD CURRENT STUDENT
   ========================================================= */

async function loadCurrentStudent(uid) {

    const snapshot =
        await getDoc(
            doc(
                db,
                "students",
                uid
            )
        );


    if (!snapshot.exists()) {

        currentStudent = null;

        return null;

    }


    currentStudent = {

        uid,

        ...snapshot.data()

    };


    return currentStudent;

}


/* =========================================================
   REFRESH STUDENT
   ========================================================= */

async function refreshCurrentStudent() {

    if (!auth.currentUser) {

        currentStudent = null;

        return null;

    }


    return loadCurrentStudent(
        auth.currentUser.uid
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logoutStudent() {

    clearInterval(testTimer);

    questions = [];

    answers = [];

    currentQuestion = 0;

    try {

        await signOut(auth);

        currentStudent = null;

    }
    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


/* =========================================================
   HEADER
   ========================================================= */

function updateHeader() {

    const student =
        currentStudent;


    const headerStudent =
        getElement("headerStudent");


    if (!headerStudent) {
        return;
    }


    if (!student) {

        headerStudent.classList.add(
            "hidden"
        );

        return;

    }


    headerStudent.classList.remove(
        "hidden"
    );


    setText(
        "headerAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "headerStudentName",
        student.name || ""
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    if (!currentStudent) {
        return;
    }


    const student =
        currentStudent;


    const stats =
        calculateStudentStats(
            student
        );


    /* -----------------------------------------------------
       MAIN PROFILE
       ----------------------------------------------------- */

    setText(
        "dashboardAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "dashboardName",
        student.name
    );


    setText(
        "dashboardGrade",
        `Grade ${student.grade}`
    );


    /* -----------------------------------------------------
       SUPPORT BOTH OLD AND NEW STAT IDs
       ----------------------------------------------------- */

    setText(
        "testsCompleted",
        stats.tests
    );

    setText(
        "averageScore",
        `${stats.average}%`
    );

    setText(
        "bestScore",
        `${stats.best}%`
    );

    setText(
        "questionsAnswered",
        stats.questions
    );


    setText(
        "statTests",
        stats.tests
    );

    setText(
        "statCorrect",
        stats.correct
    );

    setText(
        "statAccuracy",
        `${stats.average}%`
    );


    setText(
        "overallProgressText",
        `${stats.average}%`
    );


    const progressBar =
        getElement(
            "overallProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            `${stats.average}%`;

    }


    updateHeader();

    renderRecentTests(student);

}


/* =========================================================
   PROFILE SCREEN
   ========================================================= */

function updateProfileScreen() {

    if (!currentStudent) {
        return;
    }


    const student =
        currentStudent;


    const stats =
        calculateStudentStats(
            student
        );


    setText(
        "profileViewAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "profileViewName",
        student.name
    );


    setText(
        "profileViewGrade",
        `Grade ${student.grade}`
    );


    setText(
        "profileTests",
        stats.tests
    );


    setText(
        "profileAverage",
        `${stats.average}%`
    );


    setText(
        "profileBest",
        `${stats.best}%`
    );

}


/* =========================================================
   POPULATE PROFILE FORM
   ========================================================= */

function populateProfileForm() {

    if (!currentStudent) {
        return;
    }


    const name =
        getElement("registerName");

    const grade =
        getElement("registerGrade");


    if (name) {

        name.value =
            currentStudent.name || "";

    }


    if (grade) {

        grade.value =
            String(
                currentStudent.grade || ""
            );

    }


    selectAvatarByValue(
        currentStudent.avatar
    );

}


/* =========================================================
   CALCULATE STATISTICS
   ========================================================= */

function calculateStudentStats(student) {

    const tests =
        Array.isArray(
            student?.testsHistory
        )
            ? student.testsHistory
            : [];


    const firebaseStats =
        student?.statistics || {};


    if (tests.length === 0) {

        return {

            tests:
                Number(
                    firebaseStats.tests
                ) || 0,

            average:
                Number(
                    firebaseStats.accuracy
                ) || 0,

            best:
                0,

            questions:
                Number(
                    firebaseStats.questions
                ) || 0,

            correct:
                Number(
                    firebaseStats.correct
                ) || 0

        };

    }


    const scores =
        tests.map(
            test =>
                Number(
                    test.percentage
                ) || 0
        );


    const totalScore =
        scores.reduce(
            (sum, score) =>
                sum + score,
            0
        );


    const average =
        Math.round(
            totalScore /
            scores.length
        );


    const best =
        Math.max(
            ...scores
        );


    const questions =
        tests.reduce(
            (sum, test) =>
                sum +
                (
                    Number(
                        test.totalQuestions
                    ) || 0
                ),
            0
        );


    const correct =
        tests.reduce(
            (sum, test) =>
                sum +
                (
                    Number(
                        test.correct
                    ) || 0
                ),
            0
        );


    return {

        tests:
            tests.length,

        average,

        best,

        questions,

        correct

    };

}


/* =========================================================
   RECENT TESTS
   ========================================================= */

function renderRecentTests(student) {

    const container =
        getElement("recentTests");


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
            .map(test => {

                const topic =
                    test.topic ||
                    "Mixed Practice";


                const percentage =
                    Number(
                        test.percentage
                    ) || 0;


                return `

                    <div class="recent-test">

                        <div class="recent-test-left">

                            <strong>
                                ${escapeHTML(topic)}
                            </strong>

                            <small>
                                Grade ${escapeHTML(test.grade)}
                                •
                                ${escapeHTML(test.correct)}
                                /
                                ${escapeHTML(test.totalQuestions)}
                                correct
                                •
                                ${formatDate(test.date)}
                            </small>

                        </div>

                        <div class="test-score">
                            ${percentage}%
                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   PROGRESS SCREEN
   ========================================================= */

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
        currentStudent.avatar || "🧑‍🚀"
    );


    setText(
        "progressOverall",
        `${stats.average}%`
    );


    const progressBar =
        getElement(
            "overallProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            `${stats.average}%`;

    }


    renderTopicPerformance(
        currentStudent
    );


    renderTestHistory(
        currentStudent
    );

}


/* =========================================================
   TOPIC PERFORMANCE
   ========================================================= */

function renderTopicPerformance(student) {

    const container =
        getElement(
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


    tests.forEach(test => {

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

    });


    container.innerHTML =
        Object.entries(topicData)
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

}


/* =========================================================
   TEST HISTORY
   ========================================================= */

function renderTestHistory(student) {

    const container =
        getElement(
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
            .map(test => {

                const score =
                    Number(
                        test.percentage
                    ) || 0;


                return `

                    <div class="history-item">

                        <div class="history-main">

                            <strong>
                                ${getTopicEmoji(test.topic)}
                                ${escapeHTML(test.topic)}
                            </strong>

                            <small>
                                Grade ${escapeHTML(test.grade)}
                                •
                                ${escapeHTML(test.correct)}
                                /
                                ${escapeHTML(test.totalQuestions)}
                                correct
                                •
                                ${formatDate(test.date)}
                            </small>

                        </div>

                        <div
                            class="history-score"
                            style="color:${getScoreColor(score)}"
                        >
                            ${score}%
                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   PRACTICE SETUP
   ========================================================= */

function setGradeFromProfile() {

    if (!currentStudent) {
        return;
    }


    const gradeSelect =
        getElement(
            "gradeSelect"
        );


    if (gradeSelect) {

        gradeSelect.value =
            String(
                currentStudent.grade
            );

    }

}


/* =========================================================
   TOPIC BUTTONS
   ========================================================= */

function setupTopicButtons() {

    document
        .querySelectorAll(
            ".topic-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".topic-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        });


                    this.classList.add(
                        "selected"
                    );


                    selectedTopic =
                        this.dataset.topic ||
                        "mixed";

                }
            );

        });

}


/* =========================================================
   AVATAR BUTTONS
   ========================================================= */

function setupAvatarButtons() {

    document
        .querySelectorAll(
            ".avatar-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".avatar-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        });


                    this.classList.add(
                        "selected"
                    );


                    selectedAvatar =
                        this.dataset.avatar ||
                        "🧑‍🚀";

                }
            );

        });

}


/* =========================================================
   SELECT AVATAR PROGRAMMATICALLY
   ========================================================= */

function selectAvatarByValue(avatar) {

    if (!avatar) {
        return;
    }


    const button =
        document.querySelector(
            `.avatar-btn[data-avatar="${CSS.escape(avatar)}"]`
        );


    if (button) {

        document
            .querySelectorAll(
                ".avatar-btn"
            )
            .forEach(btn => {

                btn.classList.remove(
                    "selected"
                );

            });


        button.classList.add(
            "selected"
        );


        selectedAvatar =
            avatar;

    }

}


/* =========================================================
   AUTH BUTTONS
   ========================================================= */

function setupAuthButtons() {

    const loginButton =
        getElement("loginButton");


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginStudent
        );

    }


    const registerButton =
        getElement("registerButton");


    if (registerButton) {

        registerButton.addEventListener(
            "click",
            createStudent
        );

    }


    const showRegisterButton =
        getElement(
            "showRegisterButton"
        );


    if (showRegisterButton) {

        showRegisterButton.addEventListener(
            "click",
            showRegisterScreen
        );

    }


    const backToLoginButton =
        getElement(
            "backToLoginButton"
        );


    if (backToLoginButton) {

        backToLoginButton.addEventListener(
            "click",
            showLoginScreen
        );

    }


    const logoutButton =
        getElement(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutStudent
        );

    }

}


/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function setupNavigationButtons() {

    const dashboardButton =
        getElement(
            "backDashboardButton"
        );


    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            showDashboard
        );

    }


    const resultDashboardButton =
        getElement(
            "resultDashboardButton"
        );


    if (resultDashboardButton) {

        resultDashboardButton.addEventListener(
            "click",
            showDashboard
        );

    }


    const profileButton =
        getElement(
            "profileButton"
        );


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            showProfile
        );

    }


    const progressButton =
        getElement(
            "progressButton"
        );


    if (progressButton) {

        progressButton.addEventListener(
            "click",
            showProgress
        );

    }

}


/* =========================================================
   PRACTICE BUTTONS
   ========================================================= */

function setupPracticeButtons() {

    const startPracticeButton =
        getElement(
            "startPracticeButton"
        );


    if (startPracticeButton) {

        startPracticeButton.addEventListener(
            "click",
            showPracticeSetup
        );

    }


    const startTestButton =
        getElement(
            "startTestButton"
        );


    if (startTestButton) {

        startTestButton.addEventListener(
            "click",
            startTest
        );

    }


    const nextButton =
        getElement(
            "nextQuestionButton"
        );


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextQuestion
        );

    }


    const previousButton =
        getElement(
            "previousQuestionButton"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousQuestion
        );

    }


    const finishButton =
        getElement(
            "finishTestButton"
        );


    if (finishButton) {

        finishButton.addEventListener(
            "click",
            finishTest
        );

    }

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                getElement("loginScreen") &&
                !getElement("loginScreen")
                    .classList.contains("hidden")
            ) {

                const pin =
                    getElement("loginPin");


                if (
                    document.activeElement === pin
                ) {

                    loginStudent();

                }

            }

        }
    );

}


/* =========================================================
   START TEST
   ========================================================= */

function startTest() {

    if (!currentStudent) {

        showLoginScreen();

        return;

    }


    const gradeSelect =
        getElement(
            "gradeSelect"
        );


    const questionCountSelect =
        getElement(
            "questionCount"
        );


    const timeLimitSelect =
        getElement(
            "timeLimit"
        );


    const answerTypeSelect =
        getElement(
            "answerType"
        );


    const grade =
        parseInt(
            gradeSelect?.value,
            10
        );


    const count =
        parseInt(
            questionCountSelect?.value,
            10
        ) || 10;


    const minutes =
        parseInt(
            timeLimitSelect?.value,
            10
        ) || 0;


    const answerType =
        answerTypeSelect?.value ||
        "mixed";


    if (
        !grade ||
        grade < 1 ||
        grade > 7
    ) {

        alert(
            "Please select a valid grade."
        );

        return;

    }


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

    showElement("testScreen");


    if (minutes > 0) {

        remainingSeconds =
            minutes * 60;

        startTimer();

    }
    else {

        clearInterval(
            testTimer
        );

        setText(
            "timer",
            "⏱ No Timer"
        );

    }


    showQuestion();

}


/* =========================================================
   TIMER
   ========================================================= */

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


function updateTimerDisplay() {

    const timer =
        getElement(
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


/* =========================================================
   GENERATE QUESTION
   ========================================================= */

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


/* =========================================================
   SHOW QUESTION
   ========================================================= */

function showQuestion() {

    const q =
        questions[
            currentQuestion
        ];


    if (!q) {
        return;
    }


    setText(
        "progressText",
        `Question ${currentQuestion + 1} of ${questions.length}`
    );


    const progressBar =
        getElement(
            "progressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            (
                (
                    currentQuestion + 1
                ) /
                questions.length *
                100
            ) +
            "%";

    }


    const container =
        getElement(
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
        Array.isArray(q.options)
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
                        type="button"
                        class="answer-btn ${selected}"
                        data-answer="${escapeHTML(option)}"
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


    /* -----------------------------------------------------
       ANSWER BUTTON EVENTS
       ----------------------------------------------------- */

    container
        .querySelectorAll(
            ".answer-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        button,
                        button.dataset.answer
                    );

                }
            );

        });


    /* -----------------------------------------------------
       TEXT ANSWER
       ----------------------------------------------------- */

    const input =
        getElement(
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

                    event.preventDefault();

                    nextQuestion();

                }

            }
        );

    }

}


/* =========================================================
   SELECT ANSWER
   ========================================================= */

function selectAnswer(
    button,
    value
) {

    document
        .querySelectorAll(
            ".answer-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    answers[
        currentQuestion
    ] =
        value;

}


/* =========================================================
   SAVE TEXT ANSWER
   ========================================================= */

function saveTextAnswer() {

    const input =
        getElement(
            "textAnswer"
        );


    if (input) {

        answers[
            currentQuestion
        ] =
            input.value.trim();

    }

}


/* =========================================================
   NEXT QUESTION
   ========================================================= */

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


/* =========================================================
   PREVIOUS QUESTION
   ========================================================= */

function previousQuestion() {

    saveTextAnswer();


    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        showQuestion();

    }

}


/* =========================================================
   FINISH TEST
   ========================================================= */

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
        (question, index) => {

            if (
                isCorrectAnswer(
                    answers[index],
                    question.answer
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


    if (!currentStudent) {

        showLoginScreen();

        return;

    }


    const grade =
        parseInt(
            getElement(
                "gradeSelect"
            )?.value ||
            currentStudent.grade,
            10
        );


    const topicName =
        getTestTopicName();


    const testRecord = {

        id:
            Date.now().toString(),

        date:
            new Date().toISOString(),

        grade,

        topic:
            topicName,

        correct,

        totalQuestions:
            questions.length,

        percentage

    };


    try {

        await saveTestResult(
            testRecord
        );

    }
    catch (error) {

        console.error(
            "Could not save test:",
            error
        );


        alert(
            "Your test was completed, but we could not save the result. Please check your internet connection."
        );

    }


    showResultScreen(
        correct,
        percentage
    );

}


/* =========================================================
   SAVE TEST RESULT TO FIRESTORE
   ========================================================= */

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


    const previousTests =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
            : [];


    const testsHistory = [
        ...previousTests,
        testRecord
    ];


    /* -----------------------------------------------------
       UPDATE OVERALL STATISTICS
       ----------------------------------------------------- */

    const previousStats =
        student.statistics || {};


    const oldQuestions =
        Number(
            previousStats.questions
        ) || 0;


    const oldCorrect =
        Number(
            previousStats.correct
        ) || 0;


    const newQuestions =
        oldQuestions +
        testRecord.totalQuestions;


    const newCorrect =
        oldCorrect +
        testRecord.correct;


    const accuracy =
        newQuestions > 0
            ? Math.round(
                newCorrect /
                newQuestions *
                100
            )
            : 0;


    const statistics = {

        tests:
            testsHistory.length,

        correct:
            newCorrect,

        questions:
            newQuestions,

        accuracy

    };


    /* -----------------------------------------------------
       UPDATE TOPIC STATISTICS
       ----------------------------------------------------- */

    const topics = {

        ...(student.topics || {})

    };


    const topicKey =
        getTopicKeyFromName(
            testRecord.topic
        );


    if (!topics[topicKey]) {

        topics[topicKey] = {

            correct: 0,

            questions: 0,

            accuracy: 0

        };

    }


    topics[topicKey].correct =
        (
            Number(
                topics[topicKey].correct
            ) || 0
        ) +
        testRecord.correct;


    topics[topicKey].questions =
        (
            Number(
                topics[topicKey].questions
            ) || 0
        ) +
        testRecord.totalQuestions;


    topics[topicKey].accuracy =
        topics[topicKey].questions > 0
            ? Math.round(
                topics[topicKey].correct /
                topics[topicKey].questions *
                100
            )
            : 0;


    /* -----------------------------------------------------
       UPDATE FIRESTORE
       ----------------------------------------------------- */

    await updateDoc(
        studentRef,
        {

            statistics,

            topics,

            testsHistory

        }
    );


    /* -----------------------------------------------------
       UPDATE LOCAL STATE
       ----------------------------------------------------- */

    currentStudent = {

        ...student,

        uid:
            auth.currentUser.uid,

        statistics,

        topics,

        testsHistory

    };

}


/* =========================================================
   RESULT SCREEN
   ========================================================= */

function showResultScreen(
    correct,
    percentage
) {

    hideAllScreens();

    showElement(
        "resultScreen"
    );


    setText(
        "scorePercent",
        `${percentage}%`
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
        `You got ${correct} out of ${questions.length} questions correct.`
    );


    setText(
        "resultBadge",
        getAchievement(
            percentage
        )
    );


    createReview();

}


/* =========================================================
   TEST TOPIC NAME
   ========================================================= */

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


/* =========================================================
   TOPIC FIRESTORE KEY
   ========================================================= */

function getTopicKeyFromName(
    topic
) {

    const keys = {

        "Mixed Practice":
            "mixed",

        "Addition":
            "addition",

        "Subtraction":
            "subtraction",

        "Multiplication":
            "multiplication",

        "Division":
            "division",

        "Fractions":
            "fractions",

        "Decimals":
            "decimals",

        "Word Problems":
            "word",

        "Time":
            "time",

        "Compare Numbers":
            "comparison"

    };


    return (
        keys[topic] ||
        "mixed"
    );

}


/* =========================================================
   CHECK ANSWER
   ========================================================= */

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
            ) <
            0.000001
        );

    }


    return user === correct;

}


/* =========================================================
   REVIEW
   ========================================================= */

function createReview() {

    const container =
        getElement(
            "reviewContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    questions.forEach(
        (question, index) => {

            const rawUserAnswer =
                answers[index];


            const displayUserAnswer =
                rawUserAnswer === undefined ||
                rawUserAnswer === ""
                    ? "No Answer"
                    : rawUserAnswer;


            const correct =
                isCorrectAnswer(
                    rawUserAnswer,
                    question.answer
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
                    ${question.question}

                </div>

                <div>

                    Your answer:

                    <span class="${
                        correct
                            ? "correct-answer"
                            : "wrong-answer"
                    }">

                        ${escapeHTML(
                            displayUserAnswer
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
                                    question.answer
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


/* =========================================================
   AVAILABLE TOPICS
   ========================================================= */

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


/* =========================================================
   ADDITION
   ========================================================= */

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

        type:
            "Addition",

        question:
            `${a} + ${b} = ?`,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   SUBTRACTION
   ========================================================= */

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

        type:
            "Subtraction",

        question:
            `${a} − ${b} = ?`,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   MULTIPLICATION
   ========================================================= */

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

        type:
            "Multiplication",

        question:
            `${a} × ${b} = ?`,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   DIVISION
   ========================================================= */

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

        type:
            "Division",

        question:
            `${dividend} ÷ ${divisor} = ?`,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   FRACTIONS
   ========================================================= */

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
                `Which fraction represents ${numerator} out of ${denominator}?`,

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
            `${numerator}/${denominator} + ${n2}/${d2} ≈ ?`,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   DECIMALS
   ========================================================= */

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

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   WORD PROBLEM
   ========================================================= */

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

        question,

        answer,

        options:
            makeNumberOptions(
                answer
            )

    };

}


/* =========================================================
   TIME
   ========================================================= */

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

        answer,

        hour,

        minute,

        options:
            makeTimeOptions(
                hour,
                minute
            )

    };

}


/* =========================================================
   FORMAT TIME
   ========================================================= */

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


/* =========================================================
   CLOCK HTML
   ========================================================= */

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


/* =========================================================
   TIME OPTIONS
   ========================================================= */

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


/* =========================================================
   NUMBER OPTIONS
   ========================================================= */

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


/* =========================================================
   COMPARISON
   ========================================================= */

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

        answer,

        options: [

            ">",
            "<",
            "="

        ]

    };

}


/* =========================================================
   SHUFFLE
   ========================================================= */

function shuffle(
    array
) {

    const result =
        [...array];


    for (
        let i =
            result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


/* =========================================================
   RANDOM NUMBER
   ========================================================= */

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


/* =========================================================
   ACHIEVEMENT
   ========================================================= */

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


/* =========================================================
   TOPIC EMOJI
   ========================================================= */

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


/* =========================================================
   SCORE COLOR
   ========================================================= */

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


/* =========================================================
   DATE FORMAT
   ========================================================= */

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


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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


/* =========================================================
   CLEAR REGISTRATION FORM
   ========================================================= */

function clearRegistrationForm() {

    const fields = [

        "registerName",
        "registerPin",
        "registerPinConfirm"

    ];


    fields.forEach(id => {

        const element =
            getElement(id);


        if (element) {

            element.value =
                "";

        }

    });

}


/* =========================================================
   EXPORT FUNCTIONS FOR INLINE HTML
   =========================================================

   If your HTML currently uses things like:

       onclick="showDashboard()"
       onclick="nextQuestion()"

   these assignments keep those buttons working.
   ========================================================= */

window.showLoginScreen =
    showLoginScreen;

window.showRegisterScreen =
    showRegisterScreen;

window.showDashboard =
    showDashboard;

window.showPracticeSetup =
    showPracticeSetup;

window.showProfile =
    showProfile;

window.showProgress =
    showProgress;

window.loginStudent =
    loginStudent;

window.createStudent =
    createStudent;

window.logoutStudent =
    logoutStudent;

window.startTest =
    startTest;

window.nextQuestion =
    nextQuestion;

window.previousQuestion =
    previousQuestion;

window.finishTest =
    finishTest;

window.selectAnswer =
    selectAnswer;
