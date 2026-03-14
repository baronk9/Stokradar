import YahooFinance from 'yahoo-finance2';
const yf = new YahooFinance();
yf.quote(['AAPL']).then(res => console.log(Array.isArray(res))).catch(err => console.error(err));
