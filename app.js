// Initialize Supabase
const SUPABASE_URL = "https://xymgwhnskyyerwqihkqn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bWd3aG5za3l5ZXJ3cWloa3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTE3NjUsImV4cCI6MjA3NjI4Nzc2NX0._s2xAT_HsXMvKiBX_yaQblx0bQJRoc_FCUYS5wlsQw4";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const startBtn = document.getElementById("startBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const pricesDiv = document.getElementById("prices");

// Login or signup popup
loginBtn.addEventListener("click", async () => {
  const email = prompt("Enter your email:");
  const { data, error } = await supabaseClient.auth.signInWithOtp({ email });
  if (error) alert(error.message);
  else alert("Check your email for a login link!");
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  dashboard.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// Show market data
startBtn.addEventListener("click", async () => {
  welcome.classList.add("hidden");
  dashboard.classList.remove("hidden");
  fetchPrices();
  setInterval(fetchPrices, 10000);
});

// Demo live market data (sandbox)
async function fetchPrices() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,nasdaq-100,tesla&vs_currencies=usd");
    const data = await response.json();
    pricesDiv.innerHTML = "";

    Object.entries(data).forEach(([symbol, info]) => {
      const div = document.createElement("div");
      div.classList.add("price-card");
      div.innerHTML = `
        <h3>${symbol.toUpperCase()}</h3>
        <p>$${info.usd}</p>
      `;
      pricesDiv.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching prices:", err);
  }
}
