// src/lib/plans.ts

export type PlanTier = 'basic' | 'pro' | 'advanced';

export interface Plan {
  label: string;
  priceUSDC: number;
  interval: 'monthly';
  features: string[];
}

export const PLANS: Record<PlanTier, Plan> = {
  basic: {
    label: 'Basic',
    priceUSDC: 5,
    interval: 'monthly',
    features: [
      'Access to core features',
      'Standard support',
      'Monthly billing',
    ],
  },

  pro: {
    label: 'Pro',
    priceUSDC: 15,
    interval: 'monthly',
    features: [
      'All Basic features',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
  },

  advanced: {
    label: 'Advanced',
    priceUSDC: 30,
    interval: 'monthly',
    features: [
      'All Pro features',
      'Dedicated account manager',
      'White-label options',
      'SLA guarantees',
    ],
  },
};