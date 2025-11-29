// src/app/api/payment/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateBookingNumber,
  generateShuttleVoucher,
  generateTourVoucher,
} from '@/lib/booking-numbers';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpdatePaymentStatusRequest {
  bookingId: string;
  bookingType?: 'shuttle' | 'tour';
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

    const { bookingId, bookingType = 'shuttle', paymentStatus, transactionId, authCode, paymentCode, paymentDescription } = body;

    console.log('[Payment] Updating status for booking:', bookingId, {
      bookingType,
      paymentStatus,
      transactionId,
      authCode,
    });

    if (bookingType === 'tour') {
      // Generate booking number and voucher for approved payments
      let bookingNumber: string | null = null;
      let voucherNumber: string | null = null;

      if (paymentStatus === 'approved') {
        bookingNumber = await generateBookingNumber();
        voucherNumber = generateTourVoucher(bookingNumber, 1);
        console.log('[Payment] Generated tour booking number:', bookingNumber, 'voucher:', voucherNumber);
      }

      // Update tour_bookings table for tour bookings
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
          ...(bookingNumber && { booking_number: bookingNumber }),
          ...(voucherNumber && { voucher_number: voucherNumber }),
        })
        .eq('booking_id', bookingId)
        .select();

      if (error) {
        console.error('[Payment] Error updating tour payment status:', error);

        // Check if it's a column doesn't exist error
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          console.log('[Payment] Payment columns might not exist in tour_bookings table yet');
          // Return success anyway - the columns need to be added to Supabase
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

      console.log('[Payment] Successfully updated tour booking');

      return NextResponse.json({
        success: true,
        updatedTours: data?.length || 0,
        bookingNumber,
        voucherNumber,
      });
    }

    // Generate booking number for approved shuttle payments
    let bookingNumber: string | null = null;

    if (paymentStatus === 'approved') {
      bookingNumber = await generateBookingNumber();
      console.log('[Payment] Generated shuttle booking number:', bookingNumber);
    }

    // First, get all trips to assign individual vouchers
    const { data: existingTrips } = await supabase
      .from('trips')
      .select('id')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    // Update all trips for this booking with payment info (shuttles)
    const { data, error } = await supabase
      .from('trips')
      .update({
        payment_status: paymentStatus,
        payment_transaction_id: transactionId || null,
        payment_auth_code: authCode || null,
        payment_code: paymentCode || null,
        payment_description: paymentDescription || null,
        payment_date: paymentStatus === 'approved' ? new Date().toISOString() : null,
        ...(bookingNumber && { booking_number: bookingNumber }),
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

    // Assign individual vouchers to each trip
    const voucherNumbers: string[] = [];
    if (bookingNumber && existingTrips && existingTrips.length > 0) {
      for (let i = 0; i < existingTrips.length; i++) {
        const voucherNumber = generateShuttleVoucher(bookingNumber, i + 1);
        voucherNumbers.push(voucherNumber);

        await supabase
          .from('trips')
          .update({ voucher_number: voucherNumber })
          .eq('id', existingTrips[i].id);
      }
      console.log('[Payment] Assigned vouchers:', voucherNumbers);
    }

    console.log('[Payment] Successfully updated', data?.length || 0, 'trips');

    return NextResponse.json({
      success: true,
      updatedTrips: data?.length || 0,
      bookingNumber,
      voucherNumbers,
    });
  } catch (error) {
    console.error('[Payment] Error in update-status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
