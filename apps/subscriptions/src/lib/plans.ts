// src/lib/plans.ts
export type PlanTier = "basic" | "pro" | "advanced";

export const PLANS: Record<
  PlanTier,
  {
    label: string;
    priceUSDC: number;
    interval: "monthly";
  }
> = {
  basic: {
    label: "Basic",
    priceUSDC: 5,
    interval: "monthly",
  },
  pro: {
    label: "Pro",
    priceUSDC: 15,
    interval: "monthly",
  },
  advanced: {
    label: "Advanced",
    priceUSDC: 30,
    interval: "monthly",
  },
};