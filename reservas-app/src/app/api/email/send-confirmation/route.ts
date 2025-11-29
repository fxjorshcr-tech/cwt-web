// src/app/api/email/send-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBookingConfirmationEmail, BookingEmailData } from '@/lib/email';
import { formatBookingId } from '@/lib/formatters';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SendConfirmationRequest {
  bookingId: string;
  transactionId?: string;
  authCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendConfirmationRequest = await request.json();

    // Validate required fields
    if (!body.bookingId) {
      return NextResponse.json(
        { error: 'Missing required field: bookingId' },
        { status: 400 }
      );
    }

    const { bookingId, transactionId, authCode } = body;

    console.log('[Email API] Fetching booking data for:', bookingId);

    // Fetch all trips for this booking
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .eq('booking_id', bookingId);

    if (tripsError || !trips || trips.length === 0) {
      console.error('[Email API] Error fetching trips:', tripsError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get customer info from first trip
    const firstTrip = trips[0];
    const customerEmail = firstTrip.customer_email;
    const customerName = `${firstTrip.customer_first_name || ''} ${firstTrip.customer_last_name || ''}`.trim();

    if (!customerEmail) {
      console.error('[Email API] No customer email found for booking:', bookingId);
      return NextResponse.json(
        { error: 'No customer email found' },
        { status: 400 }
      );
    }

    // Format trips for email - include voucher numbers
    const formattedTrips = trips.map(trip => ({
      origin: trip.from_location || trip.origin_location || 'Unknown',
      destination: trip.to_location || trip.destination_location || 'Unknown',
      date: trip.date || trip.travel_date || 'TBD',
      time: trip.pickup_time || trip.time || 'TBD',
      passengers: (trip.adults || 0) + (trip.children || 0) || trip.passenger_count || 1,
      price: trip.final_price || trip.price || 0,
      pickupAddress: trip.pickup_address || null,
      dropoffAddress: trip.dropoff_address || null,
      voucherNumber: trip.voucher_number || null,
    }));

    // Use booking_number from database if available, otherwise format the old booking ID
    const formattedBookingId = firstTrip.booking_number || formatBookingId(bookingId);

    // Calculate total
    const totalAmount = formattedTrips.reduce((sum, trip) => sum + trip.price, 0);

    // Prepare email data
    const emailData: BookingEmailData = {
      customerEmail,
      customerName: customerName || 'Valued Customer',
      bookingId: formattedBookingId, // Use formatted booking ID (CWT000XXX)
      trips: formattedTrips,
      totalAmount,
      transactionId,
      authCode,
    };

    console.log('[Email API] Sending confirmation to:', customerEmail);
    console.log('[Email API] Email data:', JSON.stringify({
      customerEmail,
      customerName,
      bookingId,
      tripsCount: formattedTrips.length,
      totalAmount,
    }));

    // Send the email
    const emailSent = await sendBookingConfirmationEmail(emailData);

    if (!emailSent) {
      console.error('[Email API] Failed to send email - sendBookingConfirmationEmail returned false');
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('[Email API] Email sent successfully to:', customerEmail);

    // Update trips to mark email as sent
    await supabase
      .from('trips')
      .update({ confirmation_email_sent: true })
      .eq('booking_id', bookingId);

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
      sentTo: customerEmail,
    });
  } catch (error) {
    console.error('[Email API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
