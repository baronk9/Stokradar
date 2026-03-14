import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { Filter, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
  peRatio: number;
  marketCap: string;
  marketCapValue: number;
  dividendYield: number;
  rsi: number;
  signal: string;
}

type SortColumn = 'price' | 'changePercent' | 'marketCapValue' | 'peRatio' | 'dividendYield' | null;
type SortDirection = 'asc' | 'desc';

export const Screener: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [marketCapFilter, setMarketCapFilter] = useState<string>('all');
  const [peFilter, setPeFilter] = useState<string>('all');
  const [divYieldFilter, setDivYieldFilter] = useState<string>('all');

  // Sort states
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortColumn(null);
        setSortDirection('desc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ChevronDown className="w-4 h-4 opacity-20 inline-block ml-1" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 inline-block ml-1 text-indigo-600" />;
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = stocks.filter(stock => {
      let pass = true;
      
      // Market Cap Filter
      if (marketCapFilter !== 'all') {
        const mc = stock.marketCapValue || 0;
        if (marketCapFilter === 'mega' && mc < 200e9) pass = false;
        if (marketCapFilter === 'large' && (mc < 10e9 || mc >= 200e9)) pass = false;
        if (marketCapFilter === 'mid' && (mc < 2e9 || mc >= 10e9)) pass = false;
        if (marketCapFilter === 'small' && mc >= 2e9) pass = false;
      }

      // P/E Ratio Filter
      if (peFilter !== 'all') {
        const pe = stock.peRatio || 0;
        if (peFilter === 'under15' && (pe <= 0 || pe >= 15)) pass = false;
        if (peFilter === 'under25' && (pe <= 0 || pe >= 25)) pass = false;
        if (peFilter === 'over25' && pe < 25) pass = false;
      }

      // Dividend Yield Filter
      if (divYieldFilter !== 'all') {
        const dy = stock.dividendYield || 0;
        if (divYieldFilter === 'over1' && dy < 1) pass = false;
        if (divYieldFilter === 'over3' && dy < 3) pass = false;
        if (divYieldFilter === 'over5' && dy < 5) pass = false;
      }

      return pass;
    });

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortColumn] || 0;
        const valueB = b[sortColumn] || 0;
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stocks, marketCapFilter, peFilter, divYieldFilter, sortColumn, sortDirection]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.screener')}</h1>
        <p className="text-slate-500 mt-2">Filter and find the best US stocks.</p>
      </header>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex items-center text-slate-500 font-medium whitespace-nowrap">
          <Filter className="w-5 h-5 mr-2" /> Filters
        </div>
        
        <div className="flex flex-wrap gap-4 w-full">
          {/* Market Cap Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Market Cap</label>
            <div className="relative">
              <select 
                value={marketCapFilter}
                onChange={(e) => setMarketCapFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Any</option>
                <option value="mega">Mega (200B+)</option>
                <option value="large">Large (10B - 200B)</option>
                <option value="mid">Mid (2B - 10B)</option>
                <option value="small">Small (&lt; 2B)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* P/E Ratio Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">P/E Ratio</label>
            <div className="relative">
              <select 
                value={peFilter}
                onChange={(e) => setPeFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Any</option>
                <option value="under15">Value (&lt; 15)</option>
                <option value="under25">Reasonable (&lt; 25)</option>
                <option value="over25">Growth (&gt; 25)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dividend Yield Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Div Yield</label>
            <div className="relative">
              <select 
                value={divYieldFilter}
                onChange={(e) => setDivYieldFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Any</option>
                <option value="over1">&gt; 1%</option>
                <option value="over3">&gt; 3%</option>
                <option value="over5">&gt; 5%</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Ticker</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('price')}>
                  <div className="flex items-center">Price <SortIcon column="price" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('changePercent')}>
                  <div className="flex items-center">Change % <SortIcon column="changePercent" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('marketCapValue')}>
                  <div className="flex items-center">Market Cap <SortIcon column="marketCapValue" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('peRatio')}>
                  <div className="flex items-center">P/E <SortIcon column="peRatio" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('dividendYield')}>
                  <div className="flex items-center">Div Yield <SortIcon column="dividendYield" /></div>
                </th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredAndSortedStocks.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">No stocks match your filters.</td></tr>
              ) : (
                filteredAndSortedStocks.map(stock => (
                  <tr key={stock.ticker} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      <Link to={`/app/stock/${stock.ticker}`}>{stock.ticker}</Link>
                    </td>
                    <td className="px-6 py-4">${stock.price.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-medium ${stock.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">{stock.marketCap}</td>
                    <td className="px-6 py-4">{stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}</td>
                    <td className="px-6 py-4">{stock.dividendYield ? stock.dividendYield.toFixed(2) + '%' : '-'}</td>
                    <td className="px-6 py-4">{stock.sector}</td>
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
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-8 pointer-events-none">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center text-center max-w-sm mx-auto pointer-events-auto">
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
