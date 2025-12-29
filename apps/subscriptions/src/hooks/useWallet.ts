'use client';

import { useMemo } from 'react';
import { useWallet as useLazorkitWallet } from '@lazorkit/wallet';

export function useWallet() {
  const {
    isConnected,
    smartWalletPubkey,
    connect,
    disconnect,
  } = useLazorkitWallet();

  // Normalize to string for UI usage
  const publicKey = useMemo(() => {
    if (!smartWalletPubkey) return null;
    return smartWalletPubkey.toString();
  }, [smartWalletPubkey]);

  return {
    isConnected,
    publicKey,
    connect,
    disconnect,
  };
}