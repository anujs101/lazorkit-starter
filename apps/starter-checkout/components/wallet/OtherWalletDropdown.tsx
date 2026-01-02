'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

export function OtherWalletDropdown() {
  const [open, setOpen] = useState(false);
  const { wallets, select, connecting,connect } = useWallet();

  const commonWallets = wallets.filter((w) =>
    ['Phantom', 'Solflare', 'Backpack'].includes(w.adapter.name)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-2 rounded text-sm"
      >
        Connect another wallet
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden z-50">
          {commonWallets.map((wallet) => {
            const detected =
              wallet.adapter.readyState === WalletReadyState.Installed;

            return (
              <button
                key={wallet.adapter.name}
                disabled={!detected || connecting}
                onClick={async () => {
                  select(wallet.adapter.name);
                  await connect();
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition
                  ${
                    detected
                      ? 'text-neutral-200 hover:bg-neutral-800'
                      : 'text-neutral-500 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    className="w-5 h-5"
                  />
                  <span>{wallet.adapter.name}</span>
                </div>

                {detected && (
                  <span className="text-xs text-green-400">
                    Detected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}