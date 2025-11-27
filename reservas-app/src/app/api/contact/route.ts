// src/app/api/contact/route.ts
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, countryCode, phone, subject, message } = body;

    // Combine country code and phone number
    const fullPhone = phone ? `${countryCode || ''} ${phone}`.trim() : '';

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map subject to readable text
    const subjectMap: Record<string, string> = {
      booking: 'New Booking Inquiry',
      modification: 'Modify Existing Booking',
      question: 'General Question',
      feedback: 'Feedback',
      other: 'Other',
    };

    const subjectText = subjectMap[subject] || subject;

    // Send email to contact@cantwaittravelcr.com
    const { data, error } = await resend.emails.send({
      from: 'Can\'t Wait Travel <noreply@cantwaittravelcr.com>',
      to: ['contact@cantwaittravelcr.com'],
      replyTo: email,
      subject: `[Website Contact] ${subjectText} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
                </td>
              </tr>
              ${fullPhone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <a href="tel:${fullPhone.replace(/\s/g, '')}" style="color: #2563eb;">${fullPhone}</a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Subject:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${subjectText}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; color: #475569; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              This message was sent from the contact form at cantwaittravelcr.com
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Send auto-reply to the customer
    await resend.emails.send({
      from: 'Can\'t Wait Travel <noreply@cantwaittravelcr.com>',
      to: [email],
      subject: 'We received your message - Can\'t Wait Travel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">We've received your message</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e2e8f0;">
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6;">
              Hi ${name},
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for contacting Can't Wait Travel! We've received your message and will get back to you within 2 hours during business hours.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              If you need immediate assistance, feel free to reach us via WhatsApp:
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://wa.me/50685962438" style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #1e293b; font-weight: bold;">Can't Wait Travel</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Private Shuttle Service in Costa Rica
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 12px;">
              <a href="https://cantwaittravelcr.com" style="color: #2563eb;">cantwaittravelcr.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
