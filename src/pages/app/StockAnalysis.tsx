import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, AlertTriangle, CheckCircle, TrendingUp, Info, Zap } from 'lucide-react';

export const StockAnalysis: React.FC = () => {
  const { ticker: urlTicker } = useParams<{ ticker: string }>();
  const [ticker, setTicker] = useState(urlTicker || '');
  const [stockData, setStockData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [quote, setQuote] = useState<{text: string, author: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (urlTicker) {
      fetchStockData(urlTicker);
    }
  }, [urlTicker]);

  const fetchStockData = async (tckr: string) => {
    setLoading(true);
    setError('');
    setAiAnalysis(null);
    try {
      const res = await fetch(`/api/data/stock/${tckr}`);
      if (!res.ok) throw new Error('Stock not found');
      const data = await res.json();
      setStockData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker) navigate(`/app/stock/${ticker.toUpperCase()}`);
  };

  const handleAnalyze = async () => {
    if (!stockData) return;
    setLoading(true);
    setError('');
    try {
      const [aiRes, quoteRes] = await Promise.all([
        fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: stockData.ticker, lang: locale })
        }),
        fetch('/api/data/quote')
      ]);
      
      const data = await aiRes.json();
      if (!aiRes.ok) throw new Error(data.error || 'Analysis failed');
      setAiAnalysis(data);

      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        setQuote(quoteData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.analyze')}</h1>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={t('app.analyze.placeholder')}
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {stockData && (
        <div className="space-y-8">
          {/* Stock Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{stockData.ticker}</h2>
              <p className="text-slate-500">{stockData.name}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-slate-900">${stockData.price.toFixed(2)}</div>
              <div className={`text-lg font-medium ${stockData.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={false} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                <Zap className="w-6 h-6 text-indigo-500 mr-2" /> AI Analysis
              </h3>
              {!aiAnalysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Analyzing...' : t('app.analyze.btn')}
                </button>
              )}
            </div>

            {aiAnalysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Rating</p>
                    <p className={`text-3xl font-black ${
                      aiAnalysis.rating === 'BUY' ? 'text-emerald-600' :
                      aiAnalysis.rating === 'SELL' ? 'text-red-600' :
                      'text-amber-500'
                    }`}>{aiAnalysis.rating}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Conviction Score</p>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-black text-slate-900">{aiAnalysis.convictionScore}</span>
                      <span className="text-xl text-slate-400 ml-1">/10</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Upside Potential</p>
                    <p className="text-3xl font-black text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 mr-2" /> {aiAnalysis.upsidePercent}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" /> Strengths
                    </h4>
                    <ul className="space-y-3">
                      {aiAnalysis.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex items-start text-emerald-800">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                    <h4 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" /> Risks
                    </h4>
                    <ul className="space-y-3">
                      {aiAnalysis.risks.map((r: string, i: number) => (
                        <li key={i} className="flex items-start text-red-800">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Analyst Note</h4>
                  <p className="text-slate-700 leading-relaxed">{aiAnalysis.analystNote}</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Target Price</p>
                      <p className="text-xl font-bold text-slate-900">${aiAnalysis.targetPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Stop Loss</p>
                      <p className="text-xl font-bold text-slate-900">${aiAnalysis.stopLoss}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center text-xs text-slate-400 mt-8">
                  <Info className="w-4 h-4 mr-1" />
                  {t('app.disclaimer')}
                </div>
              </div>
            )}
          </div>

          {/* Quote Section */}
          {quote && (
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 text-slate-800 opacity-50">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.411 14.596C17.404 11.856 18.094 8.96 18.094 6H13V0H24V6C24 13.5 19.5 21 19.5 21H14.017ZM0 21L2.394 14.596C3.387 11.856 4.077 8.96 4.077 6H-1V0H10V6C10 13.5 5.5 21 5.5 21H0Z" />
                </svg>
              </div>
              <div className="relative z-10 max-w-2xl">
                <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-4">
                  "{quote.text}"
                </p>
                <p className="text-indigo-300 font-medium tracking-wide uppercase text-sm">
                  — {quote.author}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
