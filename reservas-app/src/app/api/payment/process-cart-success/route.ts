// src/app/api/payment/process-cart-success/route.ts
// Procesa el pago exitoso del carrito: genera booking numbers, vouchers y envía email consolidado
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateBookingNumber,
  generateShuttleVoucher,
  generateTourVoucher,
} from '@/lib/booking-numbers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProcessCartRequest {
  shuttleBookingIds: string[];
  tourIds: number[];
  transactionId?: string;
  authCode?: string;
  paymentCode?: string;
  paymentDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessCartRequest = await request.json();
    const { shuttleBookingIds = [], tourIds = [], transactionId, authCode, paymentCode, paymentDescription } = body;

    if (shuttleBookingIds.length === 0 && tourIds.length === 0) {
      return NextResponse.json({ error: 'No items to process' }, { status: 400 });
    }

    console.log('[ProcessCart] Processing cart success:', { shuttleBookingIds, tourIds });

    // 1. Generate the main booking number
    const bookingNumber = await generateBookingNumber();
    console.log('[ProcessCart] Generated booking number:', bookingNumber);

    // 2. Update shuttles with booking number, vouchers and payment status
    if (shuttleBookingIds.length > 0) {
      for (let i = 0; i < shuttleBookingIds.length; i++) {
        const voucherNumber = generateShuttleVoucher(bookingNumber, i + 1);

        const { error } = await supabase
          .from('trips')
          .update({
            booking_number: bookingNumber,
            voucher_number: voucherNumber,
            payment_status: 'approved',
            transaction_id: transactionId,
            auth_code: authCode,
            payment_code: paymentCode,
            payment_description: paymentDescription,
          })
          .eq('booking_id', shuttleBookingIds[i]);

        if (error) {
          console.error(`[ProcessCart] Error updating shuttle ${shuttleBookingIds[i]}:`, error);
        } else {
          console.log(`[ProcessCart] Updated shuttle ${shuttleBookingIds[i]} with voucher ${voucherNumber}`);
        }
      }
    }

    // 3. Update tours with booking number, vouchers and payment status
    if (tourIds.length > 0) {
      for (let i = 0; i < tourIds.length; i++) {
        const voucherNumber = generateTourVoucher(bookingNumber, i + 1);

        const { error } = await supabase
          .from('tour_bookings')
          .update({
            booking_number: bookingNumber,
            voucher_number: voucherNumber,
            status: 'approved',
            payment_status: 'approved',
            transaction_id: transactionId,
            auth_code: authCode,
          })
          .eq('id', tourIds[i]);

        if (error) {
          console.error(`[ProcessCart] Error updating tour ${tourIds[i]}:`, error);
        } else {
          console.log(`[ProcessCart] Updated tour ${tourIds[i]} with voucher ${voucherNumber}`);
        }
      }
    }

    // 4. Send consolidated confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cantwaittravelcr.com';
    try {
      const emailResponse = await fetch(`${baseUrl}/api/email/send-cart-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingNumber,
          shuttleBookingIds,
          tourIds,
          transactionId,
          authCode,
        }),
      });

      if (!emailResponse.ok) {
        console.error('[ProcessCart] Failed to send email:', await emailResponse.text());
      } else {
        console.log('[ProcessCart] Confirmation email sent');
      }
    } catch (emailError) {
      console.error('[ProcessCart] Error sending email:', emailError);
    }

    return NextResponse.json({
      success: true,
      bookingNumber,
      shuttleVouchers: shuttleBookingIds.map((_, i) => generateShuttleVoucher(bookingNumber, i + 1)),
      tourVouchers: tourIds.map((_, i) => generateTourVoucher(bookingNumber, i + 1)),
    });
  } catch (error) {
    console.error('[ProcessCart] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
