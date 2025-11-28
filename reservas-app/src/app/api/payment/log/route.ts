// src/app/api/payment/log/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type PaymentLogStatus = 'initiated' | 'pending' | 'approved' | 'rejected' | 'error' | 'cancelled';

export interface PaymentLogRequest {
  // Required
  bookingId: string;
  status: PaymentLogStatus;
  amount: number;

  // Optional - Trip info
  tripIds?: string[];
  currency?: string;

  // Tilopay response
  tilopayTransactionId?: string;
  tilopayAuthCode?: string;
  tilopayCode?: string;
  tilopayDescription?: string;
  tilopayOrderId?: string;
  tilopayOrderHash?: string;

  // Customer info
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerCountry?: string;

  // Technical
  ipAddress?: string;
  userAgent?: string;

  // Error info
  errorMessage?: string;
  errorCode?: string;

  // Raw data for debugging
  rawRequest?: Record<string, unknown>;
  rawResponse?: Record<string, unknown>;

  // Payment URL
  paymentUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentLogRequest = await request.json();

    // Validate required fields
    if (!body.bookingId || !body.status || body.amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, status, amount' },
        { status: 400 }
      );
    }

    // Get IP and User Agent from request if not provided
    const ipAddress = body.ipAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = body.userAgent || request.headers.get('user-agent') || 'unknown';

    console.log('[PaymentLog] Logging payment:', {
      bookingId: body.bookingId,
      status: body.status,
      amount: body.amount,
      tilopayCode: body.tilopayCode,
    });

    // Insert payment log
    const { data, error } = await supabase
      .from('payment_logs')
      .insert({
        booking_id: body.bookingId,
        trip_ids: body.tripIds || [],
        amount: body.amount,
        currency: body.currency || 'USD',
        status: body.status,
        tilopay_transaction_id: body.tilopayTransactionId || null,
        tilopay_auth_code: body.tilopayAuthCode || null,
        tilopay_code: body.tilopayCode || null,
        tilopay_description: body.tilopayDescription || null,
        tilopay_order_id: body.tilopayOrderId || null,
        tilopay_order_hash: body.tilopayOrderHash || null,
        customer_email: body.customerEmail || null,
        customer_first_name: body.customerFirstName || null,
        customer_last_name: body.customerLastName || null,
        customer_phone: body.customerPhone || null,
        customer_country: body.customerCountry || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        error_message: body.errorMessage || null,
        error_code: body.errorCode || null,
        raw_request: body.rawRequest || null,
        raw_response: body.rawResponse || null,
        payment_url: body.paymentUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[PaymentLog] Error inserting payment log:', error);

      // Check if table doesn't exist
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('[PaymentLog] payment_logs table does not exist - needs migration');
        return NextResponse.json({
          success: false,
          error: 'Payment logs table not found. Please run the migration.',
          needsMigration: true,
        }, { status: 500 });
      }

      return NextResponse.json(
        { error: 'Failed to log payment', details: error.message },
        { status: 500 }
      );
    }

    console.log('[PaymentLog] Successfully logged payment:', data?.id);

    return NextResponse.json({
      success: true,
      logId: data?.id,
    });
  } catch (error) {
    console.error('[PaymentLog] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while logging payment' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payment logs for a booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId parameter' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('payment_logs')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PaymentLog] Error fetching logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs: data || [],
    });
  } catch (error) {
    console.error('[PaymentLog] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
