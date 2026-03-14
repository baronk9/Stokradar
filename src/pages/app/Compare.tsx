import React, { useState } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Compare: React.FC = () => {
  const { t } = useI18n();
  const [ticker1, setTicker1] = useState('');
  const [ticker2, setTicker2] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker1 || !ticker2) return;
    setLoading(true);
    setError('');

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/data/stock/${ticker1}`),
        fetch(`/api/data/stock/${ticker2}`)
      ]);
      
      if (!res1.ok || !res2.ok) throw new Error('One or both tickers not found');
      
      const stock1 = await res1.json();
      const stock2 = await res2.json();

      setData([
        { name: 'P/E Ratio', [stock1.ticker]: stock1.peRatio, [stock2.ticker]: stock2.peRatio },
        { name: 'RSI', [stock1.ticker]: stock1.rsi, [stock2.ticker]: stock2.rsi },
        { name: 'Change %', [stock1.ticker]: stock1.changePercent, [stock2.ticker]: stock2.changePercent },
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.compare.title')}</h1>
        <p className="text-slate-500 mt-2">Compare key metrics side-by-side.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={t('app.compare.ticker1')}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            value={ticker1}
            onChange={(e) => setTicker1(e.target.value)}
          />
          <span className="flex items-center justify-center font-bold text-slate-400">VS</span>
          <input
            type="text"
            placeholder={t('app.compare.ticker2')}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            value={ticker2}
            onChange={(e) => setTicker2(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Comparing...' : t('app.compare.btn')}
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {data && (
          <div className="h-96 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
                <Bar dataKey={Object.keys(data[0])[1]} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey={Object.keys(data[0])[2]} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
