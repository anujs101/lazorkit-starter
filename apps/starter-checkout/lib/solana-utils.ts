import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

const RPC_URL = 'https://api.devnet.solana.com';
export const USDC_MINT = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);

export function getConnection() {
  return new Connection(RPC_URL, 'confirmed');
}

export async function buildUsdcTransferInstructions(
  connection: Connection,
  sender: PublicKey,
  recipient: PublicKey,
  amountUi: number
) {
  const instructions = [];

  const fromAta = await getAssociatedTokenAddress(
    USDC_MINT,
    sender,
    true
  );

  const toAta = await getAssociatedTokenAddress(
    USDC_MINT,
    recipient,
    true
  );

  const toAtaInfo = await connection.getAccountInfo(toAta);
  if (!toAtaInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender,
        toAta,
        recipient,
        USDC_MINT
      )
    );
  }

  instructions.push(
    createTransferInstruction(
      fromAta,
      toAta,
      sender,
      Math.floor(amountUi * 1e6)
    )
  );

  return instructions;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 800
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  throw lastError;
}