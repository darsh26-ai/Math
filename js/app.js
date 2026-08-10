/* =========================================================
   MATH ADVENTURE
   Firebase Authentication + Firestore
   LocalStorage fallback
   Grades 1–7
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

let firebase = null;
let firebaseReady = false;
let firebaseUser = null;


/*
   Firebase is loaded dynamically so the app can continue
   using LocalStorage if Firebase is unavailable.
*/
async function loadFirebase() {
    try {
        firebase = await import("./firebase.js");

        firebaseReady =
            !!firebase.auth &&
            !!firebase.db;

        if (firebaseReady) {
            console.log("Firebase loaded successfully.");
        }
    }
    catch (error) {
        firebaseReady = false;

        console.warn(
            "Firebase unavailable. Using localStorage fallback.",
            error
        );
    }
}


/* =========================================================
   GLOBAL STATE
========================================================= */

let selectedTopic = "mixed";
let selectedAvatar = "🧑‍🚀";

let questions = [];
let answers = [];

let currentQuestion = 0;

let testTimer = null;
let remainingSeconds = 0;

let currentTestStart = null;
let currentTestGrade = null;
let currentAnswerType = "choice";

let testFinished = false;


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const STUDENTS_KEY = "mathAdventureStudents";
const CURRENT_STUDENT_KEY = "mathAdventureCurrentStudent";
const ACTIVE_STUDENT_KEY = "mathAdventureActiveStudent";


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


async function initializeApp() {
    setupTopicButtons();

    await loadFirebase();

    if (firebaseReady) {
        initializeFirebaseAuth();
    }
    else {
        initializeLocalStorageMode();
    }
}


/* =========================================================
   FIREBASE AUTH STATE
========================================================= */

function initializeFirebaseAuth() {
    firebase.onAuthStateChanged(
        firebase.auth,
        async function (user) {

            firebaseUser = user || null;

            if (!user) {
                showLogin();
                return;
            }

            try {
                const student =
                    await getFirebaseStudent(user.uid);

                if (!student) {
                    console.warn(
                        "Firebase account exists but student profile is missing."
                    );

                    await firebase.signOut(
                        firebase.auth
                    );

                    showLogin();
                    return;
                }

                setActiveStudentCache(student);
                showDashboard();
            }
            catch (error) {
                console.error(
                    "Firebase profile loading error:",
                    error
                );

                const cached =
                    getActiveStudentCache();

                if (cached) {
                    showDashboard();
                }
                else {
                    showLogin();
                }
            }
        }
    );
}


/* =========================================================
   LOCAL STORAGE INITIALIZATION
========================================================= */

function initializeLocalStorageMode() {
    const student =
        getLocalCurrentStudent();

    if (student) {
        showDashboard();
    }
    else {
        showLogin();
    }
}


/* =========================================================
   STUDENT STORAGE
========================================================= */

function getLocalStudents() {
    try {
        return JSON.parse(
            localStorage.getItem(STUDENTS_KEY)
        ) || [];
    }
    catch (error) {
        console.error(
            "Could not read local students:",
            error
        );

        return [];
    }
}


function saveLocalStudents(students) {
    try {
        localStorage.setItem(
            STUDENTS_KEY,
            JSON.stringify(students)
        );
    }
    catch (error) {
        console.error(
            "Could not save local students:",
            error
        );
    }
}


function getLocalCurrentStudent() {
    const name =
        localStorage.getItem(
            CURRENT_STUDENT_KEY
        );

    if (!name) {
        return null;
    }

    const students =
        getLocalStudents();

    return students.find(
        student =>
            String(student.name)
                .toLowerCase() ===
            String(name)
                .toLowerCase()
    ) || null;
}


function setLocalCurrentStudent(name) {
    localStorage.setItem(
        CURRENT_STUDENT_KEY,
        name
    );
}


function clearLocalCurrentStudent() {
    localStorage.removeItem(
        CURRENT_STUDENT_KEY
    );
}


/* =========================================================
   ACTIVE STUDENT CACHE
========================================================= */

function setActiveStudentCache(student) {
    if (!student) {
        return;
    }

    try {
        localStorage.setItem(
            ACTIVE_STUDENT_KEY,
            JSON.stringify(student)
        );
    }
    catch (error) {
        console.error(
            "Could not cache active student:",
            error
        );
    }
}


function getActiveStudentCache() {
    try {
        return JSON.parse(
            localStorage.getItem(
                ACTIVE_STUDENT_KEY
            )
        );
    }
    catch {
        return null;
    }
}


function clearActiveStudentCache() {
    localStorage.removeItem(
        ACTIVE_STUDENT_KEY
    );
}


/* =========================================================
   CURRENT STUDENT
========================================================= */

function getCurrentStudent() {
    if (firebaseReady && firebaseUser) {
        const cached =
            getActiveStudentCache();

        if (cached) {
            return cached;
        }
    }

    const local =
        getLocalCurrentStudent();

    if (local) {
        return local;
    }

    return getActiveStudentCache();
}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

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

    screens.forEach(id => {
        const element =
            document.getElementById(id);

        if (element) {
            element.classList.add("hidden");
        }
    });
}


/* =========================================================
   LOGIN SCREEN
========================================================= */

function showLogin() {
    clearInterval(testTimer);

    hideAllScreens();

    const screen =
        document.getElementById("loginScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    updateHeader();
    clearLoginError();
}


/* =========================================================
   CREATE PROFILE SCREEN
========================================================= */

function showCreateProfile() {
    hideAllScreens();

    const screen =
        document.getElementById("profileScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    clearProfileError();
    resetAvatarSelection();
}


/* =========================================================
   DASHBOARD
========================================================= */

function showDashboard() {
    const student =
        getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    clearInterval(testTimer);

    hideAllScreens();

    const screen =
        document.getElementById("dashboardScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    updateDashboard();
    updateHeader();
}


/* =========================================================
   PRACTICE SETUP
========================================================= */

function showPracticeSetup() {
    const student =
        getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    hideAllScreens();

    const screen =
        document.getElementById("setupScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    setGradeFromProfile();
}


/* =========================================================
   PROGRESS
========================================================= */

function showProgress() {
    const student =
        getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    hideAllScreens();

    const screen =
        document.getElementById("progressScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    updateProgressScreen();
}


/* =========================================================
   PROFILE VIEW
========================================================= */

function showProfile() {
    const student =
        getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    hideAllScreens();

    const screen =
        document.getElementById("profileViewScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    updateProfileScreen();
}


/* =========================================================
   HEADER
========================================================= */

function updateHeader() {
    const student =
        getCurrentStudent();

    const headerStudent =
        document.getElementById("headerStudent");

    if (!headerStudent) {
        return;
    }

    if (!student) {
        headerStudent.classList.add("hidden");
        return;
    }

    headerStudent.classList.remove("hidden");

    const avatar =
        document.getElementById("headerAvatar");

    const name =
        document.getElementById("headerStudentName");

    if (avatar) {
        avatar.textContent =
            student.avatar || "🧑‍🚀";
    }

    if (name) {
        name.textContent =
            student.name || "Student";
    }
}


/* =========================================================
   CREATE STUDENT PROFILE
========================================================= */

async function createStudentProfile() {
    clearProfileError();

    const nameInput =
        document.getElementById("profileName");

    const pinInput =
        document.getElementById("profilePin");

    const gradeInput =
        document.getElementById("profileGrade");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const pin =
        pinInput
            ? pinInput.value.trim()
            : "";

    const grade =
        gradeInput
            ? parseInt(
                gradeInput.value,
                10
            )
            : 0;

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
        !Number.isInteger(grade) ||
        grade < 1 ||
        grade > 7
    ) {
        showProfileError(
            "Please select a grade."
        );
        return;
    }

    if (firebaseReady) {
        await createFirebaseStudent(
            name,
            pin,
            grade
        );
    }
    else {
        createLocalStudent(
            name,
            pin,
            grade
        );
    }
}


/* =========================================================
   FIREBASE STUDENT CREATION
========================================================= */

async function createFirebaseStudent(
    name,
    pin,
    grade
) {
    const email =
        createStudentEmail(name);

    try {
        const credential =
            await firebase.createUserWithEmailAndPassword(
                firebase.auth,
                email,
                pin
            );

        const user =
            credential.user;

        const profile = {
            name: name,
            grade: grade,
            avatar: selectedAvatar,
            email: email,

            createdAt:
                firebase.serverTimestamp(),

            tests: [],

            statistics: {
                tests: 0,
                correct: 0,
                questions: 0,
                accuracy: 0
            }
        };

        await firebase.setDoc(
            firebase.doc(
                firebase.db,
                "students",
                user.uid
            ),
            profile
        );

        firebaseUser = user;

        const localStudent = {
            uid: user.uid,
            name: name,
            grade: grade,
            avatar: selectedAvatar,
            email: email,
            tests: [],
            statistics: profile.statistics
        };

        setActiveStudentCache(
            localStudent
        );

        clearProfileForm();
        showDashboard();
    }
    catch (error) {
        console.error(
            "Firebase profile creation error:",
            error
        );

        /*
           Network failure falls back to LocalStorage.
        */
        if (
            error.code ===
            "auth/network-request-failed"
        ) {
            createLocalStudent(
                name,
                pin,
                grade
            );

            return;
        }

        let message =
            "Unable to create the student profile.";

        if (
            error.code ===
            "auth/email-already-in-use"
        ) {
            message =
                "A student with this name already exists. Please log in.";
        }
        else if (
            error.code ===
            "auth/weak-password"
        ) {
            message =
                "PIN must contain exactly 6 digits.";
        }
        else if (
            error.code ===
            "auth/invalid-email"
        ) {
            message =
                "Please choose a different student name.";
        }

        showProfileError(message);
    }
}


/* =========================================================
   LOCAL STUDENT CREATION
========================================================= */

function createLocalStudent(
    name,
    pin,
    grade
) {
    const students =
        getLocalStudents();

    const exists =
        students.some(
            student =>
                String(student.name)
                    .toLowerCase() ===
                name.toLowerCase()
        );

    if (exists) {
        showProfileError(
            "A student with this name already exists. Please log in."
        );

        return;
    }

    const student = {
        id: Date.now().toString(),

        name: name,
        pin: pin,
        grade: grade,
        avatar: selectedAvatar,

        createdAt:
            new Date().toISOString(),

        tests: [],

        statistics: {
            tests: 0,
            correct: 0,
            questions: 0,
            accuracy: 0
        }
    };

    students.push(student);

    saveLocalStudents(students);

    setLocalCurrentStudent(
        name
    );

    setActiveStudentCache(
        student
    );

    clearProfileForm();

    showDashboard();
}


/* =========================================================
   CREATE FIREBASE EMAIL
========================================================= */

function createStudentEmail(name) {
    let cleanName =
        name
            .trim()
            .toLowerCase()
            .replace(
                /[^a-z0-9]/g,
                ""
            );

    if (!cleanName) {
        cleanName = "student";
    }

    const suffix =
        Math.abs(
            hashString(name)
        );

    return (
        cleanName +
        suffix +
        "@mathadventure.app"
    );
}


/* =========================================================
   STRING HASH
========================================================= */

function hashString(value) {
    let hash = 0;

    for (
        let i = 0;
        i < value.length;
        i++
    ) {
        hash =
            (
                (
                    hash << 5
                ) -
                hash +
                value.charCodeAt(i)
            ) | 0;
    }

    return hash;
}


/* =========================================================
   LOGIN
========================================================= */

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

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const pin =
        pinInput
            ? pinInput.value.trim()
            : "";

    if (!name || !pin) {
        showLoginError(
            "Please enter your name and PIN."
        );

        return;
    }

    if (!/^\d{6}$/.test(pin)) {
        showLoginError(
            "Please enter your 6-digit PIN."
        );

        return;
    }

    if (firebaseReady) {
        await loginWithFirebase(
            name,
            pin
        );
    }
    else {
        loginWithLocalStorage(
            name,
            pin
        );
    }
}


/* =========================================================
   FIREBASE LOGIN
========================================================= */

async function loginWithFirebase(
    name,
    pin
) {
    const email =
        createStudentEmail(name);

    try {
        const credential =
            await firebase.signInWithEmailAndPassword(
                firebase.auth,
                email,
                pin
            );

        firebaseUser =
            credential.user;

        const student =
            await getFirebaseStudent(
                firebaseUser.uid
            );

        if (!student) {
            showLoginError(
                "Your account exists, but your student profile could not be found."
            );

            return;
        }

        setActiveStudentCache(student);

        clearLoginForm();

        showDashboard();
    }
    catch (error) {
        console.error(
            "Firebase login error:",
            error
        );

        if (
            error.code ===
            "auth/network-request-failed"
        ) {
            loginWithLocalStorage(
                name,
                pin
            );

            return;
        }

        showLoginError(
            "Student name or PIN is incorrect."
        );
    }
}


/* =========================================================
   LOCAL LOGIN
========================================================= */

function loginWithLocalStorage(
    name,
    pin
) {
    const students =
        getLocalStudents();

    const student =
        students.find(
            item =>
                String(item.name)
                    .toLowerCase() ===
                name.toLowerCase() &&
                String(item.pin) ===
                String(pin)
        );

    if (!student) {
        showLoginError(
            "Student name or PIN is incorrect."
        );

        return;
    }

    setLocalCurrentStudent(
        student.name
    );

    setActiveStudentCache(
        student
    );

    clearLoginForm();

    showDashboard();
}


/* =========================================================
   FIRESTORE STUDENT
========================================================= */

async function getFirebaseStudent(uid) {
    const snapshot =
        await firebase.getDoc(
            firebase.doc(
                firebase.db,
                "students",
                uid
            )
        );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        uid: uid,
        ...snapshot.data()
    };
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutStudent() {
    clearInterval(testTimer);

    questions = [];
    answers = [];

    currentQuestion = 0;
    currentTestGrade = null;
    currentTestStart = null;

    testFinished = false;

    if (
        firebaseReady &&
        firebase.auth.currentUser
    ) {
        try {
            await firebase.signOut(
                firebase.auth
            );
        }
        catch (error) {
            console.error(
                "Firebase logout error:",
                error
            );
        }
    }

    firebaseUser = null;

    clearActiveStudentCache();
    clearLocalCurrentStudent();

    showLogin();
}


/* =========================================================
   AVATAR
========================================================= */

function selectAvatar(button) {
    if (!button) {
        return;
    }

    document
        .querySelectorAll(".avatar-btn")
        .forEach(btn => {
            btn.classList.remove(
                "selected"
            );
        });

    button.classList.add("selected");

    selectedAvatar =
        button.dataset.avatar ||
        "🧑‍🚀";
}


/* =========================================================
   RESET AVATAR
========================================================= */

function resetAvatarSelection() {
    selectedAvatar = "🧑‍🚀";

    const buttons =
        document.querySelectorAll(
            ".avatar-btn"
        );

    buttons.forEach(button => {
        button.classList.remove(
            "selected"
        );

        if (
            button.dataset.avatar ===
            selectedAvatar
        ) {
            button.classList.add(
                "selected"
            );
        }
    });
}


/* =========================================================
   CLEAR FORMS
========================================================= */

function clearProfileForm() {
    const name =
        document.getElementById(
            "profileName"
        );

    const pin =
        document.getElementById(
            "profilePin"
        );

    if (name) {
        name.value = "";
    }

    if (pin) {
        pin.value = "";
    }

    resetAvatarSelection();
}


function clearLoginForm() {
    const name =
        document.getElementById(
            "loginStudentName"
        );

    const pin =
        document.getElementById(
            "loginPin"
        );

    if (name) {
        name.value = "";
    }

    if (pin) {
        pin.value = "";
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

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
        "Grade " + student.grade
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

    renderRecentTests(student);
}


/* =========================================================
   PROFILE SCREEN
========================================================= */

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
        "Grade " + student.grade
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


/* =========================================================
   STATISTICS
========================================================= */

function calculateStudentStats(student) {
    const tests =
        Array.isArray(student.tests)
            ? student.tests
            : [];

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
        Math.max(...scores);

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

    return {
        tests: tests.length,
        average: average,
        best: best,
        questions: questions
    };
}


/* =========================================================
   RECENT TESTS
========================================================= */

function renderRecentTests(student) {
    const container =
        document.getElementById(
            "recentTests"
        );

    if (!container) {
        return;
    }

    const tests =
        Array.isArray(student.tests)
            ? student.tests
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
            .map(test => `
                <div class="recent-test">

                    <div class="recent-test-left">

                        <strong>
                            ${getTopicEmoji(test.topic)}
                            ${escapeHTML(
                                test.topic ||
                                "Math Practice"
                            )}
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
                        ${escapeHTML(test.percentage)}%
                    </div>

                </div>
            `)
            .join("");
}


/* =========================================================
   PROGRESS SCREEN
========================================================= */

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

    setText(
        "progressAvatar",
        student.avatar || "🧑‍🚀"
    );

    setText(
        "progressOverall",
        stats.average + "%"
    );

    const bar =
        document.getElementById(
            "overallProgressBar"
        );

    if (bar) {
        bar.style.width =
            stats.average + "%";
    }

    renderTopicPerformance(student);
    renderTestHistory(student);
}


/* =========================================================
   TOPIC PERFORMANCE
========================================================= */

function renderTopicPerformance(student) {
    const container =
        document.getElementById(
            "topicPerformance"
        );

    if (!container) {
        return;
    }

    const tests =
        Array.isArray(student.tests)
            ? student.tests
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

    const rows =
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

    container.innerHTML = rows;
}


/* =========================================================
   TEST HISTORY
========================================================= */

function renderTestHistory(student) {
    const container =
        document.getElementById(
            "testHistory"
        );

    if (!container) {
        return;
    }

    const tests =
        Array.isArray(student.tests)
            ? student.tests
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
   GRADE
========================================================= */

function setGradeFromProfile() {
    const student =
        getCurrentStudent();

    if (!student) {
        return;
    }

    const select =
        document.getElementById(
            "gradeSelect"
        );

    if (select) {
        select.value =
            String(student.grade);
    }
}


/* =========================================================
   TOPIC BUTTONS
========================================================= */

function setupTopicButtons() {
    const buttons =
        document.querySelectorAll(
            ".topic-btn"
        );

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            function () {

                buttons.forEach(btn => {
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
   START TEST
========================================================= */

function startTest() {
    const student =
        getCurrentStudent();

    if (!student) {
        showLogin();
        return;
    }

    const gradeSelect =
        document.getElementById(
            "gradeSelect"
        );

    const countSelect =
        document.getElementById(
            "questionCount"
        );

    const timeSelect =
        document.getElementById(
            "timeLimit"
        );

    const answerSelect =
        document.getElementById(
            "answerType"
        );

    if (
        !gradeSelect ||
        !countSelect ||
        !timeSelect ||
        !answerSelect
    ) {
        console.error(
            "Practice setup controls are missing."
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
            countSelect.value,
            10
        );

    const minutes =
        parseInt(
            timeSelect.value,
            10
        );

    const answerType =
        answerSelect.value;

    if (
        !Number.isInteger(grade) ||
        grade < 1 ||
        grade > 7
    ) {
        return;
    }

    if (
        !Number.isInteger(count) ||
        count < 1
    ) {
        return;
    }

    questions = [];
    answers = [];

    currentQuestion = 0;

    currentTestGrade =
        grade;

    currentAnswerType =
        answerType;

    currentTestStart =
        new Date();

    testFinished = false;

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

    const screen =
        document.getElementById(
            "testScreen"
        );

    if (screen) {
        screen.classList.remove(
            "hidden"
        );
    }

    if (minutes > 0) {
        remainingSeconds =
            minutes * 60;

        startTimer();
    }
    else {
        clearInterval(testTimer);

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
    clearInterval(testTimer);

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

                    if (!testFinished) {
                        alert(
                            "⏰ Time is up!"
                        );

                        finishTest();
                    }
                }
            },
            1000
        );
}


/* =========================================================
   TIMER DISPLAY
========================================================= */

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

        timer.classList.add(
            "warning"
        );

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
            .padStart(2, "0");

    timer.classList.toggle(
        "warning",
        remainingSeconds <= 60
    );
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

    if (topic === "mixed") {
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
                additionQuestion(grade);
            break;

        case "subtraction":
            question =
                subtractionQuestion(grade);
            break;

        case "multiplication":
            question =
                multiplicationQuestion(grade);
            break;

        case "division":
            question =
                divisionQuestion(grade);
            break;

        case "fractions":
            question =
                fractionQuestion(grade);
            break;

        case "decimals":
            question =
                decimalQuestion(grade);
            break;

        case "word":
            question =
                wordQuestion(grade);
            break;

        case "time":
            question =
                timeQuestion(grade);
            break;

        case "comparison":
            question =
                comparisonQuestion(grade);
            break;

        default:
            question =
                additionQuestion(grade);
    }

    if (answerType === "choice") {
        question.answerMode =
            "choice";
    }
    else if (answerType === "blank") {
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
        questions[currentQuestion];

    if (!q) {
        return;
    }

    setText(
        "progressText",
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length
    );

    const progressBar =
        document.getElementById(
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

    if (q.type === "Time") {
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

    if (q.answerMode === "choice") {
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
        html += `
            <div class="answer-grid">
        `;

        q.options.forEach(option => {
            const selected =
                String(
                    answers[currentQuestion]
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
        });

        html += `
            </div>
        `;
    }
    else {
        const existing =
            answers[currentQuestion] || "";

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

    container
        .querySelectorAll(".answer-btn")
        .forEach(button => {
            button.addEventListener(
                "click",
                function () {
                    selectAnswer(
                        this,
                        this.dataset.answer
                    );
                }
            );
        });

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
                    event.key ===
                    "Enter"
                ) {
                    event.preventDefault();
                    nextQuestion();
                }
            }
        );
    }

    updateNavigationButtons();
}


/* =========================================================
   NAVIGATION BUTTONS
========================================================= */

function updateNavigationButtons() {
    const buttons =
        document.querySelectorAll(
            ".navigation .nav-btn"
        );

    if (buttons.length < 2) {
        return;
    }

    const previous =
        buttons[0];

    const next =
        buttons[1];

    previous.disabled =
        currentQuestion === 0;

    next.textContent =
        currentQuestion ===
        questions.length - 1
            ? "Finish ➡"
            : "Next ➡";
}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(
    button,
    value
) {
    document
        .querySelectorAll(".answer-btn")
        .forEach(btn => {
            btn.classList.remove(
                "selected"
            );
        });

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


/* =========================================================
   SAVE TEXT ANSWER
========================================================= */

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
    if (testFinished) {
        return;
    }

    testFinished = true;

    saveTextAnswer();

    clearInterval(testTimer);

    if (!questions.length) {
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

    const testRecord = {
        id:
            Date.now().toString(),

        date:
            new Date().toISOString(),

        grade:
            currentTestGrade,

        topic:
            getTestTopicName(),

        correct:
            correct,

        totalQuestions:
            questions.length,

        percentage:
            percentage
    };

    await saveTestResult(
        student,
        testRecord
    );

    const updatedStudent =
        addTestToStudentCache(
            student,
            testRecord
        );

    setActiveStudentCache(
        updatedStudent
    );

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

    if (percentage >= 90) {
        message =
            "🏆 Amazing! You are a Math Superstar!";
    }
    else if (percentage >= 75) {
        message =
            "🌟 Great Job! Keep practicing!";
    }
    else if (percentage >= 60) {
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


/* =========================================================
   SAVE TEST RESULT
========================================================= */

async function saveTestResult(
    student,
    testRecord
) {
    if (
        firebaseReady &&
        student.uid
    ) {
        try {
            const current =
                await getFirebaseStudent(
                    student.uid
                );

            if (!current) {
                throw new Error(
                    "Firebase student profile not found."
                );
            }

            const tests =
                Array.isArray(current.tests)
                    ? current.tests.slice()
                    : [];

            tests.push(testRecord);

            const statistics =
                calculateStatisticsFromTests(
                    tests
                );

            await firebase.updateDoc(
                firebase.doc(
                    firebase.db,
                    "students",
                    student.uid
                ),
                {
                    tests: tests,
                    statistics: statistics,
                    updatedAt:
                        firebase.serverTimestamp()
                }
            );

            return true;
        }
        catch (error) {
            console.error(
                "Firebase test save failed. Using local fallback:",
                error
            );
        }
    }

    saveLocalTestResult(
        student.name,
        testRecord
    );

    return true;
}


/* =========================================================
   LOCAL TEST SAVE
========================================================= */

function saveLocalTestResult(
    studentName,
    testRecord
) {
    const students =
        getLocalStudents();

    const index =
        students.findIndex(
            student =>
                String(student.name)
                    .toLowerCase() ===
                String(studentName)
                    .toLowerCase()
        );

    if (index === -1) {
        return;
    }

    if (
        !Array.isArray(
            students[index].tests
        )
    ) {
        students[index].tests = [];
    }

    students[index].tests.push(
        testRecord
    );

    students[index].statistics =
        calculateStatisticsFromTests(
            students[index].tests
        );

    saveLocalStudents(
        students
    );

    setLocalCurrentStudent(
        students[index].name
    );
}


/* =========================================================
   UPDATE STUDENT CACHE
========================================================= */

function addTestToStudentCache(
    student,
    testRecord
) {
    const updated = {
        ...student
    };

    updated.tests =
        Array.isArray(student.tests)
            ? student.tests.slice()
            : [];

    const exists =
        updated.tests.some(
            test =>
                test.id ===
                testRecord.id
        );

    if (!exists) {
        updated.tests.push(
            testRecord
        );
    }

    updated.statistics =
        calculateStatisticsFromTests(
            updated.tests
        );

    return updated;
}


/* =========================================================
   CALCULATE FIREBASE STATISTICS
========================================================= */

function calculateStatisticsFromTests(
    tests
) {
    const safeTests =
        Array.isArray(tests)
            ? tests
            : [];

    let correct = 0;
    let questions = 0;

    safeTests.forEach(test => {
        correct +=
            Number(
                test.correct
            ) || 0;

        questions +=
            Number(
                test.totalQuestions
            ) || 0;
    });

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
            safeTests.length,

        correct:
            correct,

        questions:
            questions,

        accuracy:
            accuracy
    };
}


/* =========================================================
   TEST TOPIC
========================================================= */

function getTestTopicName() {
    const names = {
        mixed:
            "Mixed Practice",

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
        names[selectedTopic] ||
        "Math Practice"
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
        !Number.isNaN(correctNumber)
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


/* =========================================================
   REVIEW
========================================================= */

function createReview() {
    const container =
        document.getElementById(
            "reviewContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    questions.forEach(
        (q, index) => {
            const rawUserAnswer =
                answers[index];

            const userAnswer =
                rawUserAnswer === undefined ||
                rawUserAnswer === ""
                    ? "No Answer"
                    : rawUserAnswer;

            const correct =
                isCorrectAnswer(
                    rawUserAnswer,
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
                        ${escapeHTML(userAnswer)}
                    </span>
                </div>

                ${
                    correct
                        ? ""
                        : `
                            <div>
                                Correct answer:

                                <span class="correct-answer">
                                    ${escapeHTML(q.answer)}
                                </span>
                            </div>
                        `
                }
            `;

            container.appendChild(div);
        }
    );
}


/* =========================================================
   AVAILABLE TOPICS
========================================================= */

function getAvailableTopics(grade) {
    if (grade === 1) {
        return [
            "addition",
            "subtraction",
            "time",
            "comparison",
            "word"
        ];
    }

    if (grade === 2) {
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

    if (grade === 3) {
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

function additionQuestion(grade) {
    const max =
        grade === 1
            ? 20
            : grade === 2
                ? 100
                : grade === 3
                    ? 1000
                    : grade === 4
                        ? 10000
                        : grade === 5
                            ? 100000
                            : 1000000;

    const a =
        randomInt(1, max);

    const b =
        randomInt(1, max);

    const answer =
        a + b;

    return {
        type: "Addition",

        question:
            `${a} + ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(answer)
    };
}


/* =========================================================
   SUBTRACTION
========================================================= */

function subtractionQuestion(grade) {
    const max =
        grade === 1
            ? 20
            : grade === 2
                ? 100
                : grade === 3
                    ? 1000
                    : grade === 4
                        ? 10000
                        : grade === 5
                            ? 100000
                            : 1000000;

    const a =
        randomInt(1, max);

    const b =
        randomInt(1, a);

    const answer =
        a - b;

    return {
        type: "Subtraction",

        question:
            `${a} − ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(answer)
    };
}


/* =========================================================
   MULTIPLICATION
========================================================= */

function multiplicationQuestion(grade) {
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
        randomInt(1, maxA);

    const b =
        randomInt(1, maxB);

    const answer =
        a * b;

    return {
        type: "Multiplication",

        question:
            `${a} × ${b} = ?`,

        answer: answer,

        options:
            makeNumberOptions(answer)
    };
}


/* =========================================================
   DIVISION
========================================================= */

function divisionQuestion(grade) {
    const divisorMax =
        grade <= 2
            ? 5
            : grade === 3
                ? 10
                : grade <= 5
                    ? 20
                    : 50;

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
            makeNumberOptions(answer)
    };
}


/* =========================================================
   FRACTIONS
========================================================= */

function fractionQuestion(grade) {
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

    if (grade <= 4) {
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
        randomInt(1, 9);

    const d2 =
        randomInt(2, 10);

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

        answer: answer,

        options:
            makeNumberOptions(answer)
    };
}


/* =========================================================
   DECIMALS
========================================================= */

function decimalQuestion(grade) {
    const max =
        grade <= 5
            ? 99
            : 999;

    const a =
        randomInt(
            1,
            max
        ) / 10;

    const b =
        randomInt(
            1,
            max
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
            makeNumberOptions(answer)
    };
}


/* =========================================================
   WORD PROBLEM
========================================================= */

function wordQuestion(grade) {
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
        randomInt(1, 4);

    let a;
    let b;
    let answer;
    let question;

    if (operation === 1) {
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
    else if (operation === 2) {
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
    else if (operation === 3) {
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
            makeNumberOptions(answer)
    };
}


/* =========================================================
   TIME QUESTION
========================================================= */

function timeQuestion(grade) {
    const hour =
        randomInt(1, 12);

    let minute;

    if (grade <= 2) {
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
        String(minute)
            .padStart(2, "0")
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

    let safety = 0;

    while (
        options.length < 4 &&
        safety < 100
    ) {
        safety++;

        const h =
            randomInt(1, 12);

        const m =
            randomInt(0, 11) * 5;

        const value =
            formatTime(h, m);

        if (
            !options.includes(value)
        ) {
            options.push(value);
        }
    }

    return shuffle(options);
}


/* =========================================================
   NUMBER OPTIONS
========================================================= */

function makeNumberOptions(answer) {
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

        const magnitude =
            Math.max(
                1,
                Math.floor(
                    Math.abs(
                        numeric
                    ) * 0.2
                )
            );

        const difference =
            randomInt(
                1,
                Math.max(
                    5,
                    magnitude
                )
            );

        const value =
            numeric +
            (
                Math.random() < 0.5
                    ? -difference
                    : difference
            );

        if (
            value >= 0 &&
            !options.includes(value)
        ) {
            options.push(value);
        }
    }

    while (
        options.length < 4
    ) {
        let value =
            numeric +
            options.length;

        while (
            options.includes(value)
        ) {
            value++;
        }

        options.push(value);
    }

    return shuffle(
        options.map(String)
    );
}


/* =========================================================
   COMPARISON
========================================================= */

function comparisonQuestion(grade) {
    const max =
        grade <= 2
            ? 50
            : grade <= 4
                ? 1000
                : 100000;

    const a =
        randomInt(1, max);

    const b =
        randomInt(1, max);

    let answer;

    if (a > b) {
        answer = ">";
    }
    else if (a < b) {
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


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {
    const result =
        array.slice();

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
   RANDOM INTEGER
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
    if (percentage === 100) {
        return "🏆 Perfect Score!";
    }

    if (percentage >= 90) {
        return "🌟 Math Superstar!";
    }

    if (percentage >= 80) {
        return "🥇 Excellent Work!";
    }

    if (percentage >= 70) {
        return "🥈 Great Progress!";
    }

    if (percentage >= 60) {
        return "🥉 Keep Going!";
    }

    return "💪 Practice Makes Progress!";
}


/* =========================================================
   TOPIC EMOJI
========================================================= */

function getTopicEmoji(topic) {
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

function getScoreColor(score) {
    if (score >= 90) {
        return "#10b981";
    }

    if (score >= 70) {
        return "#4f8cff";
    }

    if (score >= 50) {
        return "#f59e0b";
    }

    return "#ef4444";
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    let date;

    /*
       Firestore Timestamp support
    */
    if (
        dateString &&
        typeof dateString.toDate ===
        "function"
    ) {
        date =
            dateString.toDate();
    }
    else {
        date =
            new Date(dateString);
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
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {
    return String(
        value ?? ""
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
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }
}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(message) {
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


function clearLoginError() {
    const error =
        document.getElementById(
            "loginError"
        );

    if (error) {
        error.textContent = "";

        error.classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   PROFILE ERROR
========================================================= */

function showProfileError(message) {
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


function clearProfileError() {
    const error =
        document.getElementById(
            "profileError"
        );

    if (error) {
        error.textContent = "";

        error.classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   INLINE HTML EVENT HANDLERS
=========================================================

   app.js is loaded as a JavaScript module.

   Module functions are not automatically available
   to inline onclick="..." attributes.

   Therefore expose the functions used by index.html
   through window.
========================================================= */

window.showCreateProfile =
    showCreateProfile;

window.showLogin =
    showLogin;

window.loginStudent =
    loginStudent;

window.createStudentProfile =
    createStudentProfile;

window.selectAvatar =
    selectAvatar;

window.logoutStudent =
    logoutStudent;

window.showDashboard =
    showDashboard;

window.showProgress =
    showProgress;

window.showProfile =
    showProfile;

window.showPracticeSetup =
    showPracticeSetup;

window.startTest =
    startTest;

window.nextQuestion =
    nextQuestion;

window.previousQuestion =
    previousQuestion;

window.finishTest =
    finishTest;

window.saveTextAnswer =
    saveTextAnswer;


/* =========================================================
   READY
========================================================= */

console.log(
    "Math Adventure app.js loaded successfully."
);
