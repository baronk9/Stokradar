import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.screener': 'Screener',
    'nav.watchlist': 'Watchlist',
    'nav.compare': 'Compare',
    'nav.fairValue': 'Fair Value',
    'nav.alerts': 'Alerts (Pro)',
    'nav.portfolio': 'Portfolio (Pro)',
    'nav.report': 'Report (Pro)',
    'nav.pricing': 'Pricing',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'home.hero': 'Smarter Stock Analysis, Simplified.',
    'home.subhero': 'Get institutional-grade insights, AI-driven analysis, and real-time alerts for US stocks.',
    'home.cta': 'Start Exploring for Free',
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.free.desc': 'For exploring the market',
    'pricing.pro.desc': 'For serious investors',
    'pricing.free.price': '$0',
    'pricing.pro.price': '$39/mo',
    'pricing.free.feature1': '3 AI analyses/day',
    'pricing.free.feature2': 'Data refresh every 15 mins',
    'pricing.free.feature3': 'Screener limited to top 30',
    'pricing.free.feature4': 'Watchlist up to 5 tickers',
    'pricing.pro.feature1': 'Unlimited AI analyses',
    'pricing.pro.feature2': 'Real-time data',
    'pricing.pro.feature3': 'Unlimited screener results',
    'pricing.pro.feature4': 'Unlimited alerts & portfolio',
    'pricing.cta.free': 'Get Started',
    'pricing.cta.pro': 'Upgrade to Pro',
    'app.marketOverview': 'Market Overview',
    'app.heatmap': 'Market Heatmap',
    'app.screener': 'Stock Screener',
    'app.analyze': 'Analyze Any US Stock',
    'app.analyze.placeholder': 'Enter ticker (e.g. AAPL)',
    'app.analyze.btn': 'Analyze',
    'app.disclaimer': 'Not financial advice — Educational only',
    'app.fairValue.title': 'Fair Value Calculator',
    'app.fairValue.eps': 'EPS',
    'app.fairValue.growth': '5Y Growth %',
    'app.fairValue.terminalGrowth': 'Terminal Growth %',
    'app.fairValue.discountRate': 'Discount Rate %',
    'app.fairValue.terminalPE': 'Terminal P/E',
    'app.fairValue.currentPrice': 'Current Price',
    'app.fairValue.calculate': 'Calculate Fair Value',
    'app.compare.title': 'Compare Stocks',
    'app.compare.ticker1': 'Ticker 1',
    'app.compare.ticker2': 'Ticker 2',
    'app.compare.btn': 'Compare',
    'app.watchlist.title': 'My Watchlist',
    'app.watchlist.add': 'Add Ticker',
    'app.watchlist.empty': 'Your watchlist is empty.',
    'app.pro.locked': 'This feature is available on the Pro plan.',
    'app.pro.upgrade': 'Upgrade Now',
  },
  ar: {
    'nav.dashboard': 'لوحة القيادة',
    'nav.screener': 'الماسح',
    'nav.watchlist': 'قائمة المراقبة',
    'nav.compare': 'مقارنة',
    'nav.fairValue': 'القيمة العادلة',
    'nav.alerts': 'تنبيهات (برو)',
    'nav.portfolio': 'المحفظة (برو)',
    'nav.report': 'تقرير (برو)',
    'nav.pricing': 'الأسعار',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'home.hero': 'تحليل أسهم أذكى، وببساطة.',
    'home.subhero': 'احصل على رؤى مؤسسية، وتحليل مدعوم بالذكاء الاصطناعي، وتنبيهات في الوقت الفعلي للأسهم الأمريكية.',
    'home.cta': 'ابدأ الاستكشاف مجاناً',
    'pricing.title': 'أسعار بسيطة وشفافة',
    'pricing.free': 'مجاني',
    'pricing.pro': 'برو',
    'pricing.free.desc': 'لاستكشاف السوق',
    'pricing.pro.desc': 'للمستثمرين الجادين',
    'pricing.free.price': '$0',
    'pricing.pro.price': '$39/شهر',
    'pricing.free.feature1': '3 تحليلات ذكاء اصطناعي/يوم',
    'pricing.free.feature2': 'تحديث البيانات كل 15 دقيقة',
    'pricing.free.feature3': 'الماسح محدود لأول 30',
    'pricing.free.feature4': 'قائمة مراقبة حتى 5 أسهم',
    'pricing.pro.feature1': 'تحليلات ذكاء اصطناعي غير محدودة',
    'pricing.pro.feature2': 'بيانات في الوقت الفعلي',
    'pricing.pro.feature3': 'نتائج ماسح غير محدودة',
    'pricing.pro.feature4': 'تنبيهات ومحفظة غير محدودة',
    'pricing.cta.free': 'ابدأ الآن',
    'pricing.cta.pro': 'الترقية إلى برو',
    'app.marketOverview': 'نظرة عامة على السوق',
    'app.heatmap': 'الخريطة الحرارية للسوق',
    'app.screener': 'ماسح الأسهم',
    'app.analyze': 'تحليل أي سهم أمريكي',
    'app.analyze.placeholder': 'أدخل الرمز (مثل AAPL)',
    'app.analyze.btn': 'تحليل',
    'app.disclaimer': 'ليست نصيحة مالية — للأغراض التعليمية فقط',
    'app.fairValue.title': 'حاسبة القيمة العادلة',
    'app.fairValue.eps': 'ربحية السهم',
    'app.fairValue.growth': 'نمو 5 سنوات %',
    'app.fairValue.terminalGrowth': 'النمو النهائي %',
    'app.fairValue.discountRate': 'معدل الخصم %',
    'app.fairValue.terminalPE': 'مكرر الربحية النهائي',
    'app.fairValue.currentPrice': 'السعر الحالي',
    'app.fairValue.calculate': 'حساب القيمة العادلة',
    'app.compare.title': 'مقارنة الأسهم',
    'app.compare.ticker1': 'الرمز 1',
    'app.compare.ticker2': 'الرمز 2',
    'app.compare.btn': 'مقارنة',
    'app.watchlist.title': 'قائمة المراقبة',
    'app.watchlist.add': 'إضافة رمز',
    'app.watchlist.empty': 'قائمة المراقبة فارغة.',
    'app.pro.locked': 'هذه الميزة متاحة في خطة برو.',
    'app.pro.upgrade': 'قم بالترقية الآن',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLocaleState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
