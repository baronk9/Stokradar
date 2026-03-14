import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2, Lock } from 'lucide-react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
}

export const Watchlist: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [newTicker, setNewTicker] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWatchlist = () => {
    setLoading(true);
    fetch('/api/data/watchlist')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWatchlist(data);
        } else {
          console.error("Failed to fetch watchlist data:", data);
          setWatchlist([]);
        }
      })
      .catch(err => {
        console.error("Error fetching watchlist data:", err);
        setWatchlist([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker) return;
    setError('');

    try {
      const res = await fetch('/api/data/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: newTicker })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setNewTicker('');
      fetchWatchlist();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (ticker: string) => {
    try {
      await fetch(`/api/data/watchlist/${ticker}`, { method: 'DELETE' });
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.watchlist.title')}</h1>
        <p className="text-slate-500 mt-2">Track your favorite stocks.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleAdd} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder={t('app.watchlist.add')}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Add
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : watchlist.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t('app.watchlist.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map(stock => (
              <div key={stock.ticker} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center hover:border-indigo-300 transition-colors">
                <div>
                  <Link to={`/app/stock/${stock.ticker}`} className="font-bold text-lg text-indigo-600 hover:underline">
                    {stock.ticker}
                  </Link>
                  <p className="text-sm text-slate-500">{stock.name}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-bold">${stock.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%
                  </span>
                  <button onClick={() => handleRemove(stock.ticker)} className="mt-2 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user?.plan === 'free' && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start">
          <Lock className="w-6 h-6 text-indigo-500 mr-4 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-indigo-900">Smart Alerts on Watchlist</h3>
            <p className="text-indigo-700 mt-1 mb-4">Upgrade to Pro to get real-time price and RSI alerts for your watchlist items.</p>
            <Link to="/pricing" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 inline-block">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
