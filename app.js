// ===== Supabase Config =====
const supabaseUrl = "https://xymgwhnskyyerwqihkqn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bWd3aG5za3l5ZXJ3cWloa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3NjUsImV4cCI6MjA3NjI4Nzc2NX0._s2xAT_HsXMvKiBX_yaQblx0bQJRoc_FCUYS5wlsQw4";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ===== DOM Elements =====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const symbolSelect = document.getElementById("symbolSelect");
const chartType = document.getElementById("chartType");
const pineBtn = document.getElementById("pineBtn");
const pineModal = document.getElementById("pineModal");
const closeModal = document.getElementById("closeModal");
const runScriptBtn = document.getElementById("runScriptBtn");

// ===== Auth =====
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

// Listen for auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    welcome.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    createChart(symbolSelect.value, chartType.value);
  }
});

// ===== Chart Setup =====
let chart, series;

function createChart(symbol, type) {
  const container = document.getElementById("chart-container");
  container.innerHTML = "";
  chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: 500,
    layout: { background: { color: "#0d1117" }, textColor: "#e6edf3" },
    grid: { vertLines: { color: "#161b22" }, horzLines: { color: "#161b22" } },
  });

  if (type === "line") series = chart.addLineSeries();
  else series = chart.addCandlestickSeries();

  loadData(symbol);
}

// ===== Load Data (Crypto + Stocks + Futures) =====
async function loadData(symbol) {
  let formatted = [];

  try {
    // Crypto
    if (symbol === "bitcoin" || symbol === "ethereum") {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=2`
      );
      const data = await res.json();
      formatted = data.prices.map(([time, price]) => ({
        time: Math.floor(time / 1000),
        open: price,
        high: price,
        low: price,
        close: price,
      }));
    }

    // Stocks (Yahoo RapidAPI)
    else if (symbol === "aapl" || symbol === "tsla") {
      const url = `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${symbol}/1d?diffandsplits=false`;
      const res = await fetch(url, {
        headers: {
          "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
          "x-rapidapi-key":
            "9e6c7e3257mshff8ea4839cf22fap18dad1jsne4196c91b4e7",
        },
      });
      const json = await res.json();
      if (json.items) {
        formatted = Object.entries(json.items).map(([time, ohlc]) => ({
          time: Math.floor(new Date(time).getTime() / 1000),
          open: parseFloat(ohlc.open),
          high: parseFloat(ohlc.high),
          low: parseFloat(ohlc.low),
          close: parseFloat(ohlc.close),
        }));
      }
    }

    // Gold / Futures (Polygon)
    else if (symbol === "gold") {
      const url = `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/range/1/hour/2024-10-01/2024-10-18?apiKey=d3pf4epr01qq6ml8hk9gd3pf4epr01qq6ml8hka0`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.results) {
        formatted = json.results.map((bar) => ({
          time: Math.floor(bar.t / 1000),
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
        }));
      }
    }

    if (formatted.length > 0) series.setData(formatted);
    else console.warn("No data returned for", symbol);
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// ===== UI Handlers =====
symbolSelect.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);
chartType.addEventListener("change", () =>
  createChart(symbolSelect.value, chartType.value)
);

startBtn.addEventListener("click", () => {
  alert("Please login first!");
});

// ===== Pine modal =====
pineBtn.addEventListener("click", () => pineModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => pineModal.classList.add("hidden"));
runScriptBtn.addEventListener("click", () =>
  alert("Pine engine coming soon!")
);
