'use client';

import { PLANS, PlanTier } from '@/lib/plans';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionStatus as Status } from '@/lib/store';

interface SubscriptionStatusProps {
  planId: PlanTier;
  status: Status;
  nextBillingDate: string | null;
  walletAddress: string;
}

export function SubscriptionStatus({
  planId,
  status,
  nextBillingDate,
  walletAddress,
}: SubscriptionStatusProps) {
  const plan = PLANS[planId];

  if (!plan) {
    return null;
  }

  const statusColors: Record<Status, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    PAUSED: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CANCELLED: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="space-y-6">
      {/* Wallet + Status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">Wallet Address</p>
          <p className="font-mono text-lg text-white">
            {shortenAddress(walletAddress)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Connected via passkey
          </p>
        </div>

        <Badge
          className={statusColors[status]}
          variant="outline"
        >
          {status}
        </Badge>
      </div>

      <div className="h-px bg-neutral-800" />

      {/* Plan + Price */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-neutral-400">Plan</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {plan.label}
          </p>
        </div>

        <div>
          <p className="text-sm text-neutral-400">Price</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {plan.priceUSDC} USDC
            <span className="text-base font-normal text-neutral-500">
              {' '}
              / {plan.interval}
            </span>
          </p>
        </div>
      </div>

      {/* Next Billing */}
      {status === 'ACTIVE' && nextBillingDate && (
        <>
          <div className="h-px bg-neutral-800" />
          <div>
            <p className="text-sm text-neutral-400">
              Next Billing Date
            </p>
            <p className="mt-1 text-white">
              {new Date(nextBillingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}