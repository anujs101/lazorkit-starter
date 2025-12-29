// src/lib/store.ts
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type Subscription = {
  id: string;
  wallet: string;
  plan: string;
  amountUSDC: number;
  status: SubscriptionStatus;
  createdAt: number;
  nextChargeAt: number;
};

export const subscriptions = new Map<string, Subscription>();