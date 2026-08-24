export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, city } = body;

    console.log('Register attempt:', { name, email });

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      const existingRows = await prisma.$queryRaw`
        SELECT id, email FROM users WHERE email = ${email} LIMIT 1
      ` as any[];

      if (existingRows && existingRows.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar!' },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      const now = new Date().toISOString();

      // Check if email verification columns exist
      let hasVerificationColumns = false;
      try {
        const colCheck = await prisma.$queryRaw`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'verificationCode'
        ` as any[];
        hasVerificationColumns = colCheck && colCheck.length > 0;
      } catch {
        hasVerificationColumns = false;
      }

      if (hasVerificationColumns) {
        // Create user with verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.$executeRaw`
          INSERT INTO users (id, email, password, name, phone, city, "role", "isActive", "emailVerified", "createdAt", "updatedAt")
          VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, ${phone || null}, ${city || null}, 'CUSTOMER', true, false, ${now}::timestamp, ${now}::timestamp)
        `;

        // Save verification code
        try {
          await prisma.$executeRaw`
            UPDATE users 
            SET "verificationCode" = ${verificationCode}, "verificationExpiry" = ${verificationExpiry}
            WHERE id = ${userId}
          `;
        } catch (codeErr) {
          console.warn('Could not save verification code (column may not exist):', codeErr);
        }

        console.log('✅ User registered with verification:', userId, email);

        return NextResponse.json({ 
          success: true, 
          data: {
            id: userId,
            name,
            email,
            phone: phone || null,
            city: city || null,
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: false,
            createdAt: now,
            addresses: [],
          },
          message: 'Registrasi berhasil! Silakan login.',
          requiresVerification: true,
        }, { status: 201 });

      } else {
        // No verification columns — create user directly (fully verified)
        await prisma.$executeRaw`
          INSERT INTO users (id, email, password, name, phone, city, "role", "isActive", "createdAt", "updatedAt")
          VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, ${phone || null}, ${city || null}, 'CUSTOMER', true, ${now}::timestamp, ${now}::timestamp)
        `;

        console.log('✅ User registered (no verification):', userId, email);

        return NextResponse.json({ 
          success: true, 
          data: {
            id: userId,
            name,
            email,
            phone: phone || null,
            city: city || null,
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: true,
            createdAt: now,
            addresses: [],
          },
          message: 'Registrasi berhasil! Silakan login.',
          requiresVerification: false,
        }, { status: 201 });
      }

    } catch (dbError: any) {
      console.error('❌ Database register error:', dbError.message);
      
      return NextResponse.json(
        { success: false, error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Register error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
