export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'No. HP dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneVariants = [
      cleanPhone,
      `+62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`,
      `62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`,
      `0${cleanPhone.startsWith('62') ? cleanPhone.slice(2) : cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`,
    ];

    // Find user by any phone variant
    let user: any = null;
    for (const variant of phoneVariants) {
      const users = await prisma.$queryRaw`
        SELECT id, email, password, name, phone, city, "role", "isActive", "avatarUrl", "createdAt"
        FROM users 
        WHERE phone = ${variant}
        LIMIT 1
      ` as any[];

      if (users && users.length > 0) {
        user = users[0];
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No. HP tidak terdaftar' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Akun tidak aktif' },
        { status: 403 }
      );
    }

    // Social login users may not have password
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Akun ini menggunakan login sosial. Silakan login dengan Google/Facebook.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Password salah' },
        { status: 401 }
      );
    }

    // Update last login
    try {
      await prisma.$executeRaw`
        UPDATE users SET "lastLoginAt" = NOW() WHERE id = ${user.id}
      `;
    } catch {
      // Column may not exist
    }

    console.log('✅ User logged in via phone:', user.phone);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        isActive: user.isActive,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        addresses: [],
      },
    });

  } catch (error: any) {
    console.error('Phone login error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}
