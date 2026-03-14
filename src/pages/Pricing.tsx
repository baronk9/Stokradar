import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="flex-1 flex flex-col items-center py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          {t('pricing.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{t('pricing.free')}</h2>
            <p className="text-slate-500 mt-2">{t('pricing.free.desc')}</p>
            <div className="mt-6 flex items-baseline text-5xl font-extrabold text-slate-900">
              {t('pricing.free.price')}
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-emerald-500 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-slate-600">{t('pricing.free.feature1')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-emerald-500 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-slate-600">{t('pricing.free.feature2')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-emerald-500 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-slate-600">{t('pricing.free.feature3')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-emerald-500 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-slate-600">{t('pricing.free.feature4')}</span>
            </li>
          </ul>
          <Link
            to="/register"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            {t('pricing.cta.free')}
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-indigo-600 rounded-3xl shadow-xl border border-indigo-500 p-8 flex flex-col h-full transform md:-translate-y-4 relative">
          <div className="absolute top-0 right-0 -mt-4 mr-8 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">
            Most Popular
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{t('pricing.pro')}</h2>
            <p className="text-indigo-200 mt-2">{t('pricing.pro.desc')}</p>
            <div className="mt-6 flex items-baseline text-5xl font-extrabold text-white">
              {t('pricing.pro.price')}
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-indigo-200 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-white">{t('pricing.pro.feature1')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-indigo-200 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-white">{t('pricing.pro.feature2')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-indigo-200 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-white">{t('pricing.pro.feature3')}</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-indigo-200 mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
              <span className="text-white">{t('pricing.pro.feature4')}</span>
            </li>
          </ul>
          <Link
            to="/register?plan=pro"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition-colors shadow-sm"
          >
            {t('pricing.cta.pro')}
          </Link>
        </div>
      </div>
    </div>
  );
};
