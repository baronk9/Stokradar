import React, { useEffect, useState } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

export const Dashboard: React.FC = () => {
  const { t } = useI18n();
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/data/indices').then(res => res.json()),
      fetch('/api/data/screener?limit=50').then(res => res.json())
    ]).then(([indicesData, stocksData]) => {
      setIndices(Array.isArray(indicesData) ? indicesData : []);
      setStocks(Array.isArray(stocksData) ? stocksData : []);
    }).catch(err => {
      console.error("Failed to fetch dashboard data:", err);
      setIndices([]);
      setStocks([]);
    }).finally(() => setLoading(false));
  }, []);

  // Mock chart data for S&P 500
  const sp500ChartData = Array.from({ length: 20 }).map((_, i) => ({
    value: 5100 + Math.random() * 100 + (i * 5)
  }));

  const mag7Tickers = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA'];
  const mag7 = stocks.filter(s => mag7Tickers.includes(s.ticker)).sort((a, b) => mag7Tickers.indexOf(a.ticker) - mag7Tickers.indexOf(b.ticker));
  
  const sortedByChange = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedByChange.slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  const sectors = ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Industrials'];
  const sectorPerformance = sectors.map(sector => {
    const sectorStocks = stocks.filter(s => s.sector === sector);
    const avgChange = sectorStocks.length > 0 
      ? sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length 
      : (Math.random() * 4 - 1); // fallback
    return { name: sector, changePercent: avgChange };
  }).sort((a, b) => b.changePercent - a.changePercent);

  const sp500 = indices.find(i => i.name === 'S&P 500');
  const otherIndices = indices.filter(i => i.name !== 'S&P 500');

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 py-4 -mt-4 md:-mt-8 mb-6 border-b border-slate-200/50 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-slate-900">{t('app.marketOverview')}</h1>
            <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-md">FREE</span>
          </div>
          <p className="text-slate-500 mt-1">Get a quick pulse on the US markets.</p>
        </div>
      </header>

      <div className="flex-1 space-y-6">

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
          <div className="h-32 bg-slate-100 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-100 rounded-2xl"></div>
            <div className="h-64 bg-slate-100 rounded-2xl"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Market Overview Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Market Overview</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded">FREE</span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-end relative">
              <div className="z-10">
                <p className="text-sm font-medium text-slate-500 mb-1">S&P 500</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold text-slate-900">{sp500?.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="text-lg text-slate-500">pts</span>
                </div>
                <div className={`flex items-center mt-2 font-medium ${sp500 && sp500.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {sp500 && sp500.change >= 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                  {Math.abs(sp500?.change || 0)} ({sp500 && sp500.change >= 0 ? '+' : ''}{sp500?.changePercent}%)
                </div>
              </div>

              <div className="mt-6 md:mt-0 z-10 text-right space-y-2">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">NASDAQ · DOW · VIX</div>
                {otherIndices.map(idx => (
                  <div key={idx.name} className="flex items-center justify-end space-x-4 text-sm">
                    <span className="font-medium text-slate-700 w-16 text-left">{idx.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className={`font-medium flex items-center w-16 justify-end ${idx.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.changePercent)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Background Chart */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sp500ChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin - 50', 'dataMax + 50']} hide />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Magnificent 7 Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Magnificent 7</h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded">FREE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 divide-x divide-y lg:divide-y-0 divide-slate-100">
              {mag7.map(stock => (
                <div key={stock.ticker} className="p-4 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 mb-1">{stock.ticker}</span>
                  <span className="text-lg font-bold text-slate-900">${stock.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium flex items-center ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stock.changePercent >= 0 ? '▲' : '▼'}{Math.abs(stock.changePercent)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Gainers & Losers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gainers */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Top Gainers</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded">FREE</span>
                </div>
                <div className="p-2">
                  {topGainers.map(stock => (
                    <div key={stock.ticker} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 w-12">{stock.ticker}</span>
                        <span className="text-sm text-slate-500 truncate max-w-[100px]">{stock.name.replace(' Inc.', '')}</span>
                      </div>
                      <span className="font-bold text-emerald-600">+{stock.changePercent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Losers */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Top Losers</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded">FREE</span>
                </div>
                <div className="p-2">
                  {topLosers.map(stock => (
                    <div key={stock.ticker} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 w-12">{stock.ticker}</span>
                        <span className="text-sm text-slate-500 truncate max-w-[100px]">{stock.name.replace(' Inc.', '')}</span>
                      </div>
                      <span className="font-bold text-red-600">{stock.changePercent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sectors */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sectors</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded">FREE</span>
              </div>
              <div className="p-6 space-y-5">
                {sectorPerformance.map(sector => {
                  const isPositive = sector.changePercent >= 0;
                  // Calculate width based on max absolute value to make bars proportional
                  const maxAbs = Math.max(...sectorPerformance.map(s => Math.abs(s.changePercent)));
                  const widthPercent = Math.max(5, (Math.abs(sector.changePercent) / maxAbs) * 100);
                  
                  return (
                    <div key={sector.name} className="flex items-center text-sm">
                      <div className="w-24 shrink-0 text-slate-600 font-medium">{sector.name.replace(' Discretionary', '')}</div>
                      <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden flex items-center">
                        <div 
                          className={`h-full rounded-full ${isPositive ? 'bg-emerald-400' : 'bg-red-400'}`}
                          style={{ width: `${widthPercent}%` }}
                        ></div>
                      </div>
                      <div className={`w-16 text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{sector.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      </div>

      <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} StockRadar. All rights reserved.</p>
        <p className="mt-1">Data provided for educational purposes only.</p>
      </footer>
    </div>
  );
};
