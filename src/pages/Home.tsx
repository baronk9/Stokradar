import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { ArrowRight, BarChart2, Zap, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
          {t('home.hero')}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
          {t('home.subhero')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-105"
          >
            {t('home.cta')}
            <ArrowRight className={`ml-2 w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-lg font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            {t('nav.pricing')}
          </Link>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full">
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Advanced Analytics</h3>
          <p className="text-slate-600">Deep dive into market data with our powerful screener and charting tools.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">AI-Powered Insights</h3>
          <p className="text-slate-600">Get instant, structured analysis on any US stock using advanced AI models.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 bg-amber-50 rounded-full text-amber-600">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Fair Value Calculator</h3>
          <p className="text-slate-600">Calculate intrinsic value and margin of safety with our DCF-based tool.</p>
        </div>
      </div>
    </div>
  );
};
