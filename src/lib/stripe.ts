import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    applications: 5,
    features: ['5 applications/month', 'Basic job tracking', 'Manual apply'],
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    applications: Infinity,
    features: [
      'Unlimited applications',
      'AI resume generator',
      'AI cover letters',
      'Auto-apply bot',
      'Priority support',
    ],
  },
} as const;
