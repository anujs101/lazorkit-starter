'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { SubscriptionStatus } from '@/lib/store';

interface ActionsProps {
  subscriptionId: string;
  status: SubscriptionStatus;
  onActionComplete: () => void;
}

export function Actions({
  subscriptionId,
  status,
  onActionComplete,
}: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    action: 'pause' | 'resume' | 'cancel'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/subscription/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Action failed');
      }

      // Let parent re-fetch from backend (source of truth)
      onActionComplete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-950/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {status === 'ACTIVE' && (
          <>
            <Button
              onClick={() => handleAction('pause')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-neutral-700 bg-transparent text-white hover:bg-neutral-800"
            >
              {isLoading ? 'Processing…' : 'Pause'}
            </Button>

            <Button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-900/50 bg-transparent text-red-400 hover:bg-red-950/20 hover:text-red-300"
            >
              {isLoading ? 'Processing…' : 'Cancel'}
            </Button>
          </>
        )}

        {status === 'PAUSED' && (
          <>
            <Button
              onClick={() => handleAction('resume')}
              disabled={isLoading}
              className="flex-1 bg-white text-black hover:bg-neutral-200"
            >
              {isLoading ? 'Processing…' : 'Resume'}
            </Button>

            <Button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-900/50 bg-transparent text-red-400 hover:bg-red-950/20 hover:text-red-300"
            >
              {isLoading ? 'Processing…' : 'Cancel'}
            </Button>
          </>
        )}

        {status === 'CANCELLED' && (
          <Button
            disabled
            className="w-full cursor-not-allowed bg-neutral-800 text-neutral-500"
          >
            Subscription Cancelled
          </Button>
        )}
      </div>
    </div>
  );
}