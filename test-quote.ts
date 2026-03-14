import YahooFinance from 'yahoo-finance2';
const yf = new YahooFinance();
yf.quote('AAPL').then(res => console.log({
  dividendYield: res.dividendYield,
  trailingAnnualDividendYield: res.trailingAnnualDividendYield
})).catch(err => console.error(err));

