export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// One-time seed: create admin user with strong password
// DELETE this file after running once!
export async function POST() {
  try {
    const email = 'admin@beliseken.com';
    const password = 'BeliS3k3n!2026';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert admin user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        name: 'Admin BeliSeken',
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin BeliSeken',
        phone: '085101256123',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created/updated',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
