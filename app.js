// ==== Supabase Config (YOUR REAL INSTANCE) ====
const supabaseUrl = "https://xymgwhnskyyerwqihkqn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bWd3aG5za3l5ZXJ3cWloa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3NjUsImV4cCI6MjA3NjI4Nzc2NX0._s2xAT_HsXMvKiBX_yaQblx0bQJRoc_FCUYS5wlsQw4";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ==== Elements ====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const symbolSelect = document.getElementById("symbolSelect");
const chartType = document.getElementById("chartType");

// ==== Auth ====
loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
  });
  if (error) console.error(error);
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  dashboard.classList.add("hidden");
  welcome.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  loginBtn.classList.remove("hidden");
});

// Listen for auth
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    welcome.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    createChart(symbolSelect.value, chartType.value);
  }
});

// ==== Chart Setup ====
let chart, series;

function createChart(symbol, type) {
  const container = document.getElementById("chart-container");
  container.innerHTML = "";
  chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: 500,
    layout: { background: { color: "#0d1117" }, textColor: "#e6edf3" },
    grid: {
      vertLines: { color: "#161b22" },
      horzLines: { color: "#161b22" },
    },
  });
  if (type === "line") series = chart.addLineSeries();
  else series = chart.addCandlestickSeries();
  loadData(symbol);
}

async function loadData(symbol) {
  let apiUrl = "";
  if (symbol === "bitcoin" || symbol === "ethereum") {
    apiUrl = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=2`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    const formatted = data.prices.map(([time, price]) => ({
      time: Math.floor(time / 1000),
      open: price,
      high: price,
      low: price,
      close: price,
    }));
    series.setData(formatted);
  } else if (symbol === "aapl" || symbol === "tsla") {
    apiUrl = `https://api.api-ninjas.com/v1/stockprice?ticker=${symbol}`;
    const res = await fetch(apiUrl, {
      headers: { "X-Api-Key": "YOUR_API_NINJA_KEY" },
    });
    const data = await res.json();
    console.log(data);
  } else {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=2"
    );
    const data = await res.json();
    const formatted = data.prices.map(([time, price]) => ({
      time: Math.floor(time / 1000),
      open: price,
      high: price,
      low: price,
      close: price,
    }));
    series.setData(formatted);
  }
}

// ==== UI Handlers ====
symbolSelect.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);
chartType.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);
startBtn.addEventListener("click", () => {
  alert("Please login first!");
});

// ==== Pine modal ====
const pineBtn = document.getElementById("pineBtn");
const pineModal = document.getElementById("pineModal");
const closeModal = document.getElementById("closeModal");

pineBtn.addEventListener("click", () => pineModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => pineModal.classList.add("hidden"));
document
  .getElementById("runScriptBtn")
  .addEventListener("click", () => alert("Pine engine coming soon!"));
