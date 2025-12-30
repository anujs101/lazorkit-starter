'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';

import { PLANS, PlanTier } from '@/lib/plans';
import { PlanCard } from '@/components/PlanCard';
import { useWallet } from '@/hooks/useWallet';
import {
  getConnection,
  buildUsdcTransferInstructions,
  withRetry,
} from '@/lib/solana-utils';

const MERCHANT_PUBKEY = new PublicKey(
  process.env.NEXT_PUBLIC_MERCHANT_PUBKEY!
);

export default function Home() {
  const router = useRouter();
  const {
    isConnected,
    smartWalletPubkey,
    connect,
    signAndSendTransaction,
  } = useWallet();

  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [checkingSub, setCheckingSub] = useState(false);

  // Check existing subscription
  useEffect(() => {
    if (!isConnected || !smartWalletPubkey) return;

    const checkSubscription = async () => {
      setCheckingSub(true);
      try {
        const res = await fetch(
          `/api/subscription/me?wallet=${smartWalletPubkey}`
        );
        const data = await res.json();

        if (data.subscription) {
          router.replace('/dashboard');
        }
      } catch (err) {
        console.error('Failed to check subscription', err);
      } finally {
        setCheckingSub(false);
      }
    };

    checkSubscription();
  }, [isConnected, smartWalletPubkey, router]);

  const handleSubscribe = async (planTier: PlanTier) => {
    if (!isConnected || !smartWalletPubkey) {
      alert('Please connect your wallet first');
      return;
    }

    const plan = PLANS[planTier];
    setLoadingPlan(planTier);

    try {
      // 1️⃣ Build instructions
      const connection = getConnection();
      const sender = new PublicKey(smartWalletPubkey);

      const instructions = await buildUsdcTransferInstructions(
        connection,
        sender,
        MERCHANT_PUBKEY,
        plan.priceUSDC
      );

      // 2️⃣ Sign & send
      const signature = await withRetry(() =>
        signAndSendTransaction({ instructions })
      );

      // 3️⃣ Record subscription
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planTier,
          wallet: smartWalletPubkey,
          txSignature: signature,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to record subscription');
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Subscription failed:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Subscription failed. Please try again.'
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (checkingSub) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-neutral-400">
        Checking subscription…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Lazorkit Subscriptions
            </h1>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Choose a plan and start a gasless USDC subscription using passkey wallets.
            </p>
          </div>

          {isConnected && smartWalletPubkey ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-4 text-right">
              <p className="text-xs text-neutral-500">Wallet Address</p>
              <p className="font-mono text-sm text-white">
                {shortenAddress(smartWalletPubkey)}
              </p>
            </div>
          ) : (
              <button onClick={() => connect({ feeMode: 'paymaster' })} className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 text-white" >
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
              isLoading={loadingPlan === planId}
              isHighlighted={planId === 'pro'}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </div>
    </div>
  );
}