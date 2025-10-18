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
  else if (type === "ohlc") series = chart.addOHLCSeries();
  else series = chart.addCandlestickSeries();

  loadData(symbol);
}

// LoadData (uses your API keys)
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

    // Stocks
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

    // Gold
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
