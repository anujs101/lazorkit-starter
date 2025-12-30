'use client';

import { useMemo } from 'react';
import { useWallet as useLazorkitWallet } from '@lazorkit/wallet';

export function useWallet() {
  const {
    isConnected,
    smartWalletPubkey,
    connect,
    disconnect,
    signAndSendTransaction,
  } = useLazorkitWallet();

  // Normalize to string for UI + API usage
  const smartWalletAddress = useMemo(() => {
    if (!smartWalletPubkey) return null;
    return smartWalletPubkey.toString();
  }, [smartWalletPubkey]);

  return {
    isConnected,
    smartWalletPubkey: smartWalletAddress,
    connect,
    disconnect,
    signAndSendTransaction,
  };
}