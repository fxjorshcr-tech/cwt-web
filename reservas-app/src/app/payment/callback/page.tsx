// src/app/payment/callback/page.tsx
// Callback de Tilopay - SOLO procesa, envía mensaje y CIERRA
// NO muestra ninguna confirmación - solo "Cerrando..."
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  // Solo 2 estados: procesando o intentando cerrar
  const [status, setStatus] = useState<'processing' | 'closing'>('processing');

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

        // Cambiar a estado "cerrando" inmediatamente
        setStatus('closing');

        // Intentar cerrar la ventana múltiples veces
        const tryClose = () => {
          try {
            window.close();
          } catch (e) {
            console.log('[Callback] window.close failed:', e);
          }
        };

        // Intentar cerrar inmediatamente
        tryClose();
        // Intentar de nuevo después de 100ms
        setTimeout(tryClose, 100);
        // Y otra vez después de 500ms
        setTimeout(tryClose, 500);
        // Y una última vez después de 1 segundo
        setTimeout(tryClose, 1000);

      } catch (err) {
        console.error('Error processing payment callback:', err);
        // Aún así intentar cerrar
        setStatus('closing');
        setTimeout(() => {
          try { window.close(); } catch (e) { /* ignore */ }
        }, 100);
      }
    }

    processPaymentCallback();
  }, [searchParams]);

  // Siempre mostrar UI mínima - solo "Cerrando..." o botón para cerrar manualmente
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        {status === 'processing' ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Processing...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">Closing...</p>
            <button
              onClick={() => {
                try { window.close(); } catch(e) { /* ignore */ }
              }}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Click here if window doesn't close
            </button>
          </>
        )}
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
