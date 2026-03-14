import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Bell, Briefcase, FileText } from 'lucide-react';

const ProLock: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
      <div className="p-6 bg-indigo-50 rounded-full text-indigo-600 mb-6">
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      <p className="text-lg text-slate-600 mb-8">{t('app.pro.locked')}</p>
      <Link to="/pricing" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center">
        <Lock className="w-5 h-5 mr-2" /> {t('app.pro.upgrade')}
      </Link>
    </div>
  );
};

export const Alerts: React.FC = () => {
  const { user } = useAuth();
  if (user?.plan !== 'pro') return <ProLock title="Smart Alerts" icon={<Bell className="w-12 h-12" />} />;
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500">You have no active alerts.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create Alert</button>
      </div>
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const { user } = useAuth();
  if (user?.plan !== 'pro') return <ProLock title="Portfolio Analysis" icon={<Briefcase className="w-12 h-12" />} />;
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Portfolio</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500">Your portfolio is empty.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Holding</button>
      </div>
    </div>
  );
};

export const Report: React.FC = () => {
  const { user } = useAuth();
  if (user?.plan !== 'pro') return <ProLock title="Institutional Reports" icon={<FileText className="w-12 h-12" />} />;
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-slate-500">Generate PDF reports for any stock or your entire portfolio.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Generate Report</button>
      </div>
    </div>
  );
};
