// src/app/payment/callback/page.tsx
// Callback de Tilopay - procesa el resultado y REDIRIGE a confirmación
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, XCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'redirecting' | 'failed'>('processing');
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

        // Decode returnData to get bookingId and booking type
        let bookingId: string | null = null;
        let bookingType: 'shuttle' | 'tour' | 'cart' = 'shuttle';
        let tripIds: string[] = [];
        let tourBookingId: string | null = null;
        let cartItems: { shuttles: { id: string; bookingId: string }[]; tours: { id: string }[] } | null = null;

        if (returnDataEncoded) {
          try {
            const decoded = JSON.parse(atob(returnDataEncoded));
            bookingId = decoded.bookingId || null;
            bookingType = decoded.bookingType || 'shuttle';
            tripIds = decoded.tripIds || [];
            tourBookingId = decoded.tourBookingId || null;
            cartItems = decoded.cartItems || null;
          } catch (e) {
            console.error('Failed to decode returnData:', e);
          }
        }

        // Fallback: extract bookingId from orderId
        if (!bookingId && orderId) {
          bookingId = orderId.startsWith('booking_') || orderId.startsWith('tour_') || orderId.startsWith('cart_') ? orderId : `booking_${orderId}`;
        }

        const isTourBooking = bookingType === 'tour';
        const isCartBooking = bookingType === 'cart';

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

        console.log('[Callback] Payment result:', { code, approved, bookingId, bookingType, transactionId });

        // Procesar el backend
        if (bookingId) {
          // Log payment result
          try {
            await fetch('/api/payment/log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId,
                bookingType,
                status: paymentStatus,
                amount: 0,
                tripIds,
                tourBookingId,
                tilopayTransactionId: transactionId,
                tilopayAuthCode: authCode,
                tilopayCode: code,
                tilopayDescription: description,
                tilopayOrderId: orderId,
                tilopayOrderHash: orderHash,
              }),
            });
          } catch (err) {
            console.error('Failed to log payment:', err);
          }

          // Update payment status
          if (isCartBooking && cartItems) {
            // Update payment status for all cart items
            try {
              // Update all shuttle bookings
              const uniqueShuttleBookingIds = Array.from(new Set(cartItems.shuttles.map(s => s.bookingId)));
              for (const shuttleBookingId of uniqueShuttleBookingIds) {
                await fetch('/api/payment/update-status', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId: shuttleBookingId,
                    bookingType: 'shuttle',
                    paymentStatus: approved ? 'approved' : 'rejected',
                    transactionId,
                    authCode,
                    paymentCode: code,
                    paymentDescription: description,
                  }),
                });
              }

              // Update all tour bookings
              for (const tour of cartItems.tours) {
                // Find the booking_id for this tour from Supabase
                await fetch('/api/payment/update-tour-by-id', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    tourId: tour.id,
                    paymentStatus: approved ? 'approved' : 'rejected',
                    transactionId,
                    authCode,
                    paymentCode: code,
                    paymentDescription: description,
                  }),
                });
              }
            } catch (err) {
              console.error('Failed to update cart payment status:', err);
            }
          } else {
            try {
              await fetch('/api/payment/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookingId,
                  bookingType,
                  paymentStatus: approved ? 'approved' : 'rejected',
                  transactionId,
                  authCode,
                  paymentCode: code,
                  paymentDescription: description,
                }),
              });
            } catch (err) {
              console.error('Failed to update payment status:', err);
            }
          }

          // Enviar email de confirmación si el pago fue aprobado
          if (approved) {
            try {
              console.log('[Callback] Sending confirmation email for:', bookingId, 'type:', bookingType);

              if (isCartBooking && cartItems) {
                // Send emails for all cart items
                const uniqueShuttleBookingIds = Array.from(new Set(cartItems.shuttles.map(s => s.bookingId)));
                for (const shuttleBookingId of uniqueShuttleBookingIds) {
                  await fetch('/api/email/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      bookingId: shuttleBookingId,
                      transactionId,
                      authCode,
                    }),
                  });
                }
                for (const tour of cartItems.tours) {
                  await fetch('/api/email/send-tour-confirmation-by-id', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      tourId: tour.id,
                      transactionId,
                      authCode,
                    }),
                  });
                }
              } else if (isTourBooking) {
                await fetch('/api/email/send-tour-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId,
                    transactionId,
                    authCode,
                  }),
                });
              } else {
                await fetch('/api/email/send-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId,
                    transactionId,
                    authCode,
                  }),
                });
              }
              console.log('[Callback] Email sent');
            } catch (err) {
              console.error('Failed to send confirmation email:', err);
            }
          }
        }

        // Si el pago fue exitoso, redirigir a confirmación
        if (approved && bookingId) {
          setStatus('redirecting');
          // Pequeño delay para mostrar el mensaje
          setTimeout(() => {
            if (isCartBooking && cartItems) {
              // Build query params with all cart item IDs
              const params = new URLSearchParams();
              params.set('cart_booking_id', bookingId);
              if (cartItems.shuttles.length > 0) {
                const shuttleBookingIds = Array.from(new Set(cartItems.shuttles.map(s => s.bookingId)));
                params.set('shuttle_booking_ids', shuttleBookingIds.join(','));
              }
              if (cartItems.tours.length > 0) {
                params.set('tour_ids', cartItems.tours.map(t => t.id).join(','));
              }
              router.push(`/confirmation?${params.toString()}`);
            } else if (isTourBooking) {
              router.push(`/confirmation?tour_booking_id=${bookingId}`);
            } else {
              router.push(`/confirmation?booking_id=${bookingId}`);
            }
          }, 500);
        } else {
          // Pago fallido - mostrar error
          setErrorMessage(description || 'Payment was not approved. Please try again.');
          setStatus('failed');
        }

      } catch (err) {
        console.error('Error processing payment callback:', err);
        setStatus('failed');
        setErrorMessage('Error processing payment. Please contact support.');
      }
    }

    processPaymentCallback();
  }, [searchParams, router]);

  // Procesando
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Processing your payment...</p>
        </div>
      </div>
    );
  }

  // Redirigiendo a confirmación
  if (status === 'redirecting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-green-600 font-bold text-lg">Payment Successful!</p>
          <p className="text-gray-500 text-sm mt-2">Redirecting to confirmation...</p>
        </div>
      </div>
    );
  }

  // Pago fallido
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md mx-4">
        <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          {errorMessage}
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => router.back()}
            className="w-full"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact us on{' '}
          <a
            href="https://wa.me/50685962438"
            className="text-green-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </p>
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
