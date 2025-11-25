// src/app/global-error.tsx
// Root-level Error Boundary for critical errors (replaces entire layout)
'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Critical application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg
                style={{ width: '40px', height: '40px', color: '#dc2626' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Critical Error
            </h1>

            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>

              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                Go Home
              </a>
            </div>

            {error.digest && (
              <p style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '1rem'
              }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
