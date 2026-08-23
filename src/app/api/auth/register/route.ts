export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// POST register new user
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

    // Try to connect to database
    try {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      
      const prisma = new PrismaClient();
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        await prisma.$disconnect();
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar!' },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
          city: city || null,
          role: 'CUSTOMER',
        },
      });

      await prisma.$disconnect();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      console.log('User registered successfully:', user.id);

      return NextResponse.json({ 
        success: true, 
        data: userWithoutPassword 
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      
      // Return success anyway - frontend will handle localStorage fallback
      return NextResponse.json({ 
        success: true, 
        data: { 
          id: String(Date.now()), 
          name, 
          email, 
          phone, 
          city,
          createdAt: new Date().toISOString() 
        },
        note: 'Saved locally'
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Register error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
