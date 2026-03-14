import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { Globe } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { t, locale, setLocale } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-600">
            StockRadar
          </Link>
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {t('nav.pricing')}
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              {t('nav.signup')}
            </Link>
            <button
              onClick={toggleLocale}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-900">Terms</Link>
            <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-900">Privacy</Link>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-2xl">
            {t('app.disclaimer')}
          </p>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} StockRadar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
