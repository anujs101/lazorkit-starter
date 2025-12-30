// src/lib/store.ts

import type { PlanTier } from '@/lib/plans';

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

export type Subscription = {
  id: string;

  // Smart wallet public key (string for demo simplicity)
  wallet: string;

  // Plan tier must match plans.ts
  plan: PlanTier;

  // Cached amount at time of subscription (derived from plans.ts)
  // This avoids recomputing and keeps history consistent
  amountUSDC: number;

  status: SubscriptionStatus;

  createdAt: number;
  nextChargeAt: number | null;
};

// In-memory store (demo-only, no persistence)
export const subscriptions = new Map<string, Subscription>();