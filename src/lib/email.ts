// Email service using Resend (free tier: 100 emails/day)
// https://resend.com

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@beliseken.com';
const APP_NAME = 'BeliSeken.com';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${APP_NAME} <${FROM_EMAIL}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(email: string, name: string, code: string): Promise<boolean> {
  const subject = `[${APP_NAME}] Kode Verifikasi Email Anda`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 400px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">${APP_NAME}</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Verifikasi Email Anda</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px; text-align: center;">
          <p style="color: #374151; margin: 0 0 16px; font-size: 16px;">Halo <strong>${name}</strong>,</p>
          <p style="color: #6B7280; margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
            Gunakan kode berikut untuk verifikasi email Anda:
          </p>
          
          <!-- Code Box -->
          <div style="background: #F9FAFB; border: 2px dashed #E53E3E; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Kode Verifikasi</p>
            <p style="margin: 0; color: #E53E3E; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: monospace;">${code}</p>
          </div>
          
          <p style="color: #9CA3AF; margin: 0 0 16px; font-size: 12px;">
            Kode berlaku selama <strong>15 menit</strong>.
          </p>
          
          <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
            Jika Anda tidak mendaftar di ${APP_NAME}, abaikan email ini.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #F9FAFB; padding: 16px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const subject = `Selamat Datang di ${APP_NAME}! 🎉`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 400px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🎉 Selamat Datang!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Email Anda sudah terverifikasi</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px; text-align: center;">
          <p style="color: #374151; margin: 0 0 16px; font-size: 16px;">Halo <strong>${name}</strong>,</p>
          <p style="color: #6B7280; margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
            Akun Anda sudah aktif! Sekarang Anda bisa menikmati belanja elektronik bekas premium.
          </p>
          
          <a href="https://beliseken.com/products" style="display: inline-block; background: #E53E3E; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Mulai Belanja →
          </a>
        </div>
        
        <!-- Footer -->
        <div style="background: #F9FAFB; padding: 16px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
