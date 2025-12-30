// src/lib/plans.ts

export type PlanTier = 'basic' | 'pro' | 'advanced';

export type BillingInterval = 'monthly';

export interface Plan {
  id: PlanTier;
  label: string;
  priceUSDC: number;
  interval: BillingInterval;
  features: string[];
}

export const PLANS: Record<PlanTier, Plan> = {
  basic: {
    id: 'basic',
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
    id: 'pro',
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
    id: 'advanced',
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