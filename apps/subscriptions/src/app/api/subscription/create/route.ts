// src/app/api/subscription/create/route.ts

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { PLANS, PlanTier } from '@/lib/plans';
import { subscriptions } from '@/lib/store';

type CreateSubscriptionBody = {
  plan: PlanTier;
  wallet: string;        // smart wallet public key (base58)
  txSignature?: string; // optional, for audit/debug
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateSubscriptionBody;
    const { plan, wallet } = body;

    // 1️⃣ Validate input
    if (!plan || !(plan in PLANS)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];

    // 2️⃣ Prevent duplicate active subscriptions (recommended)
    for (const sub of subscriptions.values()) {
      if (sub.wallet === wallet && sub.status === 'ACTIVE') {
        return NextResponse.json(
          { error: 'Active subscription already exists for this wallet' },
          { status: 409 }
        );
      }
    }

    // 3️⃣ Create subscription record
    const now = Date.now();
    const subscriptionId = randomUUID();

    subscriptions.set(subscriptionId, {
      id: subscriptionId,
      wallet,
      plan,
      amountUSDC: planConfig.priceUSDC,
      status: 'ACTIVE',
      createdAt: now,
      nextChargeAt: now + 30 * 24 * 60 * 60 * 1000, // +30 days
    });

    // 4️⃣ Respond
    return NextResponse.json({
      subscriptionId,
      plan,
      status: 'ACTIVE',
      nextChargeAt: new Date(
        now + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_CREATE_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}