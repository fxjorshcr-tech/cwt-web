// src/app/payment/callback/page.tsx
// Callback de Tilopay - SOLO procesa y cierra, NUNCA muestra confirmación
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'done' | 'failed'>('processing');
  const [isApproved, setIsApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function processPaymentCallback() {
      try {
        // Extract Tilopay callback parameters
        const code = searchParams.get('code') || '';
        const description = decodeURIComponent(searchParams.get('description') || '');
        const authCode = searchParams.get('auth') || '';
        const orderId = searchParams.get('order') || '';
        const transactionId = searchParams.get('tilopay-transaction') || searchParams.get('tpt') || '';
        const orderHash = searchParams.get('OrderHash') || '';
        const returnDataEncoded = searchParams.get('returnData') || '';

        // Decode returnData to get bookingId
        let bookingId: string | null = null;
        let tripIds: string[] = [];

        if (returnDataEncoded) {
          try {
            const decoded = JSON.parse(atob(returnDataEncoded));
            bookingId = decoded.bookingId || null;
            tripIds = decoded.tripIds || [];
          } catch (e) {
            console.error('Failed to decode returnData:', e);
          }
        }

        // Fallback: extract bookingId from orderId
        if (!bookingId && orderId) {
          bookingId = orderId.startsWith('booking_') ? orderId : `booking_${orderId}`;
        }

        // Check if payment was successful
        const approved = code === '1';
        setIsApproved(approved);

        // Determine payment status for logging
        let paymentStatus: 'approved' | 'rejected' | 'error' | 'cancelled' = 'rejected';
        if (approved) {
          paymentStatus = 'approved';
        } else if (code === '0' || code === '') {
          paymentStatus = 'cancelled';
        } else if (code === '-1' || code === '99') {
          paymentStatus = 'error';
        }

        // SIEMPRE intentar enviar mensaje al padre, incluso si opener parece null
        // Algunos browsers pierden la referencia pero el mensaje aún puede llegar
        const messageData = {
          type: 'PAYMENT_COMPLETE',
          success: approved,
          transactionId,
          authCode,
          bookingId,
          code,
          description,
        };

        console.log('[Callback] Attempting to send message to parent:', messageData);

        // Intentar múltiples métodos para enviar el mensaje
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(messageData, '*');
            console.log('[Callback] Message sent via window.opener');
          }
        } catch (e) {
          console.log('[Callback] window.opener failed:', e);
        }

        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(messageData, '*');
            console.log('[Callback] Message sent via window.parent');
          }
        } catch (e) {
          console.log('[Callback] window.parent failed:', e);
        }

        // También intentar broadcast
        try {
          const bc = new BroadcastChannel('payment_channel');
          bc.postMessage(messageData);
          bc.close();
          console.log('[Callback] Message sent via BroadcastChannel');
        } catch (e) {
          console.log('[Callback] BroadcastChannel failed:', e);
        }

        // Procesar el backend (sin bloquear)
        if (bookingId) {
          // Log payment result
          fetch('/api/payment/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              status: paymentStatus,
              amount: 0,
              tripIds,
              tilopayTransactionId: transactionId,
              tilopayAuthCode: authCode,
              tilopayCode: code,
              tilopayDescription: description,
              tilopayOrderId: orderId,
              tilopayOrderHash: orderHash,
            }),
          }).catch(err => console.error('Failed to log payment:', err));

          // Update payment status
          fetch('/api/payment/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentStatus: approved ? 'approved' : 'rejected',
              transactionId,
              authCode,
              paymentCode: code,
              paymentDescription: description,
            }),
          }).catch(err => console.error('Failed to update payment status:', err));
        }

        // Marcar como completado
        if (!approved) {
          setErrorMessage(description || 'Payment was not approved');
          setStatus('failed');
        } else {
          setStatus('done');
        }

        // Intentar cerrar la ventana
        setTimeout(() => {
          try {
            window.close();
          } catch (e) {
            console.log('[Callback] window.close failed:', e);
          }
        }, 500);

      } catch (err) {
        console.error('Error processing payment callback:', err);
        setStatus('failed');
        setErrorMessage('Error processing payment');
      }
    }

    processPaymentCallback();
  }, [searchParams]);

  // Loading
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Processing payment...</p>
        </div>
      </div>
    );
  }

  // Success - show close button
  if (status === 'done' && isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 max-w-sm">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Please close this window to see your booking confirmation.
          </p>
          <button
            onClick={() => {
              try { window.close(); } catch(e) { /* ignore */ }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg"
          >
            <X className="h-6 w-6" />
            Close This Window
          </button>
          <p className="text-sm text-gray-400 mt-4">
            If this window doesn't close, please close it manually.
          </p>
        </div>
      </div>
    );
  }

  // Failed
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-sm">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          {errorMessage || 'There was an issue with your payment.'}
        </p>
        <button
          onClick={() => {
            try { window.close(); } catch(e) { /* ignore */ }
          }}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg"
        >
          <X className="h-6 w-6" />
          Close This Window
        </button>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
