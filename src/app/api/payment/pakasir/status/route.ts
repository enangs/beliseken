export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/payment/pakasir/status?orderNumber=BS-XXX
 *
 * Check the current payment status of an order from our DB.
 * Used by the frontend to poll payment status after redirect.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "orderNumber is required" },
        { status: 400 }
      );
    }

    const rows = (await prisma.$queryRawUnsafe(
      `SELECT "orderNumber", "status", "paymentStatus", "paymentProvider", 
              "paymentRef", "paidAt", "total"
       FROM orders WHERE "orderNumber" = $1`,
      orderNumber
    )) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = rows[0];
    let paymentRef = null;
    try {
      paymentRef = order.paymentRef ? JSON.parse(order.paymentRef) : null;
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        paymentMethod: paymentRef?.pakasirMethod || null,
        expiredAt: paymentRef?.expiredAt || null,
        paidAt: order.paidAt,
        total: order.total,
      },
    });
  } catch (error: any) {
    console.error("PakaSir status check error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Status check failed" },
      { status: 500 }
    );
  }
}
