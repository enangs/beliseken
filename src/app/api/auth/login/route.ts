export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Find user via raw SQL (bypass schema validation)
      const userRows = await prisma.$queryRaw`
        SELECT id, email, password, name, phone, city, "role", "isActive", "emailVerified", "createdAt"
        FROM users WHERE email = ${email} LIMIT 1
      ` as any[];

      const user = userRows?.[0];

      if (!user) {
        console.log('❌ User not found:', email);
        return NextResponse.json(
          { success: false, error: 'Email atau password salah!' },
          { status: 401 }
        );
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        return NextResponse.json(
          { success: false, error: 'Email atau password salah!' },
          { status: 401 }
        );
      }

      // Check if email is verified
      if (!user.emailVerified) {
        console.log('❌ Email not verified:', email);
        return NextResponse.json(
          { success: false, error: 'Email belum diverifikasi! Silakan cek email Anda untuk kode verifikasi.', needsVerification: true },
          { status: 403 }
        );
      }

      // Update last login
      const now = new Date().toISOString();
      await prisma.$executeRaw`
        UPDATE users SET "lastLoginAt" = ${now}::timestamp WHERE id = ${user.id}
      `;

      // Get addresses via raw SQL
      const addrRows = await prisma.$queryRaw`
        SELECT id, label, name, phone, address, city, "cityId", province, "provinceId", postcode, "isDefault"
        FROM user_addresses WHERE "userId" = ${user.id}
      ` as any[];

      const transformedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt?.toISOString?.() || String(user.createdAt),
        addresses: addrRows || [],
      };

      console.log('✅ User logged in from Supabase:', user.id, email);

      return NextResponse.json({ 
        success: true, 
        data: transformedUser 
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
