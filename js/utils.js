/*
=================================================
Math Learning Center
utils.js (Improved Version)
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
   Deep Clone
--------------------------------------------- */
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
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
   Debug Logger (toggleable)
--------------------------------------------- */
const DEBUG = true;

function log(...msg) {
    if (DEBUG) console.log("[MLC]", ...msg);
}

log("utils.js loaded");
