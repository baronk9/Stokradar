/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PublicLayout } from './components/PublicLayout';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/app/Dashboard';
import { Screener } from './pages/app/Screener';
import { Watchlist } from './pages/app/Watchlist';
import { Compare } from './pages/app/Compare';
import { FairValue } from './pages/app/FairValue';
import { StockAnalysis } from './pages/app/StockAnalysis';
import { Alerts, Portfolio, Report } from './pages/app/ProPages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* App Routes */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="screener" element={<Screener />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="compare" element={<Compare />} />
              <Route path="fair-value" element={<FairValue />} />
              <Route path="stock/:ticker" element={<StockAnalysis />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="report" element={<Report />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}
