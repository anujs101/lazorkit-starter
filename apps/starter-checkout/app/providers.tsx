'use client';

import './polyfills';
import { LazorkitProvider } from '@lazorkit/wallet';

const CONFIG = {
  RPC_URL: 'https://api.devnet.solana.com',
  PORTAL_URL: 'https://portal.lazor.sh',
  PAYMASTER: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazorkitProvider 
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}