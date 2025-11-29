// src/app/api/payment/update-tour-by-id/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpdateTourPaymentRequest {
  tourId: string;
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'error';
  transactionId?: string;
  authCode?: string;
  paymentCode?: string;
  paymentDescription?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateTourPaymentRequest = await request.json();

    // Validate required fields
    if (!body.tourId || !body.paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: tourId, paymentStatus' },
        { status: 400 }
      );
    }

    const { tourId, paymentStatus, transactionId, authCode, paymentCode, paymentDescription } = body;

    console.log('[Payment] Updating tour status by ID:', tourId, {
      paymentStatus,
      transactionId,
      authCode,
    });

    // Update tour_bookings table by ID
    const { data, error } = await supabase
      .from('tour_bookings')
      .update({
        status: paymentStatus === 'approved' ? 'confirmed' : paymentStatus,
        payment_status: paymentStatus,
        payment_transaction_id: transactionId || null,
        payment_auth_code: authCode || null,
        payment_code: paymentCode || null,
        payment_description: paymentDescription || null,
        payment_date: paymentStatus === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', tourId)
      .select();

    if (error) {
      console.error('[Payment] Error updating tour payment status:', error);

      // Check if it's a column doesn't exist error
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('[Payment] Payment columns might not exist in tour_bookings table yet');
        return NextResponse.json({
          success: true,
          message: 'Payment processed but database columns need to be added',
          needsMigration: true,
        });
      }

      return NextResponse.json(
        { error: 'Failed to update tour payment status' },
        { status: 500 }
      );
    }

    console.log('[Payment] Successfully updated tour booking by ID');

    return NextResponse.json({
      success: true,
      updatedTours: data?.length || 0,
    });
  } catch (error) {
    console.error('[Payment] Error in update-tour-by-id:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
