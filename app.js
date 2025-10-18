// ===== Supabase setup (use your own keys later) =====
const supabaseUrl = "https://example.supabase.co";
const supabaseKey = "public-anon-key";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ====== DOM elements ======
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");

// ====== Simple Login ======
loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
  });
  if (error) alert("Login failed: " + error.message);
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  dashboard.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// ====== Chart setup ======
let chart, candleSeries;

function createChart() {
  const container = document.getElementById("chart-container");
  container.innerHTML = "";
  chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: 400,
    layout: {
      background: { color: "#0d1117" },
      textColor: "#e6edf3",
    },
    grid: {
      vertLines: { color: "#161b22" },
      horzLines: { color: "#161b22" },
    },
  });
  candleSeries = chart.addCandlestickSeries();
  loadChartData();
}

async function loadChartData() {
  try {
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
    candleSeries.setData(formatted);
  } catch (e) {
    console.error("Chart load error:", e);
  }
}

// ====== Price cards ======
async function loadPrices() {
  const pricesDiv = document.getElementById("prices");
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd"
    );
    const data = await res.json();
    pricesDiv.innerHTML = `
      <div>BTC: $${data.bitcoin.usd}</div>
      <div>ETH: $${data.ethereum.usd}</div>
      <div>SOL: $${data.solana.usd}</div>
    `;
  } catch (e) {
    pricesDiv.textContent = "Failed to load prices.";
  }
}

// ====== Pine-style script runner ======
document.getElementById("runScriptBtn").addEventListener("click", () => {
  const code = document.getElementById("pineEditor").value.trim();
  if (!code) return alert("Enter a script first!");
  alert("This will soon run Pine-style indicators.\n(Currently placeholder)");
});

// ====== Start button ======
startBtn.addEventListener("click", () => {
  welcome.classList.add("hidden");
  dashboard.classList.remove("hidden");
  createChart();
  loadPrices();
});
