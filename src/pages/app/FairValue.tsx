import React, { useState } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import { Calculator, AlertTriangle, CheckCircle } from 'lucide-react';

export const FairValue: React.FC = () => {
  const { t } = useI18n();
  const [inputs, setInputs] = useState({
    eps: 5.0,
    growth: 10,
    terminalGrowth: 3,
    discountRate: 9,
    terminalPE: 15,
    currentPrice: 100
  });
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { eps, growth, terminalGrowth, discountRate, terminalPE, currentPrice } = inputs;
    
    // Simplified DCF calculation
    let presentValue = 0;
    let futureEps = eps;
    
    // Years 1-5
    for (let i = 1; i <= 5; i++) {
      futureEps *= (1 + growth / 100);
      presentValue += futureEps / Math.pow(1 + discountRate / 100, i);
    }
    
    // Terminal Value
    const terminalValue = futureEps * terminalPE;
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, 5);
    
    const fairValue = presentValue + presentTerminalValue;
    const marginOfSafety = ((fairValue - currentPrice) / fairValue) * 100;
    
    let label = 'Fairly Valued';
    if (marginOfSafety > 20) label = 'Undervalued';
    if (marginOfSafety < -20) label = 'Overvalued';

    setResult({
      fairValue: fairValue.toFixed(2),
      marginOfSafety: marginOfSafety.toFixed(2),
      label
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{t('app.fairValue.title')}</h1>
        <p className="text-slate-500 mt-2">Estimate intrinsic value using a simplified DCF model.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.eps')}</label>
                <input type="number" step="0.01" name="eps" value={inputs.eps} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.currentPrice')}</label>
                <input type="number" step="0.01" name="currentPrice" value={inputs.currentPrice} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.growth')}</label>
                <input type="number" step="0.1" name="growth" value={inputs.growth} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.terminalGrowth')}</label>
                <input type="number" step="0.1" name="terminalGrowth" value={inputs.terminalGrowth} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.discountRate')}</label>
                <input type="number" step="0.1" name="discountRate" value={inputs.discountRate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('app.fairValue.terminalPE')}</label>
                <input type="number" step="0.1" name="terminalPE" value={inputs.terminalPE} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center">
              <Calculator className="w-5 h-5 mr-2" /> {t('app.fairValue.calculate')}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-sm border border-indigo-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Estimated Fair Value</h3>
            <div className="text-5xl font-black text-indigo-600 mb-4">${result.fairValue}</div>
            
            <div className={`flex items-center text-lg font-bold mb-6 ${
              result.label === 'Undervalued' ? 'text-emerald-600' :
              result.label === 'Overvalued' ? 'text-red-600' :
              'text-amber-500'
            }`}>
              {result.label === 'Undervalued' ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertTriangle className="w-6 h-6 mr-2" />}
              {result.label}
            </div>

            <div className="w-full bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500 font-medium">Margin of Safety</span>
              <span className={`text-xl font-bold ${parseFloat(result.marginOfSafety) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {parseFloat(result.marginOfSafety) > 0 ? '+' : ''}{result.marginOfSafety}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
