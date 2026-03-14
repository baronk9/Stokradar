import YahooFinance from 'yahoo-finance2';
const yf = new YahooFinance();
const POPULAR_TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JNJ", "V", "JPM", "WMT", "UNH", "PG", "HD", "MA", "BAC", "DIS", "ADBE", "CRM", "NFLX"];
yf.quote(POPULAR_TICKERS).then(res => console.log(res.length)).catch(err => console.error(err));
