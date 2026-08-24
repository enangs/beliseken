export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    try {
      // Find user by email
      const users = await prisma.$queryRaw`
        SELECT id, email, password, name, phone, city, "role", "isActive", "createdAt"
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
          { success: false, error: 'Akun tidak aktif' },
          { status: 403 }
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Email atau password salah' },
          { status: 401 }
        );
      }

      // Check email verification if column exists
      try {
        const colCheck = await prisma.$queryRaw`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'emailVerified'
        ` as any[];

        if (colCheck && colCheck.length > 0) {
          const verifyCheck = await prisma.$queryRaw`
            SELECT "emailVerified" FROM users WHERE id = ${user.id}
          ` as any[];

          if (verifyCheck && verifyCheck.length > 0 && !verifyCheck[0].emailVerified) {
            return NextResponse.json(
              { success: false, error: 'Email belum terverifikasi. Silakan cek email Anda.' },
              { status: 403 }
            );
          }
        }
      } catch {
        // Column doesn't exist, skip verification check
      }

      // Update last login
      try {
        await prisma.$executeRaw`
          UPDATE users SET "lastLoginAt" = NOW() WHERE id = ${user.id}
        `;
      } catch {
        // Column may not exist
      }

      console.log('✅ User logged in:', user.email);

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
          emailVerified: true, // If we got here, it's verified
          createdAt: user.createdAt,
        },
      });

    } catch (dbError: any) {
      console.error('❌ Database login error:', dbError.message);
      
      return NextResponse.json(
        { success: false, error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}
