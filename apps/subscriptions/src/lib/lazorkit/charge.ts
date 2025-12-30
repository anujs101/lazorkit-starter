// src/lib/lazorkit/charge.ts

import { PublicKey } from '@solana/web3.js';
import { withRetry, getConnection, buildUsdcTransferInstructions } from '@/lib/solana-utils';
import { getLazorkitSigner } from '@/lib/lazorkit/signer';

/**
 * Arguments for charging a subscription
 */
type ChargeArgs = {
  sender: PublicKey;        // smart wallet pubkey
  merchant: PublicKey;      // merchant receiving USDC
  amountUSDC: number;       // UI amount (e.g. 15)
};

/**
 * Charge a subscription using Lazorkit (gasless)
 * - Builds USDC transfer instructions
 * - Sends via Lazorkit signer
 */
export async function chargeSubscription({
  sender,
  merchant,
  amountUSDC,
}: ChargeArgs) {
  const connection = getConnection();
  const signer = getLazorkitSigner();

  if (!signer) {
    throw new Error('Lazorkit signer not available');
  }

  const instructions = await buildUsdcTransferInstructions(
    connection,
    sender,
    merchant,
    amountUSDC
  );

  await withRetry(async () => {
    await signer.signAndSendTransaction({
      instructions,
    });
  });
}