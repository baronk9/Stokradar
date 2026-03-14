import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { Filter, Lock } from 'lucide-react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
  peRatio: number;
  rsi: number;
  signal: string;
}

export const Screener: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const limit = user?.plan === 'pro' ? 100 : 30;
    fetch(`/api/data/screener?limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          console.error("Failed to fetch screener data:", data);
          setStocks([]);
        }
      })
      .catch(err => {
        console.error("Error fetching screener data:", err);
        setStocks([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.screener')}</h1>
        <p className="text-slate-500 mt-2">Filter and find the best US stocks.</p>
      </header>

      {/* Filters (Mock UI) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center text-slate-500 font-medium mr-4">
          <Filter className="w-5 h-5 mr-2" /> Filters
        </div>
        {['Mag7', 'Oversold', 'Overbought', 'Value', 'Tech', 'Health'].map(preset => (
          <button key={preset} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors">
            {preset}
          </button>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Ticker</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Change %</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">P/E</th>
                <th className="px-6 py-4">RSI</th>
                <th className="px-6 py-4">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : (
                stocks.map(stock => (
                  <tr key={stock.ticker} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      <Link to={`/app/stock/${stock.ticker}`}>{stock.ticker}</Link>
                    </td>
                    <td className="px-6 py-4">${stock.price.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-medium ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
                    </td>
                    <td className="px-6 py-4">{stock.sector}</td>
                    <td className="px-6 py-4">{stock.peRatio}</td>
                    <td className="px-6 py-4">{stock.rsi}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        stock.signal === 'BUY' ? 'bg-emerald-100 text-emerald-700' :
                        stock.signal === 'SELL' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {stock.signal}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Free Plan Overlay */}
        {user?.plan === 'free' && !loading && (
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-8">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center text-center max-w-sm mx-auto">
              <Lock className="w-6 h-6 text-indigo-500 mb-2" />
              <h3 className="font-bold text-slate-900">Showing top 30 results</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Upgrade to Pro to see all 8,000+ stocks and use advanced filters.</p>
              <Link to="/pricing" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
