let balance = 100000;
let pnl = 0;
const balanceEl = document.getElementById("balance");
const pnlEl = document.getElementById("pnl");
const tradeAmount = document.getElementById("tradeAmount");

document.getElementById("buyBtn").addEventListener("click", () => trade("buy"));
document.getElementById("sellBtn").addEventListener("click", () => trade("sell"));

function trade(type) {
  const amount = parseFloat(tradeAmount.value);
  if (!amount || amount <= 0) return alert("Enter a valid amount");
  if (type === "buy" && amount > balance) return alert("Insufficient balance");

  balance = type === "buy" ? balance - amount : balance + amount;
  pnl += type === "buy" ? 0 : amount * 0.01; // simple placeholder profit
  balanceEl.textContent = balance.toFixed(2);
  pnlEl.textContent = pnl.toFixed(2);
}
