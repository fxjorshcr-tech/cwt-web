// src/app/payment/callback/page.tsx
// Callback de Tilopay - Procesa el pago y cierra el popup inmediatamente
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'closing'>('processing');
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

        // Log payment result
        if (bookingId) {
          try {
            await fetch('/api/payment/log', {
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
                rawResponse: {
                  code,
                  description,
                  auth: authCode,
                  order: orderId,
                  transactionId,
                  orderHash,
                  returnData: returnDataEncoded,
                },
              }),
            });
          } catch (err) {
            console.error('Failed to log payment:', err);
          }

          // Update payment status in trips table
          try {
            await fetch('/api/payment/update-status', {
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
            });
          } catch (err) {
            console.error('Failed to update payment status:', err);
          }

          // Send confirmation email if approved
          if (isApproved) {
            try {
              await fetch('/api/email/send-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookingId,
                  transactionId,
                  authCode,
                }),
              });
              console.log('Confirmation email sent');
            } catch (err) {
              console.error('Failed to send confirmation email:', err);
            }
          }
        }

        // Si estamos en un popup, enviar mensaje y cerrar INMEDIATAMENTE
        if (window.opener && !window.opener.closed) {
          console.log('Sending message to parent and closing popup...');

          // Enviar mensaje a la ventana padre
          window.opener.postMessage({
            type: 'PAYMENT_COMPLETE',
            success: isApproved,
            transactionId,
            authCode,
            bookingId,
            code,
            description,
          }, '*');

          // Cambiar estado a "closing" para mostrar mensaje apropiado
          setStatus('closing');

          // Cerrar el popup después de un breve momento
          setTimeout(() => {
            window.close();
          }, 500);

          // Fallback: si window.close() no funciona (algunos browsers lo bloquean)
          // redirigir después de 2 segundos
          setTimeout(() => {
            if (isApproved && bookingId) {
              window.location.href = `/confirmation?booking_id=${bookingId}&payment=success`;
            }
          }, 2500);

        } else {
          // No estamos en popup, mostrar resultado normal
          if (isApproved) {
            setStatus('success');
            setTimeout(() => {
              if (bookingId) {
                router.push(`/confirmation?booking_id=${bookingId}&payment=success`);
              }
            }, 2000);
          } else {
            setStatus('failed');
            setErrorMessage(description || 'Payment failed');
          }
        }

      } catch (err) {
        console.error('Error processing payment callback:', err);
        setStatus('failed');
        setErrorMessage('Failed to process payment');
      }
    }

    processPaymentCallback();
  }, [searchParams, router]);

  // Estado: Procesando
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4 text-center">
          <CardHeader>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <CardTitle>Processing Payment</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Estado: Cerrando popup
  if (status === 'closing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4 text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>Closing this window...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Estado: Éxito (solo si no es popup)
  if (status === 'success') {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4 text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-600">Payment Successful!</CardTitle>
              <CardDescription>Redirecting to confirmation...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  // Estado: Fallido
  return (
    <>
      <BookingNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Payment Failed</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full min-h-[48px]">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
