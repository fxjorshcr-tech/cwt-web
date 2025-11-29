// src/app/api/email/send-tour-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { formatBookingId } from '@/lib/formatters';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SendTourConfirmationRequest {
  bookingId: string;
  transactionId?: string;
  authCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendTourConfirmationRequest = await request.json();

    // Validate required fields
    if (!body.bookingId) {
      return NextResponse.json(
        { error: 'Missing required field: bookingId' },
        { status: 400 }
      );
    }

    const { bookingId, transactionId, authCode } = body;

    console.log('[Tour Email API] Fetching tour booking data for:', bookingId);

    // Fetch tour booking
    const { data: tourBooking, error: bookingError } = await supabase
      .from('tour_bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (bookingError || !tourBooking) {
      console.error('[Tour Email API] Error fetching tour booking:', bookingError);
      return NextResponse.json(
        { error: 'Tour booking not found' },
        { status: 404 }
      );
    }

    const customerEmail = tourBooking.customer_email;
    const customerName = `${tourBooking.customer_first_name || ''} ${tourBooking.customer_last_name || ''}`.trim();

    if (!customerEmail) {
      console.error('[Tour Email API] No customer email found for booking:', bookingId);
      return NextResponse.json(
        { error: 'No customer email found' },
        { status: 400 }
      );
    }

    // Use booking_number from database if available, otherwise format the old booking ID
    const formattedBookingId = tourBooking.booking_number || formatBookingId(bookingId);
    const voucherNumber = tourBooking.voucher_number || null;

    // Format date for display
    const tourDate = new Date(tourBooking.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tour Booking Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <table style="width: 100%; background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); border-radius: 12px 12px 0 0;" cellpadding="32" cellspacing="0">
      <tr>
        <td style="text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Tour Booking Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Thank you for choosing Can't Wait Travel CR</p>
        </td>
      </tr>
    </table>

    <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333;">Hello <strong>${customerName || 'Valued Customer'}</strong>,</p>

      <p style="color: #666;">Your tour has been booked and payment has been processed successfully.</p>

      <!-- Booking Reference -->
      <table style="width: 100%; background: linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%); border-left: 4px solid #2563eb; border-radius: 0 12px 12px 0; margin: 20px 0;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <p style="margin: 0; font-size: 12px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
            <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #1a365d; font-family: monospace;">${formattedBookingId}</p>
          </td>
        </tr>
      </table>

      <h2 style="color: #1a365d; font-size: 18px; margin-top: 24px;">Tour Details</h2>

      <!-- Tour Info -->
      <table style="width: 100%; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 12px;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-weight: 600; color: #1a365d; font-size: 18px;">${tourBooking.tour_name}</td>
                <td style="text-align: right; font-weight: 600; color: #22c55e;">$${tourBooking.total_price.toFixed(2)}</td>
              </tr>
            </table>
            ${voucherNumber ? `
            <p style="margin: 8px 0 12px 0; font-size: 11px; color: #6b7280; font-family: monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; display: inline-block;">
              Voucher: ${voucherNumber}
            </p>
            ` : ''}
            <table style="width: 100%; font-size: 14px;" cellpadding="4" cellspacing="0">
              <tr>
                <td style="color: #666;">Date:</td>
                <td style="text-align: right; font-weight: 500;">${tourDate}</td>
              </tr>
              <tr>
                <td style="color: #666;">Adults:</td>
                <td style="text-align: right; font-weight: 500;">${tourBooking.adults}</td>
              </tr>
              ${tourBooking.children > 0 ? `
              <tr>
                <td style="color: #666;">Children:</td>
                <td style="text-align: right; font-weight: 500;">${tourBooking.children}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #666;">Pickup Location:</td>
                <td style="text-align: right; font-weight: 500;">${tourBooking.hotel}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Total -->
      <table style="width: 100%; background: #1a365d; border-radius: 8px; margin-top: 20px;" cellpadding="16" cellspacing="0">
        <tr>
          <td style="color: white; font-size: 16px;">Total Paid:</td>
          <td style="text-align: right; color: white; font-size: 24px; font-weight: bold;">$${tourBooking.total_price.toFixed(2)} USD</td>
        </tr>
      </table>

      ${transactionId ? `
      <!-- Payment Details -->
      <table style="width: 100%; margin-top: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <h3 style="margin: 0 0 12px 0; color: #166534; font-size: 14px;">Payment Details</h3>
            <table style="width: 100%; font-size: 13px; color: #166534;" cellpadding="4" cellspacing="0">
              <tr>
                <td>Transaction ID:</td>
                <td style="text-align: right; font-family: monospace;">${transactionId}</td>
              </tr>
              ${authCode ? `
              <tr>
                <td>Authorization:</td>
                <td style="text-align: right; font-family: monospace;">${authCode}</td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
      ` : ''}

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

      <h2 style="color: #1a365d; font-size: 18px;">What Happens Next?</h2>

      <!-- Steps -->
      <table style="width: 100%; margin-bottom: 16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 44px; vertical-align: top; padding-right: 12px; padding-bottom: 12px;">
            <table style="width: 32px; height: 32px; background: #22c55e; border-radius: 16px;" cellpadding="0" cellspacing="0">
              <tr><td style="text-align: center; color: white; font-weight: bold;">1</td></tr>
            </table>
          </td>
          <td style="vertical-align: top; padding-bottom: 12px;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Confirmation Email Sent</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Save this email with your booking details and receipt.</p>
          </td>
        </tr>
        <tr>
          <td style="width: 44px; vertical-align: top; padding-right: 12px; padding-bottom: 12px;">
            <table style="width: 32px; height: 32px; background: #3b82f6; border-radius: 16px;" cellpadding="0" cellspacing="0">
              <tr><td style="text-align: center; color: white; font-weight: bold;">2</td></tr>
            </table>
          </td>
          <td style="vertical-align: top; padding-bottom: 12px;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Need Assistance?</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Contact us anytime at <a href="mailto:mybooking@cantwaittravelcr.com" style="color: #2563eb; font-weight: 600;">mybooking@cantwaittravelcr.com</a> or via <a href="https://wa.me/50685962438" style="color: #22c55e; font-weight: 600;">WhatsApp</a>.</p>
          </td>
        </tr>
        <tr>
          <td style="width: 44px; vertical-align: top; padding-right: 12px;">
            <table style="width: 32px; height: 32px; background: #f97316; border-radius: 16px;" cellpadding="0" cellspacing="0">
              <tr><td style="text-align: center; color: white; font-weight: bold;">3</td></tr>
            </table>
          </td>
          <td style="vertical-align: top;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Day of Tour</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Be ready at your hotel lobby. We'll pick you up on time. Have an amazing adventure!</p>
          </td>
        </tr>
      </table>

      <!-- Contact -->
      <table style="width: 100%; margin-top: 32px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">Questions? Contact us:</p>
            <a href="mailto:mybooking@cantwaittravelcr.com" style="color: #2563eb; text-decoration: none; font-weight: 500;">mybooking@cantwaittravelcr.com</a>
            <span style="color: #999; margin: 0 8px;">|</span>
            <a href="https://wa.me/50685962438" style="color: #22c55e; text-decoration: none; font-weight: 500;">WhatsApp</a>
          </td>
        </tr>
      </table>

      <!-- Animal Badge -->
      <table style="width: 100%; margin-top: 24px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center;">
            <table style="background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%); border-radius: 24px; border: 1px solid #fde68a; margin: 0 auto;" cellpadding="12" cellspacing="0">
              <tr>
                <td style="text-align: center; font-size: 12px; color: #92400e; font-weight: 500;">
                  We respect &amp; love animals
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p style="margin: 0;">Can't Wait Travel CR</p>
      <p style="margin: 4px 0 0 0;">Safe, Reliable Transportation &amp; Tours in Costa Rica</p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('[Tour Email API] Sending confirmation to:', customerEmail);

    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'Can\'t Wait Travel CR <noreply@cantwaittravelcr.com>',
      to: [customerEmail],
      bcc: ['mybooking@cantwaittravelcr.com'],
      subject: `Tour Booking Confirmed - ${formattedBookingId}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('[Tour Email API] Failed to send confirmation:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('[Tour Email API] Email sent successfully to:', customerEmail, 'ID:', emailResult?.id);

    // Update tour booking to mark email as sent
    await supabase
      .from('tour_bookings')
      .update({ confirmation_email_sent: true })
      .eq('booking_id', bookingId);

    return NextResponse.json({
      success: true,
      message: 'Tour confirmation email sent successfully',
      sentTo: customerEmail,
    });
  } catch (error) {
    console.error('[Tour Email API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
