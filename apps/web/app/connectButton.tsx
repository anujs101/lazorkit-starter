'use client';

import { useWallet } from '@lazorkit/wallet';

export default function ConnectButton({ onConnectClick }: { onConnectClick: () => void }) {
  const {
    connect,
    isConnected,
    smartWalletPubkey,
    isConnecting,
  } = useWallet();

  const handleClick = async () => {
    try {
      if (!isConnected) {
        await connect();
      } else {
        onConnectClick();
      }
    } catch (err) {
      console.error('Wallet error:', err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className="flex items-center justify-center rounded-lg h-9 px-4
        bg-[#4C6FFF] hover:bg-[#3E5FCC]
        disabled:opacity-60 disabled:cursor-not-allowed
        text-white text-sm font-medium transition-all duration-200"
      >
        <span className="mr-2 material-symbols-outlined text-[18px]">
          account_balance_wallet
        </span>

        <span>
          {isConnecting
            ? 'Connecting...'
            : isConnected
            ? `${smartWalletPubkey?.toBase58().slice(0, 4)}...${smartWalletPubkey
                ?.toBase58()
                .slice(-4)}`
            : 'Connect'}
        </span>
      </button>
    </div>
  );
}