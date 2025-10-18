// ==== DOM Elements ====
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const symbolSelect = document.getElementById("symbolSelect");
const chartType = document.getElementById("chartType");
const pineBtn = document.getElementById("pineBtn");
const pineModal = document.getElementById("pineModal");
const closeModal = document.getElementById("closeModal");

// Chart updates
symbolSelect.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);
chartType.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);

// Start trading after login
startBtn
