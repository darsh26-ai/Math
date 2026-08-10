// =====================================================
// MATH ADVENTURE
// Firebase Student Login + Dashboard + Progress
// Math Practice Engine
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

let selectedTopic = "mixed";
let selectedAvatar = "🧑‍🚀";

let questions = [];
let answers = [];
let currentQuestion = 0;

let testTimer = null;
let remainingSeconds = 0;
let currentTestStart = null;

let currentStudent = null;
let isFinishingTest = false;


// =====================================================
// INITIALIZE APP
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    setupTopicButtons();
    setupAvatarButtons();
    setupEventListeners();

    console.log("Math Adventure loaded successfully.");

});


// =====================================================
// DOM HELPER
// =====================================================

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


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        currentStudent = null;

        clearInterval(testTimer);

        showLoginScreen();

        return;
    }

    await loadCurrentStudent(user.uid);

});


// =====================================================
// LOAD CURRENT STUDENT
// =====================================================

async function loadCurrentStudent(uid) {

    try {

        const snapshot = await getDoc(
            doc(
                db,
                "students",
                uid
            )
        );

        if (!snapshot.exists()) {

            console.error(
                "Student profile not found."
            );

            await signOut(auth);

            return;
        }

        currentStudent = {
            uid: uid,
            ...snapshot.data()
        };

        showDashboard();

    }
    catch (error) {

        console.error(
            "Error loading student profile:",
            error
        );

        showError(
            "loginError",
            "Unable to load your student profile."
        );

    }

}


// =====================================================
// SCREEN MANAGEMENT
// =====================================================

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


// =====================================================
// SHOW LOGIN
// =====================================================

function showLoginScreen() {

    hideAllScreens();

    showElement("loginScreen");

    clearError("loginError");

}


// =====================================================
// SHOW REGISTER
// =====================================================

function showRegisterScreen() {

    hideAllScreens();

    showElement("registerScreen");

    clearError("registerError");

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

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


// =====================================================
// SHOW PRACTICE SETUP
// =====================================================

function showPracticeSetup() {

    if (!currentStudent) {

        showLoginScreen();

        return;
    }

    hideAllScreens();

    showElement("setupScreen");

    setGradeFromProfile();

}


// =====================================================
// SHOW PROFILE
// =====================================================

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

        showRegisterScreen();

    }

}


// =====================================================
// SHOW PROGRESS
// =====================================================

function showProgress() {

    if (!currentStudent) {

        showLoginScreen();

        return;
    }

    hideAllScreens();

    showElement("progressScreen");

    updateProgressScreen();

}


// =====================================================
// HEADER
// =====================================================

function updateHeader() {

    const headerStudent =
        getElement("headerStudent");

    if (!headerStudent) {
        return;
    }

    if (!currentStudent) {

        headerStudent.classList.add("hidden");

        return;
    }

    headerStudent.classList.remove("hidden");

    setText(
        "headerAvatar",
        currentStudent.avatar || "🧑‍🚀"
    );

    setText(
        "headerStudentName",
        currentStudent.name || "Student"
    );

}


// =====================================================
// SETUP EVENT LISTENERS
// =====================================================

function setupEventListeners() {

    const showRegisterButton =
        getElement("showRegisterButton");

    if (showRegisterButton) {

        showRegisterButton.addEventListener(
            "click",
            showRegisterScreen
        );

    }


    const backToLoginButton =
        getElement("backToLoginButton");

    if (backToLoginButton) {

        backToLoginButton.addEventListener(
            "click",
            showLoginScreen
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


    const loginButton =
        getElement("loginButton");

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginStudent
        );

    }


    const logoutButton =
        getElement("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutStudent
        );

    }


    const startPracticeButton =
        getElement("startPracticeButton");

    if (startPracticeButton) {

        startPracticeButton.addEventListener(
            "click",
            showPracticeSetup
        );

    }


    const backDashboardButton =
        getElement("backDashboardButton");

    if (backDashboardButton) {

        backDashboardButton.addEventListener(
            "click",
            showDashboard
        );

    }


    const resultDashboardButton =
        getElement("resultDashboardButton");

    if (resultDashboardButton) {

        resultDashboardButton.addEventListener(
            "click",
            showDashboard
        );

    }


    const profileButton =
        getElement("profileButton");

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            showProfile
        );

    }


    const progressButton =
        getElement("progressButton");

    if (progressButton) {

        progressButton.addEventListener(
            "click",
            showProgress
        );

    }


    const startTestButton =
        getElement("startTestButton");

    if (startTestButton) {

        startTestButton.addEventListener(
            "click",
            startTest
        );

    }


    const nextQuestionButton =
        getElement("nextQuestionButton");

    if (nextQuestionButton) {

        nextQuestionButton.addEventListener(
            "click",
            nextQuestion
        );

    }


    const previousQuestionButton =
        getElement("previousQuestionButton");

    if (previousQuestionButton) {

        previousQuestionButton.addEventListener(
            "click",
            previousQuestion
        );

    }


    const finishTestButton =
        getElement("finishTestButton");

    if (finishTestButton) {

        finishTestButton.addEventListener(
            "click",
            finishTest
        );

    }

}


// =====================================================
// AVATAR SELECTION
// =====================================================

function setupAvatarButtons() {

    document
        .querySelectorAll(".avatar-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".avatar-btn")
                        .forEach(btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        });

                    button.classList.add(
                        "selected"
                    );

                    selectedAvatar =
                        button.dataset.avatar ||
                        button.textContent.trim();

                }
            );

        });

}


// =====================================================
// TOPIC BUTTONS
// =====================================================

function setupTopicButtons() {

    document
        .querySelectorAll(".topic-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".topic-btn")
                        .forEach(btn => {

                            btn.classList.remove(
                                "selected"
                            );

                        });

                    button.classList.add(
                        "selected"
                    );

                    selectedTopic =
                        button.dataset.topic ||
                        "mixed";

                }
            );

        });

}


// =====================================================
// CREATE INTERNAL FIREBASE EMAIL
// =====================================================

function createStudentEmail(name) {

    const cleanName =
        name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    return (
        cleanName +
        "@mathadventure.app"
    );

}


// =====================================================
// CREATE STUDENT
// =====================================================

async function createStudent() {

    clearError("registerError");

    const nameElement =
        getElement("registerName");

    const gradeElement =
        getElement("registerGrade");

    const pinElement =
        getElement("registerPin");

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
            "Registration form is incomplete."
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


    if (
        !grade ||
        grade < 1 ||
        grade > 7
    ) {

        showError(
            "registerError",
            "Please select a valid grade."
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

        // -------------------------------------------------
        // CREATE FIREBASE AUTH ACCOUNT
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

            avatar:
                selectedAvatar || "🧑‍🚀",

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


        clearRegistrationForm();

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
                "A student with this name already exists. Please login.";

        }
        else if (
            error.code ===
            "auth/weak-password"
        ) {

            message =
                "PIN must contain at least 6 characters.";

        }
        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            message =
                "The student name cannot be used for login.";

        }
        else if (
            error.code ===
            "auth/network-request-failed"
        ) {

            message =
                "Network error. Please check your internet connection.";

        }


        showError(
            "registerError",
            message
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


// =====================================================
// LOGIN
// =====================================================

async function loginStudent() {

    clearError("loginError");

    const nameElement =
        getElement("loginName");

    const pinElement =
        getElement("loginPin");


    if (
        !nameElement ||
        !pinElement
    ) {

        showError(
            "loginError",
            "Login form is incomplete."
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

        nameElement.value = "";
        pinElement.value = "";

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );


        let message =
            "Incorrect student name or PIN.";


        if (
            error.code ===
            "auth/too-many-requests"
        ) {

            message =
                "Too many login attempts. Please try again later.";

        }


        showError(
            "loginError",
            message
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


// =====================================================
// LOGOUT
// =====================================================

async function logoutStudent() {

    try {

        clearInterval(testTimer);

        questions = [];

        answers = [];

        currentQuestion = 0;

        await signOut(auth);

    }
    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


// =====================================================
// CLEAR REGISTRATION FORM
// =====================================================

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
            element.value = "";
        }

    });

}


// =====================================================
// PROFILE FORM
// =====================================================

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
                currentStudent.grade || 1
            );

    }

}


// =====================================================
// DASHBOARD
// =====================================================

async function updateDashboard() {

    if (!currentStudent) {
        return;
    }


    // Refresh from Firestore
    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "students",
                    currentStudent.uid
                )
            );


        if (snapshot.exists()) {

            currentStudent = {

                uid:
                    currentStudent.uid,

                ...snapshot.data()

            };

        }

    }
    catch (error) {

        console.error(
            "Dashboard refresh error:",
            error
        );

    }


    const student =
        currentStudent;


    setText(
        "dashboardAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "dashboardName",
        student.name || "Student"
    );


    setText(
        "dashboardGrade",
        "Grade " +
        (student.grade || "")
    );


    setText(
        "profileName",
        student.name || "Student"
    );


    setText(
        "profileGrade",
        "Grade " +
        (student.grade || "")
    );


    updateHeader();


    const stats =
        student.statistics || {};


    const tests =
        Number(stats.tests) || 0;

    const correct =
        Number(stats.correct) || 0;

    const questions =
        Number(stats.questions) || 0;


    const accuracy =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;


    setText(
        "testsCompleted",
        tests
    );

    setText(
        "statTests",
        tests
    );


    setText(
        "questionsAnswered",
        questions
    );


    setText(
        "statCorrect",
        correct
    );


    setText(
        "averageScore",
        accuracy + "%"
    );


    setText(
        "statAccuracy",
        accuracy + "%"
    );


    setText(
        "bestScore",
        calculateBestScore(
            student
        ) + "%"
    );


    setText(
        "overallProgressText",
        accuracy + "%"
    );


    const progressBar =
        getElement(
            "overallProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            accuracy + "%";

    }


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

    updateTopicProgress(
        "fractions",
        topics.fractions
    );

    updateTopicProgress(
        "decimals",
        topics.decimals
    );

    updateTopicProgress(
        "word",
        topics.word
    );

    updateTopicProgress(
        "time",
        topics.time
    );

    updateTopicProgress(
        "comparison",
        topics.comparison
    );


    renderRecentTests(
        student
    );

}


// =====================================================
// CALCULATE BEST SCORE
// =====================================================

function calculateBestScore(student) {

    const tests =
        student.testsHistory || [];


    if (!tests.length) {
        return 0;
    }


    return Math.max(
        ...tests.map(
            test =>
                Number(
                    test.percentage
                ) || 0
        )
    );

}


// =====================================================
// UPDATE TOPIC PROGRESS
// =====================================================

function updateTopicProgress(
    topic,
    data
) {

    if (!data) {
        data = {};
    }


    const questions =
        Number(
            data.questions
        ) || 0;


    const correct =
        Number(
            data.correct
        ) || 0;


    const percentage =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;


    const bar =
        getElement(
            topic +
            "Progress"
        );


    const label =
        getElement(
            topic +
            "Percent"
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
// RECENT TESTS
// =====================================================

function renderRecentTests(student) {

    const container =
        getElement(
            "recentTests"
        );


    if (!container) {
        return;
    }


    const tests =
        student.testsHistory || [];


    if (!tests.length) {

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

                const score =
                    Number(
                        test.percentage
                    ) || 0;


                return `

                    <div class="recent-test">

                        <div class="recent-test-left">

                            <strong>
                                ${getTopicEmoji(
                                    test.topic
                                )}

                                ${escapeHTML(
                                    test.topic ||
                                    "Practice"
                                )}
                            </strong>

                            <small>
                                Grade
                                ${escapeHTML(
                                    test.grade
                                )}
                                •
                                ${escapeHTML(
                                    test.correct
                                )}/${escapeHTML(
                                    test.totalQuestions
                                )}
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
                                    score
                                )}
                            "
                        >
                            ${score}%
                        </div>

                    </div>

                `;

            })
            .join("");

}


// =====================================================
// PROFILE SCREEN
// =====================================================

function updateProfileScreen() {

    if (!currentStudent) {
        return;
    }


    const student =
        currentStudent;


    setText(
        "profileViewAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "profileViewName",
        student.name || "Student"
    );


    setText(
        "profileViewGrade",
        "Grade " +
        (student.grade || "")
    );


    const stats =
        student.statistics || {};


    const questions =
        Number(stats.questions) || 0;

    const correct =
        Number(stats.correct) || 0;


    const accuracy =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;


    setText(
        "profileTests",
        Number(stats.tests) || 0
    );


    setText(
        "profileAverage",
        accuracy + "%"
    );


    setText(
        "profileBest",
        calculateBestScore(
            student
        ) + "%"
    );

}


// =====================================================
// PROGRESS SCREEN
// =====================================================

function updateProgressScreen() {

    if (!currentStudent) {
        return;
    }


    const student =
        currentStudent;


    const stats =
        student.statistics || {};


    const questions =
        Number(stats.questions) || 0;

    const correct =
        Number(stats.correct) || 0;


    const accuracy =
        questions > 0
            ? Math.round(
                correct /
                questions *
                100
            )
            : 0;


    setText(
        "progressAvatar",
        student.avatar || "🧑‍🚀"
    );


    setText(
        "progressOverall",
        accuracy + "%"
    );


    const bar =
        getElement(
            "overallProgressBar"
        );


    if (bar) {

        bar.style.width =
            accuracy + "%";

    }


    renderTopicPerformance(
        student
    );


    renderTestHistory(
        student
    );

}


// =====================================================
// TOPIC PERFORMANCE
// =====================================================

function renderTopicPerformance(student) {

    const container =
        getElement(
            "topicPerformance"
        );


    if (!container) {
        return;
    }


    const topics =
        student.topics || {};


    const topicNames = {

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


    const available =
        Object.keys(
            topicNames
        )
        .filter(
            topic =>
                topics[topic]
        );


    if (!available.length) {

        container.innerHTML = `

            <div class="empty-state">

                Complete a test to see
                your topic performance.

            </div>

        `;

        return;
    }


    container.innerHTML =
        available
            .map(topic => {

                const data =
                    topics[topic] || {};


                const total =
                    Number(
                        data.questions
                    ) || 0;


                const correct =
                    Number(
                        data.correct
                    ) || 0;


                const percentage =
                    total > 0
                        ? Math.round(
                            correct /
                            total *
                            100
                        )
                        : 0;


                return `

                    <div class="topic-row">

                        <div class="topic-row-header">

                            <span>
                                ${getTopicEmoji(
                                    topicNames[topic]
                                )}

                                ${escapeHTML(
                                    topicNames[topic]
                                )}
                            </span>

                            <span>
                                ${percentage}%
                            </span>

                        </div>

                        <div class="topic-bar">

                            <div
                                class="topic-bar-fill"
                                style="
                                    width:${percentage}%
                                "
                            ></div>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// =====================================================
// TEST HISTORY
// =====================================================

function renderTestHistory(student) {

    const container =
        getElement(
            "testHistory"
        );


    if (!container) {
        return;
    }


    const tests =
        student.testsHistory || [];


    if (!tests.length) {

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

                                ${getTopicEmoji(
                                    test.topic
                                )}

                                ${escapeHTML(
                                    test.topic
                                )}

                            </strong>

                            <small>

                                Grade
                                ${escapeHTML(
                                    test.grade
                                )}

                                •

                                ${escapeHTML(
                                    test.correct
                                )}/${escapeHTML(
                                    test.totalQuestions
                                )}

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

            })
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


// =====================================================
// START TEST
// =====================================================

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


    if (
        !gradeSelect ||
        !questionCountSelect ||
        !timeLimitSelect
    ) {

        console.error(
            "Practice setup elements are missing."
        );

        return;
    }


    const grade =
        parseInt(
            gradeSelect.value,
            10
        );


    const count =
        parseInt(
            questionCountSelect.value,
            10
        );


    const minutes =
        parseInt(
            timeLimitSelect.value,
            10
        );


    const answerType =
        answerTypeSelect
            ? answerTypeSelect.value
            : "mixed";


    if (
        !grade ||
        !count
    ) {

        alert(
            "Please choose a grade and question count."
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

    showElement(
        "testScreen"
    );


    if (
        minutes > 0
    ) {

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


    setText(
        "progressText",
        "Question " +
        (
            currentQuestion + 1
        ) +
        " of " +
        questions.length
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

            ${escapeHTML(
                q.type
            )}

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


        q.options.forEach(option => {

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
                    data-answer="${escapeHTML(
                        option
                    )}"
                >

                    ${escapeHTML(
                        option
                    )}

                </button>

            `;

        });


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
                    value="${escapeHTML(
                        existing
                    )}"
                    placeholder="Type your answer"
                    autocomplete="off"
                >

            </div>

        `;

    }


    container.innerHTML =
        html;


    // -------------------------------------------------
    // ANSWER BUTTONS
    // -------------------------------------------------

    container
        .querySelectorAll(".answer-btn")
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


    // -------------------------------------------------
    // TEXT ANSWER
    // -------------------------------------------------

    const input =
        getElement(
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
            event => {

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


// =====================================================
// SELECT ANSWER
// =====================================================

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


// =====================================================
// SAVE TEXT ANSWER
// =====================================================

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

    if (isFinishingTest) {
        return;
    }


    if (!questions.length) {
        return;
    }


    isFinishingTest = true;


    try {

        saveTextAnswer();

        clearInterval(
            testTimer
        );


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


        if (!currentStudent) {

            showLoginScreen();

            return;
        }


        const gradeSelect =
            getElement(
                "gradeSelect"
            );


        const grade =
            gradeSelect
                ? parseInt(
                    gradeSelect.value,
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

            correct:
                correct,

            totalQuestions:
                questions.length,

            percentage:
                percentage

        };


        await saveTestResult(
            testRecord
        );


        // -------------------------------------------------
        // SHOW RESULT
        // -------------------------------------------------

        hideAllScreens();

        showElement(
            "resultScreen"
        );


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
    catch (error) {

        console.error(
            "Finish test error:",
            error
        );


        alert(
            "There was a problem saving your test. Please try again."
        );

    }
    finally {

        isFinishingTest = false;

    }

}


// =====================================================
// SAVE TEST RESULT TO FIRESTORE
// =====================================================

async function saveTestResult(
    testRecord
) {

    if (!currentStudent) {
        return;
    }


    const studentRef =
        doc(
            db,
            "students",
            currentStudent.uid
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


    // -------------------------------------------------
    // TEST HISTORY
    // -------------------------------------------------

    const testsHistory =
        Array.isArray(
            student.testsHistory
        )
            ? student.testsHistory
                .slice()
            : [];


    testsHistory.push(
        testRecord
    );


    // -------------------------------------------------
    // STATISTICS
    // -------------------------------------------------

    const oldStats =
        student.statistics || {};


    const oldTests =
        Number(
            oldStats.tests
        ) || 0;


    const oldCorrect =
        Number(
            oldStats.correct
        ) || 0;


    const oldQuestions =
        Number(
            oldStats.questions
        ) || 0;


    const newTests =
        oldTests + 1;


    const newCorrect =
        oldCorrect +
        testRecord.correct;


    const newQuestions =
        oldQuestions +
        testRecord.totalQuestions;


    const newAccuracy =
        newQuestions > 0
            ? Math.round(
                newCorrect /
                newQuestions *
                100
            )
            : 0;


    // -------------------------------------------------
    // TOPIC
    // -------------------------------------------------

    const topicKey =
        getTopicKey(
            selectedTopic
        );


    const topics =
        student.topics || {};


    const oldTopic =
        topics[topicKey] || {};


    const topicCorrect =
        Number(
            oldTopic.correct
        ) || 0;


    const topicQuestions =
        Number(
            oldTopic.questions
        ) || 0;


    const updatedTopicQuestions =
        topicQuestions +
        testRecord.totalQuestions;


    const updatedTopicCorrect =
        topicCorrect +
        testRecord.correct;


    topics[topicKey] = {

        correct:
            updatedTopicCorrect,

        questions:
            updatedTopicQuestions,

        accuracy:
            updatedTopicQuestions > 0
                ? Math.round(
                    updatedTopicCorrect /
                    updatedTopicQuestions *
                    100
                )
                : 0

    };


    // -------------------------------------------------
    // UPDATE FIRESTORE
    // -------------------------------------------------

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
                topics,

            testsHistory:
                testsHistory,

            updatedAt:
                serverTimestamp()

        }
    );


    // -------------------------------------------------
    // UPDATE LOCAL CURRENT STUDENT
    // -------------------------------------------------

    currentStudent = {

        uid:
            currentStudent.uid,

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
            topics,

        testsHistory:
            testsHistory

    };

}


// =====================================================
// TOPIC KEY
// =====================================================

function getTopicKey(topic) {

    if (
        topic === "mixed"
    ) {

        return "mixed";

    }


    return topic || "addition";

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


// =====================================================
// REVIEW
// =====================================================

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
        divisor * answer;


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
            (a + b) * 100
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
// TIME QUESTION
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

    return array.sort(
        () =>
            Math.random() - 0.5
    );

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
        emojis[topic] ||
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
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    let date;


    // Firebase Timestamp
    if (
        typeof dateValue.toDate ===
        "function"
    ) {

        date =
            dateValue.toDate();

    }
    else {

        date =
            new Date(
                dateValue
            );

    }


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
// LOGIN ERROR
// =====================================================

function showLoginError(
    message
) {

    showError(
        "loginError",
        message
    );

}


function clearLoginError() {

    clearError(
        "loginError"
    );

}


// =====================================================
// REGISTER ERROR
// =====================================================

function showRegisterError(
    message
) {

    showError(
        "registerError",
        message
    );

}


function clearRegisterError() {

    clearError(
        "registerError"
    );

}


// =====================================================
// GENERIC ERROR
// =====================================================

function showError(
    elementId,
    message
) {

    const element =
        getElement(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.remove(
        "hidden"
    );

}


// =====================================================
// CLEAR ERROR
// =====================================================

function clearError(
    elementId
) {

    const element =
        getElement(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        "";


    element.classList.add(
        "hidden"
    );

}

// =====================================================
// GLOBAL HTML HANDLERS
// =====================================================
// app.js is an ES module, so functions are not automatically
// available to inline onclick="" handlers in index.html.

window.showCreateProfile = showCreateProfile;
window.showLogin = showLogin;
window.showDashboard = showDashboard;
window.showPracticeSetup = showPracticeSetup;
window.showProgress = showProgress;
window.showProfile = showProfile;

window.createStudentProfile = createStudentProfile;
window.loginStudent = loginStudent;
window.logoutStudent = logoutStudent;

window.selectAvatar = selectAvatar;
window.selectAnswer = selectAnswer;

window.startTest = startTest;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.finishTest = finishTest;
