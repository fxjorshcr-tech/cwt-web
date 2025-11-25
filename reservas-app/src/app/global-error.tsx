// src/app/global-error.tsx
// ✅ MEJORADO: Error boundary con mejor UX y más información
'use client';

import { useEffect, useState } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error for debugging
    console.error('Critical application error:', error);

    // ✅ Try to send error to analytics/monitoring if available
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: true,
        });
      } catch {
        // Ignore analytics errors
      }
    }
  }, [error]);

  // ✅ Handle full page reload as alternative to reset
  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      // Clear any corrupted state
      try {
        sessionStorage.clear();
      } catch {
        // Ignore storage errors
      }
      window.location.href = '/';
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Can&apos;t Wait Travel</title>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          <div style={{ maxWidth: '450px', textAlign: 'center' }}>
            {/* Error Icon */}
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
              marginBottom: '0.5rem'
            }}>
              Something Went Wrong
            </h1>

            <p style={{
              color: '#6b7280',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>
              We apologize for the inconvenience. Please try refreshing the page.
            </p>

            <p style={{
              color: '#9ca3af',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              If the problem persists, please contact us via WhatsApp.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Try Again
              </button>

              <button
                onClick={handleHardRefresh}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  fontWeight: '600',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Go to Home
              </button>
            </div>

            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/50685962438?text=Hi%2C%20I%20encountered%20an%20error%20on%20your%20website"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#22c55e',
                color: 'white',
                fontWeight: '500',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact Support
            </a>

            {/* Error Details Toggle */}
            {(error.digest || error.message) && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>

                {showDetails && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'left',
                    wordBreak: 'break-word'
                  }}>
                    {error.digest && <p><strong>Error ID:</strong> {error.digest}</p>}
                    {error.message && <p style={{ marginTop: '0.25rem' }}><strong>Message:</strong> {error.message}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

// ✅ Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
