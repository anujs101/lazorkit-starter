// src/app/api/subscription/cancel/route.ts

import { NextResponse } from 'next/server';
import { subscriptions } from '@/lib/store';

type CancelSubscriptionBody = {
  subscriptionId: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CancelSubscriptionBody;
    const { subscriptionId } = body;

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

    if (subscription.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Subscription is already cancelled' },
        { status: 409 }
      );
    }

    // Allow cancel from ACTIVE or PAUSED
    subscription.status = 'CANCELLED';
    subscription.nextChargeAt = null;

    subscriptions.set(subscriptionId, subscription);

    return NextResponse.json({
      subscriptionId,
      status: subscription.status,
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_CANCEL_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}