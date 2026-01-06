'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

import { getConnection, USDC_MINT } from '@/lib/solana-utils';

export function WalletStatusCard() {
  const { isConnected, smartWalletPubkey, disconnect } = useWallet();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  const pubkey = smartWalletPubkey
    ? new PublicKey(smartWalletPubkey)
    : null;

  useEffect(() => {
    if (!pubkey) return;

    const fetchBalances = async () => {
      const connection = getConnection();

      // SOL
      const lamports = await connection.getBalance(pubkey);
      setSolBalance(lamports / LAMPORTS_PER_SOL);

      // USDC
      try {
        const ata = await getAssociatedTokenAddress(USDC_MINT, pubkey, true);
        const usdc = await connection.getTokenAccountBalance(ata);
        setUsdcBalance(Number(usdc.value.uiAmount));
      } catch {
        setUsdcBalance(0);
      }
    };

    fetchBalances();
  }, [pubkey]);

  const copyPubkey = async () => {
    if (!pubkey) return;
    await navigator.clipboard.writeText(pubkey.toBase58());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const airdropSol = async () => {
    if (!pubkey) return;
    setAirdropping(true);

    try {
      const connection = getConnection();
      const sig = await connection.requestAirdrop(
        pubkey,
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig, 'confirmed');

      const newBal = await connection.getBalance(pubkey);
      setSolBalance(newBal / LAMPORTS_PER_SOL);
    } finally {
      setAirdropping(false);
    }
  };

  if (!isConnected || !pubkey) return null;

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-200">
          Wallet Connected
        </span>
        <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
          ● Devnet
        </span>
      </div>

      {/* Pubkey */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2">
        <span className="font-mono text-sm text-zinc-300">
          {pubkey.toBase58().slice(0, 6)}...
          {pubkey.toBase58().slice(-4)}
        </span>
        <button
          onClick={copyPubkey}
          className="text-xs text-zinc-400 hover:text-white transition"
        >
          {copySuccess ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-800 p-3">
          <div className="text-xs text-zinc-400">SOL</div>
          <div className="mt-1 text-lg font-semibold">
            {solBalance?.toFixed(3) ?? '—'}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-800 p-3">
          <div className="text-xs text-zinc-400">USDC</div>
          <div className="mt-1 text-lg font-semibold">
            {usdcBalance ?? 0}
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={airdropSol}
        disabled={airdropping}
        className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm py-2 transition disabled:opacity-60"
      >
        {airdropping ? 'Airdropping...' : 'Airdrop 1 SOL'}
      </button>
      <button
        onClick={() => disconnect()}
        className="w-full rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold py-2 transition"
      >
        Disconnect
      </button>
    </div>
  );
}