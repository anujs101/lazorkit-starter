'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PLANS, PlanTier } from '@/lib/plans';
import { PlanCard } from '@/components/PlanCard';
import { useWallet } from '@/hooks/useWallet';

export default function Home() {
  const router = useRouter();
  const { isConnected, publicKey, connect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (plan: PlanTier) => {
    if (!isConnected) {
      alert('Wallet connection will be implemented here');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      // Backend is the source of truth
      router.push('/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    connect(); // placeholder – Lazorkit will replace this
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Lazorkit Subscriptions
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-400">
              Choose a plan and start a gasless USDC subscription using passkey wallets.
            </p>
          </div>

          {isConnected && publicKey ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-4 text-right">
              <p className="text-xs text-neutral-500">Wallet Address</p>
              <p className="font-mono text-sm text-white">
                {shortenAddress(publicKey)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Connected via passkey
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-white transition-colors hover:bg-neutral-800"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Pricing */}
        <div className="grid gap-8 lg:grid-cols-3">
          {Object.entries(PLANS).map(([planId, plan]) => (
            <PlanCard
              key={planId}
              planId={planId as PlanTier}
              plan={plan}
              isConnected={isConnected}
              isLoading={isLoading}
              isHighlighted={planId === 'pro'}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>

        {/* Footer notes */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-600">
            Feature list is illustrative for demo purposes.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Subscriptions are charged immediately on signup. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}