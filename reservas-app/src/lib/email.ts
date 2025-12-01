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
    <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid #3b82f6;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <h3 style="margin: 0; color: #1a365d; font-size: 16px;">
          ${trips.length > 1 ? `Trip ${index + 1}: ` : ''}${trip.origin} → ${trip.destination}
        </h3>
        <span style="font-weight: 600; color: #3b82f6;">$${trip.price.toFixed(2)}</span>
      </div>
      ${trip.voucherNumber ? `
      <div style="margin-bottom: 12px;">
        <span style="font-size: 11px; color: #6b7280; font-family: monospace; background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">
          Voucher: ${trip.voucherNumber}
        </span>
      </div>
      ` : ''}
      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td style="color: #666; padding: 4px 0;">📅 Date:</td>
          <td style="text-align: right; font-weight: 500;">${trip.date}</td>
        </tr>
        <tr>
          <td style="color: #666; padding: 4px 0;">⏰ Pickup Time:</td>
          <td style="text-align: right; font-weight: 500;">${trip.time}</td>
        </tr>
        <tr>
          <td style="color: #666; padding: 4px 0;">👥 Passengers:</td>
          <td style="text-align: right; font-weight: 500;">${trip.passengers}</td>
        </tr>
      </table>
      ${trip.pickupAddress || trip.dropoffAddress ? `
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        ${trip.pickupAddress ? `
        <div style="background: #ecfdf5; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
          <p style="margin: 0; font-size: 11px; color: #059669; font-weight: 600; text-transform: uppercase;">Pickup Address</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #1f2937;">${trip.pickupAddress}</p>
        </div>
        ` : ''}
        ${trip.dropoffAddress ? `
        <div style="background: #eff6ff; border-radius: 6px; padding: 10px;">
          <p style="margin: 0; font-size: 11px; color: #2563eb; font-weight: 600; text-transform: uppercase;">Dropoff Address</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #1f2937;">${trip.dropoffAddress}</p>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>
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
    <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Thank you for choosing Can't Wait Travel CR</p>
    </div>

    <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #333;">Hello <strong>${customerName}</strong>,</p>

      <p style="color: #666;">Your booking has been confirmed and payment has been processed successfully.</p>

      <div style="background: #e8f4fd; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-size: 14px;">
          <strong>Booking Reference:</strong> ${bookingId}
        </p>
      </div>

      <h2 style="color: #1a365d; font-size: 18px; margin-top: 24px;">Trip Details</h2>

      ${tripDetailsHtml}

      <div style="background: #1a365d; color: white; border-radius: 8px; padding: 16px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 16px;">Total Paid:</span>
          <span style="font-size: 24px; font-weight: bold;">$${totalAmount.toFixed(2)} USD</span>
        </div>
      </div>

      ${transactionId ? `
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

      <!-- Important Reminder -->
      <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
        <table style="width: 100%;">
          <tr>
            <td style="width: 40px; vertical-align: top;">
              <span style="font-size: 24px;">⏰</span>
            </td>
            <td>
              <p style="margin: 0; font-weight: 600; color: #92400e; font-size: 15px;">Important Reminder</p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #a16207;">Be ready at your pickup location <strong>10 minutes before</strong> your scheduled time.</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- How to Contact Us -->
      <h2 style="color: #1a365d; font-size: 18px; margin-bottom: 16px;">How to Contact Us</h2>

      <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 40px; vertical-align: middle;">
                    <span style="font-size: 20px;">📧</span>
                  </td>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #666;">Email</p>
                    <a href="mailto:mybooking@cantwaittravelcr.com" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">mybooking@cantwaittravelcr.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-top: 1px solid #dcfce7;">
              <table style="width: 100%;">
                <tr>
                  <td style="width: 40px; vertical-align: middle;">
                    <span style="font-size: 20px;">💬</span>
                  </td>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #666;">WhatsApp</p>
                    <a href="https://wa.me/50685962438" style="color: #22c55e; text-decoration: none; font-weight: 600; font-size: 14px;">+506 8596 2438</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <!-- Animal Love Badge -->
      <div style="text-align: center; margin-top: 24px; padding: 12px; background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%); border-radius: 24px; border: 1px solid #fde68a;">
        <span style="font-size: 16px;">🐕</span>
        <span style="font-size: 12px; color: #92400e; font-weight: 500; margin: 0 4px;">🐾 We respect & love animals ❤️ 🐾</span>
        <span style="font-size: 16px;">🐕</span>
      </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>Can't Wait Travel CR</p>
      <p>Safe, Reliable Transportation in Costa Rica</p>
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
