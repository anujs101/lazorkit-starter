// src/app/api/subscription/pause/route.ts

import { NextResponse } from 'next/server';
import { subscriptions } from '@/lib/store';

type PauseSubscriptionBody = {
  subscriptionId: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PauseSubscriptionBody;
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

    if (subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Only active subscriptions can be paused' },
        { status: 409 }
      );
    }

    subscription.status = 'PAUSED';

    subscriptions.set(subscriptionId, subscription);

    return NextResponse.json({
      subscriptionId,
      status: subscription.status,
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_PAUSE_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to pause subscription' },
      { status: 500 }
    );
  }
}