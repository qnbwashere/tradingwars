const leaderboardList = document.getElementById("leaderboardList");

// Mock leaderboard
let leaderboard = [
  { user: "Alice", balance: 120000 },
  { user: "Bob", balance: 115000 },
  { user: "You", balance: 100000 },
];

function renderLeaderboard() {
  leaderboardList.innerHTML = "";
  leaderboard.sort((a, b) => b.balance - a.balance);
  leaderboard.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.user}: $${user.balance.toFixed(2)}`;
    leaderboardList.appendChild(li);
  });
}

renderLeaderboard();
