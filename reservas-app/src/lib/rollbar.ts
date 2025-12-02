// src/lib/rollbar.ts
// Official Rollbar configuration for Next.js
import Rollbar from 'rollbar';

/**
 * ✅ Filter function to ignore non-actionable errors
 * These errors are typically caused by:
 * - Browser extensions injecting/modifying DOM
 * - Hydration mismatches from external scripts
 * - Network issues with chunk loading (handled by ChunkErrorHandler)
 */
function checkIgnore(_isUncaught: boolean, args: Rollbar.LogArgument[]): boolean {
  const message = args[0];
  if (typeof message === 'string') {
    // DOM manipulation errors (usually browser extensions)
    if (message.includes('insertBefore') ||
        message.includes('removeChild') ||
        message.includes('appendChild') ||
        message.includes('NotFoundError')) {
      return true;
    }
    // Chunk loading errors (handled by ChunkErrorHandler)
    if (message.includes('Loading chunk') ||
        message.includes('ChunkLoadError')) {
      return true;
    }
    // Common browser extension errors
    if (message.includes('Script error') ||
        message.includes('ResizeObserver loop')) {
      return true;
    }
  }
  // Check error objects
  if (message && typeof message === 'object' && 'message' in message) {
    const errorMessage = (message as Error).message || '';
    if (errorMessage.includes('insertBefore') ||
        errorMessage.includes('removeChild') ||
        errorMessage.includes('NotFoundError') ||
        errorMessage.includes('Loading chunk')) {
      return true;
    }
  }
  return false;
}

const baseConfig = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV || 'development',
  checkIgnore, // ✅ Filter non-actionable errors
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
