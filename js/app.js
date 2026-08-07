document.addEventListener("DOMContentLoaded", () => {
  const start = document.querySelector(".btn");
  if (start && start.textContent.includes("Open Dashboard")) {
    console.log("Study dashboard loaded.");
  }
});
