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

    // Only allow admin email
    if (email !== 'admin@beliseken.com') {
      console.log('❌ Not admin email');
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Check hardcoded password first (for initial setup)
    if (password === '123456') {
      console.log('✅ Hardcoded password match');
      
      const token = jwt.sign(
        {
          id: 'admin-1',
          email: 'admin@beliseken.com',
          name: 'Admin BeliSeken',
          role: 'SUPER_ADMIN',
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json({
        success: true,
        data: {
          id: 'admin-1',
          email: 'admin@beliseken.com',
          name: 'Admin BeliSeken',
          role: 'SUPER_ADMIN',
        },
      });

      // Set cookie
      response.cookies.set('beliseken_admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 86400,
        path: '/',
      });

      console.log('🍪 Cookie set, token length:', token.length);
      return response;
    }

    // Try database auth
    try {
      const users = await prisma.$queryRaw`
        SELECT id, email, password, name, role, "isActive"
        FROM users 
        WHERE email = ${email.toLowerCase()}
        LIMIT 1
      ` as any[];

      if (users && users.length > 0) {
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (isValid && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) {
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

          return response;
        }
      }
    } catch (dbErr) {
      console.log('⚠️ DB auth failed, using hardcoded only');
    }

    return NextResponse.json(
      { success: false, error: 'Email atau password salah' },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('❌ Login error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
