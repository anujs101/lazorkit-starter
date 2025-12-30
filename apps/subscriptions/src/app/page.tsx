'use client';

import { useEffect, useState, useMemo } from 'react';
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

export default function Home() {
  const router = useRouter();
  const {
    isConnected,
    smartWalletPubkey,
    connect,
    signAndSendTransaction,
  } = useWallet();

  const showConnectOverlay = !isConnected;

  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [checkingSub, setCheckingSub] = useState(false);

  // Memoize merchant pubkey
  const MERCHANT_PUBKEY = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_MERCHANT_PUBKEY) {
      console.warn('NEXT_PUBLIC_MERCHANT_PUBKEY is not defined');
      return null;
    }
    try {
      return new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_PUBKEY);
    } catch (err) {
      console.error('Invalid MERCHANT_PUBKEY:', err);
      return null;
    }
  }, []);

  /* ----------------------- Check existing subscription ---------------------- */
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

  /* ----------------------------- Subscribe flow ----------------------------- */
  const handleSubscribe = async (planTier: PlanTier) => {
    if (!smartWalletPubkey || !MERCHANT_PUBKEY) return;

    const plan = PLANS[planTier];
    setLoadingPlan(planTier);

    try {
      const connection = getConnection();
      const sender = new PublicKey(smartWalletPubkey);

      // 1️⃣ Build USDC transfer
      const instructions = await buildUsdcTransferInstructions(
        connection,
        sender,
        MERCHANT_PUBKEY,
        plan.priceUSDC
      );

      // 2️⃣ Sign + send
      const signature = await withRetry(() =>
        signAndSendTransaction({ instructions })
      );

      // 3️⃣ Persist subscription
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
    <div className="relative min-h-screen bg-black">
      {/* Main Content */}
      <div
        className={`transition-all ${
          showConnectOverlay
            ? 'blur-sm pointer-events-none select-none'
            : ''
        }`}
      >
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

            {isConnected && smartWalletPubkey && (
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-4 text-right">
                <p className="text-xs text-neutral-500">Wallet Address</p>
                <p className="font-mono text-sm text-white">
                  {shortenAddress(smartWalletPubkey)}
                </p>
              </div>
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

      {/* Connect Overlay (IDENTICAL to checkout) */}
      {showConnectOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">🔐</div>

            <h2 className="text-xl font-semibold text-neutral-50">
              Login with LazorKit Wallet
            </h2>

            <p className="text-sm text-neutral-400">
              Connect your wallet to manage your subscription.
            </p>

            <button
              onClick={() => connect({ feeMode: 'paymaster' })}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 py-3 rounded text-sm font-medium transition-colors"
            >
              Connect Wallet
            </button>

            <p className="text-xs text-neutral-500">
              Secured by passkey authentication
            </p>
          </div>
        </div>
      )}
    </div>
  );
}