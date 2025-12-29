'use client';

import './polyfills';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import {
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import {
  buildUsdcTransferInstructions,
  withRetry,
  getConnection,
  USDC_MINT
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

  const {
    connect,
    isConnected,
    smartWalletPubkey,
    signAndSendTransaction,
  } = useWallet();

  const showConnectOverlay = !isConnected;
    const fetchBalances = async (pubkey: PublicKey) => {
  // SOL balance
  const lamports = await connection.getBalance(pubkey);
  setSolBalance(lamports / 1e9);

  // USDC balance
  const ata = await getAssociatedTokenAddress(
    USDC_MINT,
    pubkey,
    true
  );

  const tokenAcc = await connection
    .getTokenAccountBalance(ata)
    .catch(() => null);

  setUsdcBalance(tokenAcc ? Number(tokenAcc.value.uiAmount) : 0);
};
  /* ----------------------------- Fetch balances ---------------------------- */
  useEffect(() => {
  if (!smartWalletPubkey) return;

  fetchBalances(smartWalletPubkey);
}, [smartWalletPubkey, connection]);

  /* ----------------------------- Handle payment ---------------------------- */
  const handlePayment = async () => {
    if (!receiver || !amount) {
      alert('Missing fields');
      return;
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(receiver);
    } catch {
      alert('Invalid recipient address');
      return;
    }

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      alert('Invalid amount');
      return;
    }

    setState('processing');

    try {
      if (!smartWalletPubkey) {
        throw new Error('Wallet not connected');
      }

      const sender = smartWalletPubkey;

      const signature = await withRetry(async () => {
        const connection = getConnection();

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

        return await signAndSendTransaction({
          instructions,
          transactionOptions: {
            computeUnitLimit: 200_000,
          },
        });
      });

      console.log('Tx signature:', signature);
      setTxSignature(signature);
      await connection.confirmTransaction(signature, 'confirmed');
      await fetchBalances(sender);
      setState('success');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* Main Content */}
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-all ${
          showConnectOverlay ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-6">
          <h1 className="text-2xl font-medium text-neutral-50">
            LazorKit Checkout
          </h1>

          {/* Balances */}
          <div className="text-sm text-neutral-400 space-y-1">
            <div>SOL Balance: {solBalance ?? '—'}</div>
            <div>USDC Balance: {usdcBalance ?? '—'}</div>
          </div>

          {/* Receiver */}
          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver public key"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          />

          {/* Amount */}
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          />

          {/* Currency selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-50"
          >
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
          </select>

          {/* Action */}
          {state === 'default' && (
            <button
              onClick={handlePayment}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 py-3 rounded text-sm font-medium"
            >
              Pay
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
                  View on Solana Explorer
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

      {/* Connect Overlay */}
      {showConnectOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">🔐</div>

            <h2 className="text-xl font-semibold text-neutral-50">
              Login with LazorKit Wallet
            </h2>

            <p className="text-sm text-neutral-400">
              Connect your wallet to view balances and make payments.
            </p>

            <button
              onClick={() => connect()}
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