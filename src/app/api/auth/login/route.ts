export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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

    // Transform addresses to match frontend format
    const transformedUser = {
      ...userWithoutPassword,
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

    return NextResponse.json({ 
      success: true, 
      data: transformedUser 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}
