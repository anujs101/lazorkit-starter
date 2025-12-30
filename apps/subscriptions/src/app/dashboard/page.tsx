'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { SubscriptionStatus } from '@/components/SubscriptionStatus';
import { Actions } from '@/components/Actions';
import type { Subscription } from '@/lib/store';

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, smartWalletPubkey, connect } = useWallet();

  const [walletReady, setWalletReady] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lazorkit hydration guard
  useEffect(() => {
    setWalletReady(true);
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!smartWalletPubkey) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/subscription/me?wallet=${smartWalletPubkey}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await res.json();
      setSubscription(data.subscription);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  }, [smartWalletPubkey]);

  useEffect(() => {
    if (!walletReady) return;

    if (!isConnected || !smartWalletPubkey) {
      return;
    }

    fetchSubscription();
  }, [walletReady, isConnected, smartWalletPubkey, fetchSubscription]);

  /* -------------------- RENDER STATES -------------------- */

  // 1️⃣ Wallet still restoring
  if (!walletReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-neutral-400">
        Restoring wallet session…
      </div>
    );
  }

  // 2️⃣ Wallet not connected
  if (!isConnected || !smartWalletPubkey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <button
          onClick={() => connect()}
          className="rounded-lg bg-white px-6 py-3 text-black hover:bg-neutral-200"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // 3️⃣ Fetching subscription
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-neutral-400">
        Loading…
      </div>
    );
  }

  // 4️⃣ No subscription
  if (!subscription) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-neutral-400">No active subscription found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-sm text-neutral-400 hover:text-neutral-300"
          >
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  // 5️⃣ Subscription dashboard
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Subscription Management
          </h1>
          <p className="mt-2 text-neutral-400">
            Manage your Web3 subscription
          </p>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-8">
          <SubscriptionStatus
            planId={subscription.plan}
            status={subscription.status}
            nextBillingDate={
              subscription.nextChargeAt
                ? new Date(subscription.nextChargeAt).toISOString()
                : null
            }
            walletAddress={smartWalletPubkey}
          />

          <div className="mt-8 h-px bg-neutral-800" />

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Actions
            </h3>
            <Actions
              subscriptionId={subscription.id}
              status={subscription.status}
              onActionComplete={fetchSubscription}
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-neutral-400 hover:text-neutral-300"
          >
            Back to plans
          </button>
        </div>
      </div>
    </div>
  );
}