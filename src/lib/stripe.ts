import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe if key is configured
export const stripe = stripeKey && stripeKey.startsWith('sk_')
  ? new Stripe(stripeKey, { apiVersion: '2026-03-25.dahlia' })
  : (null as unknown as Stripe);

export const isStripeConfigured = !!stripe;

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
