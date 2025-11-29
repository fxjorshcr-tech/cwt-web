// src/lib/email.ts
import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailData {
  customerEmail: string;
  customerName: string;
  bookingId: string;
  trips: Array<{
    origin: string;
    destination: string;
    date: string;
    time: string;
    passengers: number;
    price: number;
    pickupAddress?: string | null;
    dropoffAddress?: string | null;
    voucherNumber?: string | null;
  }>;
  totalAmount: number;
  transactionId?: string;
  authCode?: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  const { customerEmail, customerName, bookingId, trips, totalAmount, transactionId, authCode } = data;

  // Generate trip details HTML with pickup/dropoff addresses and voucher
  const tripDetailsHtml = trips.map((trip, index) => `
    <table style="width: 100%; background: #f8f9fa; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #3b82f6;" cellpadding="16" cellspacing="0">
      <tr>
        <td>
          <table style="width: 100%;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-weight: 600; color: #1a365d; font-size: 16px;">
                ${trips.length > 1 ? `Trip ${index + 1}: ` : ''}${trip.origin} &rarr; ${trip.destination}
              </td>
              <td style="text-align: right; font-weight: 600; color: #3b82f6;">$${trip.price.toFixed(2)}</td>
            </tr>
          </table>
          ${trip.voucherNumber ? `
          <p style="margin: 8px 0 12px 0; font-size: 11px; color: #6b7280; font-family: monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; display: inline-block;">
            Voucher: ${trip.voucherNumber}
          </p>
          ` : ''}
          <table style="width: 100%; font-size: 14px;" cellpadding="4" cellspacing="0">
            <tr>
              <td style="color: #666;">Date:</td>
              <td style="text-align: right; font-weight: 500;">${trip.date}</td>
            </tr>
            <tr>
              <td style="color: #666;">Pickup Time:</td>
              <td style="text-align: right; font-weight: 500;">${trip.time}</td>
            </tr>
            <tr>
              <td style="color: #666;">Passengers:</td>
              <td style="text-align: right; font-weight: 500;">${trip.passengers}</td>
            </tr>
          </table>
          ${trip.pickupAddress || trip.dropoffAddress ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            ${trip.pickupAddress ? `
            <table style="width: 100%; background: #ecfdf5; border-radius: 6px; margin-bottom: 8px;" cellpadding="10" cellspacing="0">
              <tr>
                <td>
                  <p style="margin: 0; font-size: 11px; color: #059669; font-weight: 600; text-transform: uppercase;">Pickup Address</p>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #1f2937;">${trip.pickupAddress}</p>
                </td>
              </tr>
            </table>
            ` : ''}
            ${trip.dropoffAddress ? `
            <table style="width: 100%; background: #eff6ff; border-radius: 6px;" cellpadding="10" cellspacing="0">
              <tr>
                <td>
                  <p style="margin: 0; font-size: 11px; color: #2563eb; font-weight: 600; text-transform: uppercase;">Dropoff Address</p>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #1f2937;">${trip.dropoffAddress}</p>
                </td>
              </tr>
            </table>
            ` : ''}
          </div>
          ` : ''}
        </td>
      </tr>
    </table>
  `).join('');

  const emailHtml = `
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

    <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333;">Hello <strong>${customerName}</strong>,</p>

      <p style="color: #666;">Your booking has been confirmed and payment has been processed successfully.</p>

      <!-- Booking Reference -->
      <table style="width: 100%; background: linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%); border-left: 4px solid #2563eb; border-radius: 0 12px 12px 0; margin: 20px 0;" cellpadding="16" cellspacing="0">
        <tr>
          <td>
            <p style="margin: 0; font-size: 12px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
            <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #1a365d; font-family: monospace;">${bookingId}</p>
          </td>
        </tr>
      </table>

      <h2 style="color: #1a365d; font-size: 18px; margin-top: 24px;">Trip Details</h2>

      ${tripDetailsHtml}

      <!-- Total -->
      <table style="width: 100%; background: #1a365d; border-radius: 8px; margin-top: 20px;" cellpadding="16" cellspacing="0">
        <tr>
          <td style="color: white; font-size: 16px;">Total Paid:</td>
          <td style="text-align: right; color: white; font-size: 24px; font-weight: bold;">$${totalAmount.toFixed(2)} USD</td>
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
            <p style="margin: 0; font-weight: 600; color: #166534;">Day of Travel</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #15803d;">Be ready at your pickup location 10 minutes before scheduled time. Have a great trip!</p>
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
      <p style="margin: 4px 0 0 0;">Safe, Reliable Transportation in Costa Rica</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: 'Can\'t Wait Travel CR <noreply@cantwaittravelcr.com>',
      to: [customerEmail],
      bcc: ['mybooking@cantwaittravelcr.com'],
      subject: `Booking Confirmed - ${bookingId}`,
      html: emailHtml,
    });

    if (error) {
      console.error('[Email] Failed to send confirmation:', error);
      return false;
    }

    console.log('[Email] Confirmation sent to:', customerEmail, 'ID:', emailResult?.id);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send confirmation:', error);
    return false;
  }
}
