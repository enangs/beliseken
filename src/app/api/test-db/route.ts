export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'SET (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET',
    checks: {},
  };

  // Test Prisma connection
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try to count orders
    const orderCount = await prisma.order.count();
    results.checks.prisma = 'OK';
    results.checks.orderCount = orderCount;
    
    // Try to list tables
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    results.checks.tables = tables.map((t: any) => t.table_name);
    
    await prisma.$disconnect();
  } catch (error: any) {
    results.checks.prisma = 'FAILED';
    results.checks.error = error.message;
    results.checks.code = error.code;
  }

  return NextResponse.json(results, { status: 200 });
}
