'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { SubscriptionStatus } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface ActionsProps {
  status: SubscriptionStatus;
  planId: string;
  onStatusChange?: () => void;
}

export function Actions({ status, planId, onStatusChange }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (action: 'pause' | 'cancel' | 'resume') => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = action === 'resume' ? 'create' : action;
      const response = await fetch(`/api/subscription/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Action failed');
      }

      onStatusChange?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubscribe = () => {
    router.push('/');
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
              {isLoading ? 'Processing...' : 'Pause'}
            </Button>
            <Button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-900/50 bg-transparent text-red-400 hover:bg-red-950/20 hover:text-red-300"
            >
              {isLoading ? 'Processing...' : 'Cancel'}
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
              {isLoading ? 'Processing...' : 'Resume'}
            </Button>
            <Button
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-900/50 bg-transparent text-red-400 hover:bg-red-950/20 hover:text-red-300"
            >
              {isLoading ? 'Processing...' : 'Cancel'}
            </Button>
          </>
        )}

        {status === 'CANCELLED' && (
          <Button
            onClick={handleResubscribe}
            className="w-full bg-white text-black hover:bg-neutral-200"
          >
            Re-subscribe
          </Button>
        )}
      </div>
    </div>
  );
}
