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
      // Check if user already exists via raw SQL (bypass schema validation)
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

      // Create user via raw SQL
      await prisma.$executeRaw`
        INSERT INTO users (id, email, password, name, phone, city, "role", "isActive", "createdAt", "updatedAt")
        VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, ${phone || null}, ${city || null}, 'CUSTOMER', true, ${now}::timestamp, ${now}::timestamp)
      `;

      // Return user without password
      const userWithoutPassword = {
        id: userId,
        name,
        email,
        phone: phone || null,
        city: city || null,
        role: 'CUSTOMER',
        isActive: true,
        createdAt: now,
        addresses: [],
      };

      console.log('✅ User registered in Supabase:', user.id, email);

      return NextResponse.json({ 
        success: true, 
        data: userWithoutPassword 
      }, { status: 201 });

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
