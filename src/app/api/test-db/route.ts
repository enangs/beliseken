export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    checks: {},
  };

  try {
    const orderCount = await prisma.order.count();
    results.checks.prisma = 'OK';
    results.checks.orderCount = orderCount;

    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    results.checks.tables = tables.map((t: any) => t.table_name);

  } catch (error) {
    results.checks.prisma = 'FAILED';
    results.checks.error = 'Database connection failed';
  }

  return NextResponse.json(results, { status: 200 });
}
