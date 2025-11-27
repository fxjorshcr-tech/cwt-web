// src/app/payment/callback/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';

interface PaymentResult {
  success: boolean;
  code: string;
  description: string;
  authCode: string;
  orderId: string;
  transactionId: string;
  bookingId: string | null;
}

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [processing, setProcessing] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

        // Check if payment was successful
        const isApproved = code === '1';

        // Log payment info (campos de pago se agregarán después en Supabase)
        if (bookingId && isApproved) {
          console.log('Payment approved for booking:', bookingId, {
            transactionId,
            orderId,
            authCode,
          });
          // TODO: Agregar campos payment_status, payment_id, etc. a la tabla trips en Supabase
          // Por ahora guardamos en special_requests como respaldo
          const { error: updateError } = await supabase
            .from('trips')
            .update({
              special_requests: supabase.rpc ? undefined : `PAID - Transaction: ${transactionId}, Auth: ${authCode}`,
            })
            .eq('booking_id', bookingId);

          if (updateError) {
            console.error('Failed to log payment:', updateError);
          }
        }

        setResult({
          success: isApproved,
          code,
          description,
          authCode,
          orderId,
          transactionId,
          bookingId,
        });

        setProcessing(false);

        // If successful, redirect to confirmation after a delay
        if (isApproved && bookingId) {
          setTimeout(() => {
            router.push(`/confirmation?booking_id=${bookingId}&payment=success`);
          }, 3000);
        }
      } catch (err) {
        console.error('Error processing payment callback:', err);
        setError('Failed to process payment response');
        setProcessing(false);
      }
    }

    processPaymentCallback();
  }, [searchParams, router, supabase]);

  if (processing) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4 text-center">
            <CardHeader>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <CardTitle>Processing Payment</CardTitle>
              <CardDescription>Please wait while we confirm your payment...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-yellow-600">Processing Error</CardTitle>
              <CardDescription>{error}</CardDescription>
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

  if (result?.success) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-600">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{result.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authorization:</span>
                  <span className="font-medium">{result.authCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order:</span>
                  <span className="font-medium">{result.orderId}</span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Redirecting to confirmation page...
              </p>

              <Button
                onClick={() => router.push(`/confirmation?booking_id=${result.bookingId}&payment=success`)}
                className="w-full min-h-[48px]"
              >
                View Confirmation
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Payment failed
  return (
    <>
      <BookingNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Payment Failed</CardTitle>
            <CardDescription>
              {result?.description || 'Your payment could not be processed.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.code && (
              <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700">
                Error code: {result.code}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1 min-h-[48px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (result?.bookingId) {
                    router.push(`/summary?booking_id=${result.bookingId}`);
                  } else {
                    router.push('/');
                  }
                }}
                className="flex-1 min-h-[48px]"
              >
                Try Again
              </Button>
            </div>
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
        <>
          <BookingNavbar />
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
