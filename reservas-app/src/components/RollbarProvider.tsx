'use client';

import { useEffect } from 'react';
import rollbar from '@/lib/rollbar';

export default function RollbarProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!rollbar) {
      console.warn('Rollbar not initialized - missing NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN');
      return;
    }

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      rollbar?.error(event.error || event.message);
    };

    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      rollbar?.error('Unhandled Promise Rejection', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return <>{children}</>;
}
