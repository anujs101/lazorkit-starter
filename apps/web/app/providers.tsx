'use client';

import { LazorkitProvider } from '@lazorkit/wallet';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazorkit.com"
      paymasterConfig={{
        paymasterUrl: process.env.NEXT_PUBLIC_LAZORKIT_PAYMASTER!,
      }}
    >
      {children}
    </LazorkitProvider>
  );
}