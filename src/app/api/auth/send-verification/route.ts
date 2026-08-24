import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    // Find user by email
    const users = await prisma.$queryRaw`
      SELECT id, name, email, "emailVerified" 
      FROM users 
      WHERE email = ${email.toLowerCase()}
    ` as any[];

    if (!users || users.length === 0) {
      // Don't reveal if email exists or not
      return NextResponse.json(
        { success: true, message: 'Kode verifikasi telah dikirim ke email Anda' },
        { status: 200 }
      );
    }

    const user = users[0];

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email sudah terverifikasi' },
        { status: 200 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save code to database
    await prisma.$executeRaw`
      UPDATE users 
      SET "verificationCode" = ${code}, "verificationExpiry" = ${expiry}
      WHERE id = ${user.id}
    `;

    // Send verification email
    const sent = await sendVerificationEmail(user.email, user.name, code);

    if (!sent) {
      return NextResponse.json(
        { success: false, error: 'Gagal mengirim email. Coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kode verifikasi telah dikirim ke email Anda',
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
