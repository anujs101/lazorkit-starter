// src/app/api/subscription/resume/route.ts

import { NextResponse } from 'next/server';
import { subscriptions } from '@/lib/store';

type ResumeSubscriptionBody = {
  subscriptionId: string;
};

export async function POST(req: Request) {
  try {
    const { subscriptionId } = (await req.json()) as ResumeSubscriptionBody;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId is required' },
        { status: 400 }
      );
    }

    const subscription = subscriptions.get(subscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.status !== 'PAUSED') {
      return NextResponse.json(
        { error: 'Only paused subscriptions can be resumed' },
        { status: 409 }
      );
    }

    const now = Date.now();

    subscription.status = 'ACTIVE';
    subscription.nextChargeAt = now + 30 * 24 * 60 * 60 * 1000;

    subscriptions.set(subscriptionId, subscription);

    return NextResponse.json({
      subscriptionId,
      status: subscription.status,
      nextChargeAt: new Date(subscription.nextChargeAt).toISOString(),
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_RESUME_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to resume subscription' },
      { status: 500 }
    );
  }
}