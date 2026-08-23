export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// POST login user
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

    // Try to connect to database
    try {
      const { PrismaClient } = await import('@prisma/client');
      const bcrypt = await import('bcryptjs');
      
      const prisma = new PrismaClient();
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          addresses: true,
        },
      });

      if (!user) {
        await prisma.$disconnect();
        return NextResponse.json(
          { success: false, error: 'Email atau password salah!' },
          { status: 401 }
        );
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await prisma.$disconnect();
        return NextResponse.json(
          { success: false, error: 'Email atau password salah!' },
          { status: 401 }
        );
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      await prisma.$disconnect();

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      // Transform addresses to match frontend format
      const transformedUser = {
        ...userWithoutPassword,
        createdAt: userWithoutPassword.createdAt?.toISOString() || new Date().toISOString(),
        addresses: userWithoutPassword.addresses?.map((addr: any) => ({
          id: addr.id,
          label: addr.label,
          name: addr.name,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          cityId: addr.cityId,
          province: addr.province,
          provinceId: addr.provinceId,
          postcode: addr.postcode,
          isDefault: addr.isDefault,
        })) || [],
      };

      console.log('User logged in successfully:', user.id);

      return NextResponse.json({ 
        success: true, 
        data: transformedUser 
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError.message);
      
      // Return error - frontend will handle localStorage fallback
      return NextResponse.json(
        { success: false, error: 'Database tidak tersedia. Silakan coba lagi.' },
        { status: 503 }
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
