// src/app/api/email/send-cart-confirmation/route.ts
// Endpoint para enviar UN SOLO email consolidado con todos los items del carrito
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface CartConfirmationRequest {
  bookingNumber: string;
  shuttleBookingIds: string[];
  tourIds: number[];
  transactionId?: string;
  authCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CartConfirmationRequest = await request.json();
    const { bookingNumber, shuttleBookingIds, tourIds, transactionId, authCode } = body;

    if (!bookingNumber) {
      return NextResponse.json({ error: 'Missing bookingNumber' }, { status: 400 });
    }

    console.log('[CartEmail] Processing cart confirmation for:', bookingNumber);

    // Fetch all shuttle trips
    let shuttles: any[] = [];
    if (shuttleBookingIds && shuttleBookingIds.length > 0) {
      const { data: shuttleData, error: shuttleError } = await supabase
        .from('trips')
        .select('*')
        .in('booking_id', shuttleBookingIds);

      if (shuttleError) {
        console.error('[CartEmail] Error fetching shuttles:', shuttleError);
      } else {
        shuttles = shuttleData || [];
      }
    }

    // Fetch all tours
    let tours: any[] = [];
    if (tourIds && tourIds.length > 0) {
      const { data: tourData, error: tourError } = await supabase
        .from('tour_bookings')
        .select('*')
        .in('id', tourIds);

      if (tourError) {
        console.error('[CartEmail] Error fetching tours:', tourError);
      } else {
        tours = tourData || [];
      }
    }

    if (shuttles.length === 0 && tours.length === 0) {
      return NextResponse.json({ error: 'No items found' }, { status: 404 });
    }

    // Get customer info from first available item
    const firstItem = shuttles[0] || tours[0];
    const customerEmail = firstItem.customer_email;
    const customerName = `${firstItem.customer_first_name || ''} ${firstItem.customer_last_name || ''}`.trim() || 'Valued Customer';

    if (!customerEmail) {
      return NextResponse.json({ error: 'No customer email found' }, { status: 400 });
    }

    // Calculate totals
    const shuttleTotal = shuttles.reduce((sum, s) => sum + (s.final_price || s.price || 0), 0);
    const tourTotal = tours.reduce((sum, t) => sum + (t.total_price || 0), 0);
    const grandTotal = shuttleTotal + tourTotal;

    // Generate email HTML
    const emailHtml = generateCartEmailHtml({
      customerName,
      bookingNumber,
      shuttles,
      tours,
      shuttleTotal,
      tourTotal,
      grandTotal,
      transactionId,
      authCode,
    });

    // Send email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Can't Wait Travel CR <noreply@cantwaittravelcr.com>",
      to: [customerEmail],
      bcc: ['mybooking@cantwaittravelcr.com'],
      subject: `Booking Confirmed - ${bookingNumber}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('[CartEmail] Failed to send:', emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('[CartEmail] Email sent to:', customerEmail, 'ID:', emailResult?.id);

    // Mark emails as sent
    if (shuttleBookingIds.length > 0) {
      await supabase
        .from('trips')
        .update({ confirmation_email_sent: true })
        .in('booking_id', shuttleBookingIds);
    }
    if (tourIds.length > 0) {
      await supabase
        .from('tour_bookings')
        .update({ confirmation_email_sent: true })
        .in('id', tourIds);
    }

    return NextResponse.json({
      success: true,
      message: 'Cart confirmation email sent',
      sentTo: customerEmail,
    });
  } catch (error) {
    console.error('[CartEmail] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

interface EmailData {
  customerName: string;
  bookingNumber: string;
  shuttles: any[];
  tours: any[];
  shuttleTotal: number;
  tourTotal: number;
  grandTotal: number;
  transactionId?: string;
  authCode?: string;
}

function generateCartEmailHtml(data: EmailData): string {
  const { customerName, bookingNumber, shuttles, tours, shuttleTotal, tourTotal, grandTotal, transactionId, authCode } = data;

  // Generate shuttles HTML
  const shuttlesHtml = shuttles.length > 0 ? `
    <h3 style="color: #1a365d; font-size: 16px; margin: 24px 0 12px 0;">
      Private Shuttles (${shuttles.length})
    </h3>
    ${shuttles.map((shuttle, index) => `
      <table style="width: 100%; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #3b82f6;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-weight: 600; color: #1a365d; font-size: 15px;">
                  ${shuttle.from_location} &rarr; ${shuttle.to_location}
                </td>
                <td style="text-align: right; font-weight: 600; color: #3b82f6;">$${(shuttle.final_price || shuttle.price || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 4px; font-size: 11px; color: #6b7280; font-family: monospace;">
                  Voucher: ${shuttle.voucher_number || `${bookingNumber}-S${String(index + 1).padStart(2, '0')}`}
                </td>
              </tr>
            </table>
            <table style="width: 100%; font-size: 13px; color: #4b5563; margin-top: 12px;" cellpadding="2" cellspacing="0">
              <tr>
                <td>Date:</td>
                <td style="text-align: right;">${shuttle.date}</td>
              </tr>
              <tr>
                <td>Pickup Time:</td>
                <td style="text-align: right;">${shuttle.pickup_time || 'TBD'}</td>
              </tr>
              <tr>
                <td>Passengers:</td>
                <td style="text-align: right;">${(shuttle.adults || 0) + (shuttle.children || 0)}</td>
              </tr>
            </table>
            ${shuttle.pickup_address ? `
            <table style="width: 100%; margin-top: 8px; background: #ecfdf5; border-radius: 6px;" cellpadding="8" cellspacing="0">
              <tr>
                <td>
                  <p style="margin: 0; font-size: 11px; color: #059669; font-weight: 600;">PICKUP ADDRESS</p>
                  <p style="margin: 2px 0 0 0; font-size: 12px; color: #1f2937;">${shuttle.pickup_address}</p>
                </td>
              </tr>
            </table>
            ` : ''}
            ${shuttle.dropoff_address ? `
            <table style="width: 100%; margin-top: 6px; background: #eff6ff; border-radius: 6px;" cellpadding="8" cellspacing="0">
              <tr>
                <td>
                  <p style="margin: 0; font-size: 11px; color: #2563eb; font-weight: 600;">DROPOFF ADDRESS</p>
                  <p style="margin: 2px 0 0 0; font-size: 12px; color: #1f2937;">${shuttle.dropoff_address}</p>
                </td>
              </tr>
            </table>
            ` : ''}
          </td>
        </tr>
      </table>
    `).join('')}
  ` : '';

  // Generate tours HTML
  const toursHtml = tours.length > 0 ? `
    <h3 style="color: #1a365d; font-size: 16px; margin: 24px 0 12px 0;">
      Private Tours (${tours.length})
    </h3>
    ${tours.map((tour, index) => `
      <table style="width: 100%; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #22c55e;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-weight: 600; color: #1a365d; font-size: 15px;">
                  ${tour.tour_name}
                </td>
                <td style="text-align: right; font-weight: 600; color: #22c55e;">$${(tour.total_price || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 4px; font-size: 11px; color: #6b7280; font-family: monospace;">
                  Voucher: ${tour.voucher_number || `${bookingNumber}-T${String(index + 1).padStart(2, '0')}`}
                </td>
              </tr>
            </table>
            <table style="width: 100%; font-size: 13px; color: #4b5563; margin-top: 12px;" cellpadding="2" cellspacing="0">
              <tr>
                <td>Date:</td>
                <td style="text-align: right;">${tour.date}</td>
              </tr>
              <tr>
                <td>Passengers:</td>
                <td style="text-align: right;">${(tour.adults || 0) + (tour.children || 0)}</td>
              </tr>
              <tr>
                <td>Pickup Location:</td>
                <td style="text-align: right;">${tour.hotel || 'TBD'}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `).join('')}
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <table style="width: 100%; background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); border-radius: 12px 12px 0 0;" cellpadding="32" cellspacing="0">
      <tr>
        <td style="text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Thank you for choosing Can't Wait Travel CR</p>
        </td>
      </tr>
    </table>

    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

      <p style="font-size: 16px; color: #333;">Hello <strong>${customerName}</strong>,</p>
      <p style="color: #666;">Your booking has been confirmed and payment processed successfully!</p>

      <!-- Booking Reference -->
      <div style="background: linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%); border-left: 4px solid #2563eb; padding: 16px 20px; margin: 24px 0; border-radius: 0 12px 12px 0;">
        <p style="margin: 0; font-size: 12px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
        <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #1a365d; font-family: monospace;">${bookingNumber}</p>
      </div>

      <!-- Services -->
      <h2 style="color: #1a365d; font-size: 18px; margin-top: 32px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
        Your Services
      </h2>

      ${shuttlesHtml}
      ${toursHtml}

      <!-- Totals -->
      <table style="width: 100%; margin-top: 24px; border-top: 2px solid #e5e7eb; padding-top: 16px;" cellpadding="0" cellspacing="0">
        ${shuttles.length > 0 ? `
        <tr>
          <td style="font-size: 14px; color: #4b5563; padding-bottom: 8px;">Shuttles Subtotal:</td>
          <td style="text-align: right; font-size: 14px; color: #4b5563; padding-bottom: 8px;">$${shuttleTotal.toFixed(2)}</td>
        </tr>
        ` : ''}
        ${tours.length > 0 ? `
        <tr>
          <td style="font-size: 14px; color: #4b5563; padding-bottom: 8px;">Tours Subtotal:</td>
          <td style="text-align: right; font-size: 14px; color: #4b5563; padding-bottom: 8px;">$${tourTotal.toFixed(2)}</td>
        </tr>
        ` : ''}
      </table>

      <!-- Grand Total -->
      <table style="width: 100%; background: #1a365d; border-radius: 8px; margin-top: 16px;" cellpadding="16" cellspacing="0">
        <tr>
          <td style="color: white; font-size: 16px;">Total Paid:</td>
          <td style="text-align: right; color: white; font-size: 28px; font-weight: bold;">$${grandTotal.toFixed(2)} USD</td>
        </tr>
      </table>

      ${transactionId ? `
      <!-- Payment Details -->
      <div style="margin-top: 20px; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
        <h3 style="margin: 0 0 12px 0; color: #166534; font-size: 14px;">Payment Details</h3>
        <table style="width: 100%; font-size: 13px; color: #166534;">
          <tr>
            <td style="padding: 4px 0;">Transaction ID:</td>
            <td style="text-align: right; font-family: monospace;">${transactionId}</td>
          </tr>
          ${authCode ? `
          <tr>
            <td style="padding: 4px 0;">Authorization:</td>
            <td style="text-align: right; font-family: monospace;">${authCode}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      ` : ''}

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

      <!-- What's Next -->
      <h2 style="color: #1a365d; font-size: 18px;">What Happens Next?</h2>
      <table style="width: 100%; margin-bottom: 16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 44px; vertical-align: top; padding-right: 12px; padding-bottom: 12px;">
            <table style="width: 32px; height: 32px; background: #22c55e; border-radius: 16px;" cellpadding="0" cellspacing="0">
              <tr><td style="text-align: center; color: white; font-weight: bold;">1</td></tr>
            </table>
          </td>
          <td style="vertical-align: top; padding-bottom: 12px;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Confirmation Email Sent</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Save this email with your booking reference and vouchers.</p>
          </td>
        </tr>
        <tr>
          <td style="width: 44px; vertical-align: top; padding-right: 12px;">
            <table style="width: 32px; height: 32px; background: #f97316; border-radius: 16px;" cellpadding="0" cellspacing="0">
              <tr><td style="text-align: center; color: white; font-weight: bold;">2</td></tr>
            </table>
          </td>
          <td style="vertical-align: top;">
            <p style="margin: 0; font-weight: 600; color: #166534;">Day of Travel</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Be ready 10 minutes before your pickup time. Have a great trip!</p>
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
      <p>Can't Wait Travel CR</p>
      <p>Safe, Reliable Transportation in Costa Rica</p>
    </div>
  </div>
</body>
</html>
  `;
}
