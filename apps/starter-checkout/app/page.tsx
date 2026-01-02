'use client';

import './polyfills';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useWallet as useLazorkitWallet } from '@lazorkit/wallet';
import { useWallet as useAdapterWallet } from '@solana/wallet-adapter-react';
import { OtherWalletDropdown } from '@/components/wallet/OtherWalletDropdown';

import {
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { getAssociatedTokenAddress } from '@solana/spl-token';

import {
  buildUsdcTransferInstructions,
  withRetry,
  getConnection,
  USDC_MINT,
} from '@/lib/solana-utils';

type UIState = 'default' | 'processing' | 'success' | 'error';
type Currency = 'SOL' | 'USDC';

export default function CheckoutPage() {
  const [state, setState] = useState<UIState>('default');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('SOL');

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const connection = useMemo(() => getConnection(), []);

  /* ------------------------- Lazorkit wallet ------------------------- */
  const {
    connect: connectLazorkit,
    isConnected: isLazorkitConnected,
    smartWalletPubkey,
    signAndSendTransaction,
  } = useLazorkitWallet();

  /* ------------------------- Adapter wallets ------------------------- */
  const {
    publicKey: adapterPubkey,
    connected: isAdapterConnected,
    sendTransaction,
  } = useAdapterWallet();

  /* ----------------------- Unified connection ----------------------- */
  const activePubkey = smartWalletPubkey ?? adapterPubkey;
  const isConnected = isLazorkitConnected || isAdapterConnected;
  const isGasless = isLazorkitConnected;

  const showConnectOverlay = !isConnected;

  /* -------------------------- Fetch balances ------------------------- */
  const fetchBalances = useCallback(
    async (pubkey: PublicKey) => {
      const lamports = await connection.getBalance(pubkey);
      setSolBalance(lamports / 1e9);

      const ata = await getAssociatedTokenAddress(
        USDC_MINT,
        pubkey,
        true
      );

      const tokenAcc = await connection
        .getTokenAccountBalance(ata)
        .catch(() => null);

      setUsdcBalance(tokenAcc ? Number(tokenAcc.value.uiAmount) : 0);
    },
    [connection]
  );

  useEffect(() => {
    if (!activePubkey) return;

    let cancelled = false;

    (async () => {
      if (!cancelled) {
        await fetchBalances(activePubkey);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activePubkey, fetchBalances]);

  /* ----------------------------- Payment ----------------------------- */
  const handlePayment = async () => {
    if (!receiver || !amount) return alert('Missing fields');

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(receiver);
    } catch {
      return alert('Invalid recipient address');
    }

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) return alert('Invalid amount');

    if (!activePubkey) return alert('Wallet not connected');

    setState('processing');

    try {
      const sender = activePubkey;

      const signature = await withRetry(async () => {
        let instructions;

        if (currency === 'USDC') {
          instructions = await buildUsdcTransferInstructions(
            connection,
            sender,
            recipient,
            amountNum
          );
        } else {
          instructions = [
            SystemProgram.transfer({
              fromPubkey: sender,
              toPubkey: recipient,
              lamports: Math.floor(amountNum * 1e9),
            }),
          ];
        }

        /* -------- Lazorkit (gasless) -------- */
        if (isLazorkitConnected) {
          return await signAndSendTransaction({
            instructions,
            transactionOptions: {
              computeUnitLimit: 200_000,
            },
          });
        }

        /* -------- Standard wallets (gas) -------- */
        const tx = new Transaction().add(...instructions);
        tx.feePayer = adapterPubkey!;
        tx.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        return await sendTransaction(tx, connection);
      });

      setTxSignature(signature);
      await connection.confirmTransaction(signature, 'confirmed');
      await fetchBalances(activePubkey);
      setState('success');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <div className="relative min-h-screen bg-neutral-950">
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-all ${
          showConnectOverlay ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-6">
          <h1 className="text-2xl font-medium text-neutral-50">
            Lazorkit Checkout
          </h1>

          <p className="text-sm text-neutral-400">
            {isGasless
              ? 'Keyless & gasless checkout powered by Lazorkit'
              : 'Gas fees apply. Switch to Lazorkit for gasless checkout.'}
          </p>

          {!isGasless && (
            <p className="text-xs text-yellow-400">
              You are using a standard wallet. Network fees will be charged.
            </p>
          )}

          <div className="text-sm text-neutral-400 space-y-1">
            <div>SOL Balance: {solBalance ?? '—'}</div>
            <div>USDC Balance: {usdcBalance ?? '—'}</div>
          </div>

          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver public key"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          />

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          >
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
          </select>

          {state === 'default' && (
            <button
              onClick={handlePayment}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 py-3 rounded text-sm font-medium"
            >
              {isGasless ? 'Pay (Gasless)' : 'Pay'}
            </button>
          )}

          {state === 'processing' && (
            <div className="w-full bg-neutral-800 text-neutral-400 py-3 rounded text-sm text-center">
              Processing…
            </div>
          )}

          {state === 'success' && (
            <div className="space-y-3">
              <div className="w-full bg-neutral-800 text-green-400 py-3 rounded text-sm text-center">
                Payment successful
              </div>

              {txSignature && (
                <button
                  onClick={() =>
                    window.open(
                      `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                      '_blank'
                    )
                  }
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 py-3 rounded text-sm font-medium"
                >
                  View on Explorer
                </button>
              )}
            </div>
          )}

          {state === 'error' && (
            <div className="w-full bg-neutral-800 text-red-400 py-3 rounded text-sm text-center">
              Payment failed
            </div>
          )}
        </div>
      </div>

      {/* -------------------------- Connect Overlay -------------------------- */}
      {showConnectOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold text-neutral-50">
              Continue with Lazorkit
            </h2>

            <p className="text-sm text-neutral-400">
              No wallet installs. No seed phrases. No gas fees.
            </p>

            <button
              onClick={() => connectLazorkit()}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 py-3 rounded text-sm font-medium"
            >
              Go keyless & gasless
            </button>

            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-xs text-neutral-500">or</span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              <OtherWalletDropdown />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}