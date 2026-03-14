import express from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const POPULAR_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JNJ", "V", "JPM", "WMT", "UNH", "PG", "HD", "MA", "BAC", "DIS", "ADBE", "CRM", "NFLX"];

function getSectorForTicker(ticker: string) {
  const sectors: Record<string, string> = {
    AAPL: 'Technology', MSFT: 'Technology', GOOGL: 'Technology', AMZN: 'Consumer Discretionary',
    META: 'Technology', TSLA: 'Consumer Discretionary', NVDA: 'Technology', JNJ: 'Healthcare',
    V: 'Financials', JPM: 'Financials', WMT: 'Consumer Discretionary', UNH: 'Healthcare',
    PG: 'Consumer Discretionary', HD: 'Consumer Discretionary', MA: 'Financials', BAC: 'Financials',
    DIS: 'Consumer Discretionary', ADBE: 'Technology', CRM: 'Technology', NFLX: 'Technology'
  };
  return sectors[ticker] || 'Other';
}

const INVESTING_QUOTES = [
  { text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.", author: "Philip Fisher" },
  { text: "In the short run, the market is a voting machine but in the long run, it is a weighing machine.", author: "Benjamin Graham" },
  { text: "Be fearful when others are greedy, and greedy when others are fearful.", author: "Warren Buffett" },
  { text: "The four most dangerous words in investing are: 'this time it's different.'", author: "Sir John Templeton" },
  { text: "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas.", author: "Paul Samuelson" },
  { text: "Know what you own, and know why you own it.", author: "Peter Lynch" },
  { text: "The individual investor should act consistently as an investor and not as a speculator.", author: "Benjamin Graham" },
  { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Time in the market beats timing the market.", author: "Ken Fisher" }
];

router.get("/quote", (req, res) => {
  const randomQuote = INVESTING_QUOTES[Math.floor(Math.random() * INVESTING_QUOTES.length)];
  res.json(randomQuote);
});

router.get("/indices", async (req, res) => {
  try {
    const symbols = ['^GSPC', '^IXIC', '^DJI', '^VIX'];
    const quotes = await yahooFinance.quote(symbols) as any[];
    
    const nameMap: Record<string, string> = {
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^DJI': 'DOW',
      '^VIX': 'VIX'
    };

    const indices = quotes.map(q => ({
      name: nameMap[q.symbol] || q.symbol,
      value: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0
    }));

    res.json(indices);
  } catch (error) {
    console.error("Error fetching indices:", error);
    
    // Fallback mock data
    const mockIndices = [
      { name: 'S&P 500', value: 5100, change: 10, changePercent: 0.2 },
      { name: 'NASDAQ', value: 16000, change: 50, changePercent: 0.3 },
      { name: 'DOW', value: 39000, change: -20, changePercent: -0.05 },
      { name: 'VIX', value: 14, change: -0.5, changePercent: -3.5 }
    ];
    
    res.json(mockIndices);
  }
});

// Simple cache for screener to avoid hitting rate limits on every dashboard load
let cachedScreenerData: any = null;
let lastScreenerFetch = 0;

router.get("/screener", requireAuth, async (req, res) => {
  const { limit = 30 } = req.query;
  
  try {
    if (Date.now() - lastScreenerFetch < 60000 && cachedScreenerData) {
      return res.json(cachedScreenerData.slice(0, Number(limit)));
    }

    const quotes = await yahooFinance.quote(POPULAR_TICKERS) as any[];
    const stocks = quotes.map(q => ({
      ticker: q.symbol,
      name: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0,
      marketCap: q.marketCap ? (q.marketCap / 1e9).toFixed(2) + "B" : "N/A",
      sector: getSectorForTicker(q.symbol),
      peRatio: q.trailingPE || 0,
      rsi: 50, // Mock RSI as it requires historical calculation
      signal: "HOLD" // Mock signal
    }));

    cachedScreenerData = stocks;
    lastScreenerFetch = Date.now();

    res.json(stocks.slice(0, Number(limit)));
  } catch (error) {
    console.error("Error fetching screener data:", error);
    if (cachedScreenerData) {
      return res.json(cachedScreenerData.slice(0, Number(limit)));
    }
    
    // Fallback mock data if Yahoo Finance fails and no cache
    const mockStocks = POPULAR_TICKERS.map(ticker => ({
      ticker,
      name: ticker + " Inc.",
      price: 150 + Math.random() * 100,
      change: (Math.random() * 10) - 5,
      changePercent: (Math.random() * 4) - 2,
      marketCap: (100 + Math.random() * 2000).toFixed(2) + "B",
      sector: getSectorForTicker(ticker),
      peRatio: 15 + Math.random() * 20,
      rsi: 50,
      signal: "HOLD"
    }));
    
    res.json(mockStocks.slice(0, Number(limit)));
  }
});

router.get("/stock/:ticker", requireAuth, async (req, res) => {
  const { ticker } = req.params;
  
  try {
    const quote = await yahooFinance.quote(ticker.toUpperCase()) as any;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // Last 30 days

    const historical = await yahooFinance.historical(ticker.toUpperCase(), {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    }) as any[];

    const stock = {
      ticker: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      marketCap: quote.marketCap ? (quote.marketCap / 1e9).toFixed(2) + "B" : "N/A",
      sector: getSectorForTicker(quote.symbol),
      peRatio: quote.trailingPE || 0,
      history: historical.map(h => ({
        date: h.date.toISOString().split('T')[0],
        price: h.close
      }))
    };

    res.json(stock);
  } catch (error) {
    console.error(`Error fetching stock ${ticker}:`, error);
    
    // Fallback mock data
    const mockHistory = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (30 - i));
      return {
        date: d.toISOString().split('T')[0],
        price: 150 + Math.random() * 20 + i
      };
    });

    res.json({
      ticker: ticker.toUpperCase(),
      name: ticker.toUpperCase() + " Inc.",
      price: mockHistory[29].price,
      change: 2.5,
      changePercent: 1.5,
      marketCap: "500.00B",
      sector: getSectorForTicker(ticker.toUpperCase()),
      peRatio: 25,
      history: mockHistory
    });
  }
});

// Watchlist routes
router.get("/watchlist", requireAuth, async (req: any, res: any) => {
  try {
    const items = db.prepare("SELECT ticker FROM watchlist_items WHERE userId = ?").all(req.user.id) as any[];
    const tickers = items.map(i => i.ticker);
    
    if (tickers.length === 0) {
      return res.json([]);
    }

    const quotes = await yahooFinance.quote(tickers) as any[];
    const watchlistStocks = quotes.map(q => ({
      ticker: q.symbol,
      name: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice || 0,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent || 0,
      sector: getSectorForTicker(q.symbol)
    }));
    
    res.json(watchlistStocks);
  } catch (error) {
    console.error("Error fetching watchlist data:", error);
    
    try {
      // Fallback: return basic info from database if Yahoo Finance fails
      const items = db.prepare("SELECT ticker FROM watchlist_items WHERE userId = ?").all(req.user.id) as any[];
      const mockWatchlist = items.map(i => ({
        ticker: i.ticker,
        name: i.ticker + " Inc.",
        price: 150 + Math.random() * 100,
        change: (Math.random() * 10) - 5,
        changePercent: (Math.random() * 4) - 2,
        sector: getSectorForTicker(i.ticker)
      }));
      return res.json(mockWatchlist);
    } catch (dbErr) {
      res.status(500).json({ error: "Failed to fetch watchlist data" });
    }
  }
});

router.post("/watchlist", requireAuth, (req: any, res: any) => {
  const { ticker } = req.body;
  if (!ticker) return res.status(400).json({ error: "Ticker required" });

  try {
    // Check limit for free users
    const sub = db.prepare("SELECT plan FROM subscriptions WHERE userId = ?").get(req.user.id) as any;
    const plan = sub ? sub.plan : "free";
    
    if (plan === "free") {
      const count = db.prepare("SELECT COUNT(*) as count FROM watchlist_items WHERE userId = ?").get(req.user.id) as any;
      if (count.count >= 5) {
        return res.status(403).json({ error: "Free plan limit reached (5 items)" });
      }
    }

    db.prepare("INSERT OR IGNORE INTO watchlist_items (userId, ticker) VALUES (?, ?)").run(req.user.id, ticker.toUpperCase());
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/watchlist/:ticker", requireAuth, (req: any, res: any) => {
  const { ticker } = req.params;
  try {
    db.prepare("DELETE FROM watchlist_items WHERE userId = ? AND ticker = ?").run(req.user.id, ticker.toUpperCase());
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
