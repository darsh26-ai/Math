/*
=================================================
Math Learning Center
utils.js (Improved Production Version)
=================================================
*/

/* ---------------------------------------------
   Safe DOM Getter
--------------------------------------------- */
function el(id) {
    return document.getElementById(id);
}

/* ---------------------------------------------
   Safe JSON Parse
--------------------------------------------- */
function safeJSON(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

/* ---------------------------------------------
   Deep Clone (Safe)
--------------------------------------------- */
function clone(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch {
        return obj;
    }
}

/* ---------------------------------------------
   Random Number Helper
--------------------------------------------- */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------------------------------------------
   Fisher-Yates Shuffle
--------------------------------------------- */
function shuffle(arr) {
    if (!Array.isArray(arr)) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* ---------------------------------------------
   Random Array Item
--------------------------------------------- */
function randomItem(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/* ---------------------------------------------
   Capitalize First Letter
--------------------------------------------- */
function capitalize(text) {
    if (!text || typeof text !== "string") return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ---------------------------------------------
   Format Number (commas)
--------------------------------------------- */
function formatNumber(num) {
    return Number(num).toLocaleString("en-US");
}

/* ---------------------------------------------
   Check if Value is Numeric
--------------------------------------------- */
function isNumber(value) {
    return !isNaN(Number(value));
}

/* ---------------------------------------------
   Normalize Answer (Matches quiz.js)
--------------------------------------------- */
function normalizeAnswer(value) {
    if (typeof value === "number") return Number(value);

    if (typeof value === "string") {
        const trimmed = value.trim();

        // Time format HH:MM → convert to minutes
        if (/^\d+:\d+$/.test(trimmed)) {
            const [h, m] = trimmed.split(":").map(Number);
            return h * 60 + m;
        }

        // Fraction format N/D → convert to decimal
        if (/^\d+\/\d+$/.test(trimmed)) {
            const [n, d] = trimmed.split("/").map(Number);
            return n / d;
        }

        // Numeric string
        if (isNumber(trimmed)) {
            return Number(trimmed);
        }

        return trimmed.toLowerCase();
    }

    return value;
}

/* ---------------------------------------------
   Format Time (HH:MM)
--------------------------------------------- */
function formatTime(hour, minute) {
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m}`;
}

/* ---------------------------------------------
   Debug Logger (toggleable)
--------------------------------------------- */
const DEBUG = true;

function log(...msg) {
    if (DEBUG) console.log("[MLC]", ...msg);
}

log("Improved utils.js loaded");
