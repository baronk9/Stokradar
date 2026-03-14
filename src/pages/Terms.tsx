import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 prose prose-slate">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: March 13, 2026</p>
      
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl mb-8">
        <h2 className="text-xl font-bold text-amber-800 mt-0 mb-4">Important Disclaimer</h2>
        <p className="text-amber-900 mb-0">
          <strong>Not financial advice.</strong> The information provided on StockRadar is for educational and informational purposes only. It does not constitute financial, investment, or legal advice. You should not make any financial decisions based solely on the information provided by this service. Always consult with a qualified financial advisor before making any investment decisions.
        </p>
      </div>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using StockRadar, you agree to be bound by these Terms of Service.</p>

      <h2>2. Description of Service</h2>
      <p>StockRadar provides stock market analytics, AI-generated insights, and related tools. We do not guarantee the accuracy, completeness, or timeliness of the data provided.</p>

      <h2>3. User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

      <h2>4. Subscriptions and Payments</h2>
      <p>Certain features are available only with a paid subscription. Payments are processed securely via third-party providers. Subscriptions auto-renew unless canceled.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall StockRadar be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, arising out of or related to your use of the service.</p>
    </div>
  );
};
