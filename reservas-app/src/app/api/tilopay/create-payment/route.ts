// src/app/api/tilopay/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getTilopayToken,
  createTilopayPayment,
  encodeReturnData,
  TILOPAY_CONFIG,
} from '@/lib/tilopay';

interface PaymentRequestBody {
  bookingId: string;
  amount: number;
  currency?: string;
  tripIds?: string[];
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

    const { bookingId, amount, currency = 'USD', tripIds } = body;

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

    // Create payment request
    // Nota: Tilopay captura los datos del cliente en su formulario de pago
    // Enviamos valores placeholder que serán reemplazados por el usuario
    const paymentResponse = await createTilopayPayment(token, {
      redirect: redirectUrl,
      key: TILOPAY_CONFIG.API_KEY,
      amount: amount.toFixed(2),
      currency: currency,
      orderNumber: bookingId,
      capture: '1', // Capture immediately
      subscription: '0', // Don't save card
      platform: 'CWT-Web',
      billToFirstName: 'Customer',
      billToLastName: 'CWT',
      billToEmail: 'customer@cantwaittravelcr.com',
      billToTelephone: '00000000',
      billToAddress: 'San Jose',
      billToAddress2: 'Costa Rica',
      billToCity: 'San Jose',
      billToState: 'CR-SJ',
      billToZipPostCode: '10101',
      billToCountry: 'CR',
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
