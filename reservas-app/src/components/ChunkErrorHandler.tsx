// src/components/ChunkErrorHandler.tsx
// ✅ Handles ChunkLoadError when cached chunks become stale after deployments
'use client';

import { useEffect } from 'react';

/**
 * ChunkErrorHandler - Automatically reloads the page when chunk loading fails
 *
 * This happens when:
 * - User has the page open during a deployment
 * - Cached JavaScript chunks reference old filenames that no longer exist
 * - Network issues cause chunk loading to fail
 *
 * Solution: Listen for these errors and trigger a single page reload
 */
export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      const message = event.message || '';

      // Detect ChunkLoadError patterns
      const isChunkError =
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError') ||
        message.includes('Loading CSS chunk') ||
        (error?.name === 'ChunkLoadError') ||
        (error?.message?.includes?.('Loading chunk'));

      if (isChunkError) {
        // Prevent infinite reload loops - only reload once per session
        const reloadKey = 'chunk_error_reload';
        const lastReload = sessionStorage.getItem(reloadKey);
        const now = Date.now();

        // Only reload if we haven't reloaded in the last 30 seconds
        if (!lastReload || (now - parseInt(lastReload, 10)) > 30000) {
          console.warn('[ChunkErrorHandler] Detected stale chunk, reloading page...');
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
        } else {
          console.error('[ChunkErrorHandler] Chunk error persists after reload, possible deployment issue');
        }
      }
    };

    // Also handle unhandled promise rejections for dynamic imports
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const message = error?.message || String(error);

      const isChunkError =
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError') ||
        message.includes('Failed to fetch dynamically imported module');

      if (isChunkError) {
        const reloadKey = 'chunk_error_reload';
        const lastReload = sessionStorage.getItem(reloadKey);
        const now = Date.now();

        if (!lastReload || (now - parseInt(lastReload, 10)) > 30000) {
          console.warn('[ChunkErrorHandler] Detected stale dynamic import, reloading page...');
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
