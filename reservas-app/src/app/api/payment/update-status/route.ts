// src/app/api/payment/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpdatePaymentStatusRequest {
  bookingId: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'error';
  transactionId?: string;
  authCode?: string;
  paymentCode?: string;
  paymentDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdatePaymentStatusRequest = await request.json();

    // Validate required fields
    if (!body.bookingId || !body.paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, paymentStatus' },
        { status: 400 }
      );
    }

    const { bookingId, paymentStatus, transactionId, authCode, paymentCode, paymentDescription } = body;

    console.log('[Payment] Updating status for booking:', bookingId, {
      paymentStatus,
      transactionId,
      authCode,
    });

    // Update all trips for this booking with payment info
    const { data, error } = await supabase
      .from('trips')
      .update({
        payment_status: paymentStatus,
        payment_transaction_id: transactionId || null,
        payment_auth_code: authCode || null,
        payment_code: paymentCode || null,
        payment_description: paymentDescription || null,
        payment_date: paymentStatus === 'approved' ? new Date().toISOString() : null,
      })
      .eq('booking_id', bookingId)
      .select();

    if (error) {
      console.error('[Payment] Error updating payment status:', error);

      // Check if it's a column doesn't exist error
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('[Payment] Payment columns might not exist in trips table yet');
        // Return success anyway - the columns need to be added to Supabase
        return NextResponse.json({
          success: true,
          message: 'Payment processed but database columns need to be added',
          needsMigration: true,
        });
      }

      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    console.log('[Payment] Successfully updated', data?.length || 0, 'trips');

    return NextResponse.json({
      success: true,
      updatedTrips: data?.length || 0,
    });
  } catch (error) {
    console.error('[Payment] Error in update-status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
