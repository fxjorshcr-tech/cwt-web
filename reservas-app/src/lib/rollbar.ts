// src/lib/rollbar.ts
// Official Rollbar configuration for Next.js
import Rollbar from 'rollbar';

const baseConfig = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV || 'development',
  payload: {
    client: {
      javascript: {
        code_version: '0.1.3',
        source_map_enabled: true,
      },
    },
  },
};

// Client-side config (used by RollbarProvider)
export const clientConfig: Rollbar.Configuration = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  ...baseConfig,
};

// Server-side instance (for API routes, server components)
export const serverInstance = process.env.ROLLBAR_SERVER_TOKEN
  ? new Rollbar({
      accessToken: process.env.ROLLBAR_SERVER_TOKEN,
      ...baseConfig,
    })
  : null;

export default clientConfig;
