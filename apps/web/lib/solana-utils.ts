import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

/**
 * =========================
 * Network / Connection
 * =========================
 */

export const RPC_URL = 'https://api.devnet.solana.com';

export function getConnection() {
  return new Connection(RPC_URL, 'confirmed');
}

/**
 * =========================
 * Tokens
 * =========================
 */

// Devnet USDC mint
export const USDC_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);

/**
 * =========================
 * Balance Helpers
 * =========================
 */

export async function getSolBalance(pubkey: PublicKey): Promise<number> {
  const connection = getConnection();
  const lamports = await connection.getBalance(pubkey);
  return lamports / 1_000_000_000;
}

export async function getUsdcBalance(pubkey: PublicKey): Promise<number> {
  const connection = getConnection();

  try {
    const ata = await getAssociatedTokenAddress(USDC_MINT, pubkey);
    const balance = await connection.getTokenAccountBalance(ata);
    return Number(balance.value.uiAmount ?? 0);
  } catch {
    // ATA doesn't exist
    return 0;
  }
}

/**
 * =========================
 * USDC Transfer (Gasless-ready)
 * =========================
 */

export async function buildUsdcTransferInstructions({
  sender,
  recipient,
  amount,
}: {
  sender: PublicKey;
  recipient: PublicKey;
  amount: number; // USDC (human readable)
}): Promise<TransactionInstruction[]> {
  const instructions: TransactionInstruction[] = [];
  const connection = getConnection();

  const senderAta = await getAssociatedTokenAddress(
    USDC_MINT,
    sender
  );

  const recipientAta = await getAssociatedTokenAddress(
    USDC_MINT,
    recipient
  );

  // Create ATA for recipient if needed
  const recipientAtaInfo = await connection.getAccountInfo(recipientAta);

  if (!recipientAtaInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender, // payer
        recipientAta,
        recipient,
        USDC_MINT
      )
    );
  }

  instructions.push(
    createTransferInstruction(
      senderAta,
      recipientAta,
      sender,
      amount * 1_000_000 // USDC has 6 decimals
    )
  );

  return instructions;
}

/**
 * =========================
 * Retry Utility (for UX)
 * =========================
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 800
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return withRetry(fn, retries - 1, delayMs);
  }
}