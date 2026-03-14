import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 prose prose-slate">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: March 13, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, subscribe to a paid plan, or contact customer support. This may include your name, email address, and payment information.</p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events.</p>

      <h2>3. Information Sharing</h2>
      <p>We do not share your personal information with third parties except as described in this privacy policy, such as with service providers who perform services on our behalf (e.g., payment processing).</p>

      <h2>4. Data Security</h2>
      <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

      <h2>5. Your Choices</h2>
      <p>You may update, correct, or delete your account information at any time by logging into your account or contacting us.</p>
    </div>
  );
};
