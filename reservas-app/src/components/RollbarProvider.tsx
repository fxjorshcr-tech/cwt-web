'use client';

import { Provider } from '@rollbar/react';
import { clientConfig } from '@/lib/rollbar';

interface RollbarProviderProps {
  children: React.ReactNode;
}

export default function RollbarProvider({ children }: RollbarProviderProps) {
  // Only render Provider if token is available
  if (!clientConfig.accessToken) {
    return <>{children}</>;
  }

  return (
    <Provider config={clientConfig}>
      {children}
    </Provider>
  );
}
