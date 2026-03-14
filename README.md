# StockRadar

A freemium stock-analysis dashboard built with React, Express, and Tailwind CSS.

## Features
- **Market Overview**: Real-time indices and market heatmap.
- **Stock Screener**: Filter stocks by sector, P/E, RSI, and more.
- **AI Analysis**: Get structured insights on any US stock using Gemini AI.
- **Fair Value Calculator**: Estimate intrinsic value using a DCF model.
- **Watchlist**: Track your favorite stocks.
- **Bilingual**: Supports English (LTR) and Arabic (RTL).

## Running the App
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. The app will be available at `http://localhost:3000`

## Data Providers
Currently, the app uses a **MOCK** data provider located in `server/routes/data.ts`.
To switch to a real provider:
1. Implement a `MarketDataProvider` interface.
2. Replace the mock data generation in `server/routes/data.ts` with calls to your real provider API (e.g., Alpha Vantage, Polygon.io, Yahoo Finance).

## Stripe Integration
To enable real payments for the Pro plan:
1. Add your Stripe Secret Key to `.env`: `STRIPE_SECRET_KEY=sk_test_...`
2. Create a new route in `server/routes/auth.ts` to handle Stripe Checkout sessions.
3. Update the `Register` component to redirect to the Stripe Checkout URL when `plan=pro` is selected.
4. Set up a Stripe webhook to listen for `checkout.session.completed` events and update the user's subscription status in the `subscriptions` table.
