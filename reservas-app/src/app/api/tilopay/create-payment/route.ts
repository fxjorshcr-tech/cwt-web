// src/app/api/tilopay/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getTilopayToken,
  createTilopayPayment,
  encodeReturnData,
  TILOPAY_CONFIG,
} from '@/lib/tilopay';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface PaymentRequestBody {
  bookingId: string;
  amount: number;
  currency?: string;
  tripIds?: string[];
  customerInfo?: CustomerInfo;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequestBody = await request.json();

    // Validate required fields
    if (!body.bookingId || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount' },
        { status: 400 }
      );
    }

    const { bookingId, amount, currency = 'USD', tripIds, customerInfo } = body;

    // Get Tilopay access token
    const token = await getTilopayToken();

    // Build the redirect URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUrl = `${appUrl}/payment/callback`;

    // Encode booking data to return after payment
    const returnData = encodeReturnData({
      bookingId,
      tripIds,
      timestamp: Date.now(),
    });

    // Use customer info if provided, otherwise use defaults
    const firstName = customerInfo?.firstName || 'Customer';
    const lastName = customerInfo?.lastName || 'CWT';
    const email = customerInfo?.email || 'customer@cantwaittravelcr.com';
    const phone = customerInfo?.phone || '00000000';
    const country = customerInfo?.country || 'CR';

    // Map country code to state for Tilopay
    const stateMap: Record<string, string> = {
      CR: 'CR-SJ',
      US: 'US-FL',
      CA: 'CA-ON',
      MX: 'MX-DIF',
      GT: 'GT-GU',
      PA: 'PA-8',
      CO: 'CO-DC',
      OTHER: 'CR-SJ',
    };

    // Create payment request with customer billing info
    const paymentResponse = await createTilopayPayment(token, {
      redirect: redirectUrl,
      key: TILOPAY_CONFIG.API_KEY,
      amount: amount.toFixed(2),
      currency: currency,
      orderNumber: bookingId,
      capture: '1', // Capture immediately
      subscription: '0', // Don't save card
      platform: 'CWT-Web',
      billToFirstName: firstName,
      billToLastName: lastName,
      billToEmail: email,
      billToTelephone: phone,
      billToAddress: 'San Jose',
      billToAddress2: 'Costa Rica',
      billToCity: 'San Jose',
      billToState: stateMap[country] || 'CR-SJ',
      billToZipPostCode: '10101',
      billToCountry: country,
      returnData: returnData,
      hashVersion: 'V2',
    });

    if (!paymentResponse.success) {
      console.error('Tilopay payment creation failed:', paymentResponse);
      return NextResponse.json(
        { error: paymentResponse.message || 'Failed to create payment' },
        { status: 500 }
      );
    }

    // Return the payment URL to redirect the user
    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.url,
      bookingId,
    });
  } catch (error) {
    console.error('Error creating Tilopay payment:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating payment' },
      { status: 500 }
    );
  }
}
