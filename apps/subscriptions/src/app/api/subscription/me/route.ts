// src/app/api/subscription/me/route.ts

import { NextResponse } from 'next/server';
import { subscriptions } from '@/lib/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    // 1️⃣ Validate input
    if (!wallet) {
      return NextResponse.json(
        { error: 'wallet query param is required' },
        { status: 400 }
      );
    }

    // 2️⃣ Find the most relevant subscription for this wallet
    // Priority:
    // ACTIVE > PAUSED > (ignore CANCELLED)
    const subsForWallet = Array.from(subscriptions.values()).filter(
      (sub) => sub.wallet === wallet && sub.status !== 'CANCELLED'
    );

    if (subsForWallet.length === 0) {
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    const subscription =
      subsForWallet.find((s) => s.status === 'ACTIVE') ??
      subsForWallet.find((s) => s.status === 'PAUSED') ??
      null;

    return NextResponse.json({
      subscription,
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_ME_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}