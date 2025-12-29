'use client';

import type { Plan, PlanTier } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PlanCardProps {
  planId: PlanTier;
  plan: Plan;
  isConnected: boolean;
  onSubscribe: (plan: PlanTier) => void;
  isLoading?: boolean;
  isHighlighted?: boolean;
}

export function PlanCard({
  planId,
  plan,
  isConnected,
  onSubscribe,
  isLoading = false,
  isHighlighted = false,
}: PlanCardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg border bg-neutral-900 p-8 transition-all ${
        isHighlighted
          ? 'border-neutral-600 ring-1 ring-neutral-700'
          : 'border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white">
          {plan.label}
        </h3>

        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold text-white">
            {plan.priceUSDC}
          </span>
          <span className="ml-2 text-neutral-400">USDC</span>
          <span className="ml-1 text-neutral-500">
            / {plan.interval}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 shrink-0 text-neutral-400" />
            <span className="text-sm text-neutral-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Action */}
      <Button
        onClick={() => onSubscribe(planId)}
        disabled={!isConnected || isLoading}
        className="w-full bg-white text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        title={!isConnected ? 'Connect wallet to subscribe' : undefined}
      >
        {isLoading ? 'Processing…' : 'Subscribe'}
      </Button>
    </div>
  );
}