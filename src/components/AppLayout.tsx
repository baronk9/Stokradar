import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { Globe, LogOut, Menu, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { to: '/app', label: t('nav.dashboard') },
    { to: '/app/screener', label: t('nav.screener') },
    { to: '/app/watchlist', label: t('nav.watchlist') },
    { to: '/app/compare', label: t('nav.compare') },
    { to: '/app/fair-value', label: t('nav.fairValue') },
    { to: '/app/alerts', label: t('nav.alerts') },
    { to: '/app/portfolio', label: t('nav.portfolio') },
    { to: '/app/report', label: t('nav.report') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <Link to="/app" className="text-2xl font-bold tracking-tight text-indigo-600">
            StockRadar
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{user?.email}</span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 uppercase">
              {user?.plan}
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleLocale}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors w-full"
            >
              <LogOut className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/app" className="text-xl font-bold text-indigo-600">
          StockRadar
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 absolute w-full z-20 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <button onClick={toggleLocale} className="p-2"><Globe className="w-5 h-5" /></button>
            <button onClick={logout} className="p-2 text-red-600"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
