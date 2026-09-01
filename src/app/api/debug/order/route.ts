export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber") || "BS-20260901-0001";
  
  const rows = await prisma.$queryRawUnsafe(
    `SELECT "id", "orderNumber", "total", "status", "paymentMethod" FROM orders WHERE "orderNumber" = $1`,
    orderNumber
  ) as any[];

  return NextResponse.json({
    rawQuery: rows[0] || null,
    totalType: typeof rows[0]?.total,
    totalValue: Number(rows[0]?.total),
  });
}
