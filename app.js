// ===== Supabase Config =====
const SUPABASE_URL = "https://xymgwhnskyyerwqihkqn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bWd3aG5za3l5ZXJ3cWloa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3NjUsImV4cCI6MjA3NjI4Nzc2NX0._s2xAT_HsXMvKiBX_yaQblx0bQJRoc_FCUYS5wlsQw4";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== DOM Elements =====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const pricesDiv = document.getElementById("prices");

// ===== Auth =====
loginBtn.addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  if (!email) return;
  const { error } = await supabaseClient.auth.signInWithOtp({ email });
  if (error) alert("Login failed: " + error.message);
  else alert("Check your email for a magic login link!");
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  dashboard.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// ===== Start Trading =====
startBtn.addEventListener("click", async () => {
  welcome.classList.add("hidden");
  dashboard.classList.remove("hidden");
  fetchPrices();
  setInterval(fetchPrices, 15000); // update every 15 seconds
});

// ===== Fetch Market Prices =====
async function fetchPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tesla,nasdaq-100&vs_currencies=usd"
    );
    const data = await response.json();
    pricesDiv.innerHTML = "";
    for (const [symbol, info] of Object.entries(data)) {
      const div = document.createElement("div");
      div.classList.add("price-card");
      div.innerHTML = `
        <h3>${symbol.toUpperCase()}</h3>
        <p>$${info.usd.toLocaleString()}</p>
      `;
      pricesDiv.appendChild(div);
    }
  } catch (err) {
    console.error("Error fetching prices:", err);
    pricesDiv.innerHTML = "<p>Error loading data.</p>";
  }
}
