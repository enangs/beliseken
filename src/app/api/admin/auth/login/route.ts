export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAdminToken, setAdminCookie } from '@/lib/admin-auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Only allow admin email
    if (email !== 'admin@beliseken.com') {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify against database
    const users = await prisma.$queryRaw`
      SELECT id, email, password, name, role, "isActive"
      FROM users 
      WHERE email = ${email.toLowerCase()}
      LIMIT 1
    ` as any[];

    if (!users || users.length === 0) {
      // Fallback: check hardcoded password for initial setup
      if (password === '123456') {
        const token = createAdminToken({
          id: 'admin-1',
          email: 'admin@beliseken.com',
          name: 'Admin BeliSeken',
          role: 'SUPER_ADMIN',
        });
        const response = NextResponse.json({
          success: true,
          data: { id: 'admin-1', email: 'admin@beliseken.com', name: 'Admin BeliSeken', role: 'SUPER_ADMIN' },
        });
        return setAdminCookie(response, token);
      }
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Hanya admin yang bisa login.' },
        { status: 403 }
      );
    }

    const token = createAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    return setAdminCookie(response, token);

  } catch (error) {
    // NEVER expose error details to client
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
