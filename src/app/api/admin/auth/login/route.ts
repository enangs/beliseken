export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'beliseken-admin-secret-key-2026-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Admin login attempt:', { email, hasPassword: !!password });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Database auth
    try {
      const users = await prisma.$queryRaw`
        SELECT id, email, password, name, role, "isActive"
        FROM users 
        WHERE email = ${email.toLowerCase()}
        LIMIT 1
      ` as any[];

      if (!users || users.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      const user = users[0];

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Akun admin tidak aktif' },
          { status: 403 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Anda tidak memiliki akses admin' },
          { status: 403 }
        );
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name, role: user.role },
      });

      response.cookies.set('beliseken_admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 86400,
        path: '/',
      });

      console.log('✅ Admin logged in via DB:', user.email);
      return response;

    } catch (dbErr: any) {
      console.error('❌ DB auth error:', dbErr.message);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
