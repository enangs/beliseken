import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email dan kode verifikasi wajib diisi' },
        { status: 400 }
      );
    }

    // Find user with verification code
    const users = await prisma.$queryRaw`
      SELECT id, name, email, "emailVerified", "verificationCode", "verificationExpiry"
      FROM users 
      WHERE email = ${email.toLowerCase()}
    ` as any[];

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = users[0];

    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email sudah terverifikasi' },
        { status: 200 }
      );
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi salah' },
        { status: 400 }
      );
    }

    // Check if code expired
    if (new Date(user.verificationExpiry) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru.' },
        { status: 400 }
      );
    }

    // Verify email
    await prisma.$executeRaw`
      UPDATE users 
      SET "emailVerified" = true, "verificationCode" = NULL, "verificationExpiry" = NULL
      WHERE id = ${user.id}
    `;

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    return NextResponse.json({
      success: true,
      message: 'Email berhasil diverifikasi! Selamat datang di BeliSeken.com',
    });

  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
