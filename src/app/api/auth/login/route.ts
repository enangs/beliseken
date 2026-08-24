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
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          addresses: true,
        },
      });

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

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      // Transform dates to strings
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
