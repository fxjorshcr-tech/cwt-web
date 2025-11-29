// src/app/payment/callback/page.tsx
// Callback de Tilopay - SOLO procesa y cierra, NUNCA muestra confirmación
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'closing' | 'close-manual' | 'failed'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        const isApproved = code === '1';

        // Determine payment status for logging
        let paymentStatus: 'approved' | 'rejected' | 'error' | 'cancelled' = 'rejected';
        if (isApproved) {
          paymentStatus = 'approved';
        } else if (code === '0' || code === '') {
          paymentStatus = 'cancelled';
        } else if (code === '-1' || code === '99') {
          paymentStatus = 'error';
        }

        // PRIMERO: Si estamos en un popup, enviar mensaje INMEDIATAMENTE
        const isPopup = window.opener && !window.opener.closed;

        if (isPopup) {
          console.log('Popup detected - sending message to parent FIRST');

          // Enviar mensaje al padre ANTES de hacer cualquier otra cosa
          window.opener.postMessage({
            type: 'PAYMENT_COMPLETE',
            success: isApproved,
            transactionId,
            authCode,
            bookingId,
            code,
            description,
          }, '*');

          console.log('Message sent to parent');
        }

        // Ahora procesar el backend (log, update status, email)
        if (bookingId) {
          // Log payment result (no await para no bloquear)
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
              rawResponse: { code, description, auth: authCode, order: orderId, transactionId, orderHash },
            }),
          }).catch(err => console.error('Failed to log payment:', err));

          // Update payment status (no await)
          fetch('/api/payment/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              paymentStatus: isApproved ? 'approved' : 'rejected',
              transactionId,
              authCode,
              paymentCode: code,
              paymentDescription: description,
            }),
          }).catch(err => console.error('Failed to update payment status:', err));

          // Send confirmation email if approved (no await)
          if (isApproved) {
            fetch('/api/email/send-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId, transactionId, authCode }),
            }).catch(err => console.error('Failed to send confirmation email:', err));
          }
        }

        // Si es popup, cerrar inmediatamente
        if (isPopup) {
          setStatus('closing');

          // Intentar cerrar
          window.close();

          // Si después de 1 segundo sigue abierto, mostrar mensaje para cerrar manualmente
          setTimeout(() => {
            setStatus('close-manual');
          }, 1000);

        } else {
          // NO es popup - esto no debería pasar normalmente
          // Redirigir a home o mostrar error
          if (!isApproved) {
            setStatus('failed');
            setErrorMessage(description || 'Payment failed');
          } else {
            // Si no es popup y el pago fue exitoso, redirigir a confirmation
            window.location.href = `/confirmation?booking_id=${bookingId}&payment=success`;
          }
        }

      } catch (err) {
        console.error('Error processing payment callback:', err);
        setStatus('failed');
        setErrorMessage('Failed to process payment');
      }
    }

    processPaymentCallback();
  }, [searchParams]);

  // Estado: Procesando
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

  // Estado: Cerrando
  if (status === 'closing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-green-600 font-bold text-lg">Payment Successful!</p>
          <p className="text-gray-500 text-sm mt-2">Closing window...</p>
        </div>
      </div>
    );
  }

  // Estado: Cerrar manualmente (window.close() no funcionó)
  if (status === 'close-manual') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 max-w-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-green-600 font-bold text-xl mb-2">Payment Successful!</p>
          <p className="text-gray-600 mb-6">
            Your payment has been processed. Please close this window to see your confirmation.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Close This Window
          </button>
        </div>
      </div>
    );
  }

  // Estado: Fallido
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-sm">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold text-xl mb-2">Payment Failed</p>
        <p className="text-gray-600 mb-6">{errorMessage || 'There was an issue processing your payment.'}</p>
        <button
          onClick={() => window.close()}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Close Window
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
