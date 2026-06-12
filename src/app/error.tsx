'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">Something went wrong</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    </div>
  );
}
