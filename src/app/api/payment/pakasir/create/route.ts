export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createPakasirTransaction } from "@/lib/pakasir";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payment/pakasir/create
 *
 * Creates a PakaSir payment transaction (QRIS / VA)
 * and updates the order with payment provider info.
 *
 * Body: { orderNumber: string, method?: string }
 *   method defaults to "qris"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, method } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "orderNumber is required" },
        { status: 400 }
      );
    }

    // Fetch order from DB
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT "id", "orderNumber", "total", "status", "paymentMethod", "paymentProvider"
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

    if (order.status !== "WAITING_PAYMENT" && order.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Order is not in payable state" },
        { status: 400 }
      );
    }

    // Determine PakaSir payment method
    let pakasirMethod = method || "qris";
    if (order.paymentMethod === "ewallet") {
      pakasirMethod = "qris"; // QRIS covers e-wallets
    }

    // Create PakaSir transaction
    const result = await createPakasirTransaction({
      orderId: order.orderNumber,
      amount: order.total,
      method: pakasirMethod,
    });

    const payment = result.payment;

    // Update order with PakaSir info
    await prisma.$executeRawUnsafe(
      `UPDATE orders 
       SET "paymentProvider" = $1, 
           "paymentRef" = $2,
           "updatedAt" = NOW()
       WHERE "orderNumber" = $3`,
      "PAKASIR",
      JSON.stringify({
        pakasirMethod: payment.payment_method,
        paymentNumber: payment.payment_number,
        expiredAt: payment.expired_at,
        fee: payment.fee,
        totalPayment: payment.total_payment,
      }),
      orderNumber
    );

    // Log payment event
    const logId = `plog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await prisma.$executeRawUnsafe(
      `INSERT INTO payment_logs ("id", "orderId", "provider", "amount", "status", "rawPayload", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      logId,
      order.id,
      "PAKASIR",
      payment.total_payment,
      "PENDING",
      JSON.stringify(payment)
    );

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        amount: payment.amount,
        fee: payment.fee,
        totalPayment: payment.total_payment,
        paymentMethod: payment.payment_method,
        paymentNumber: payment.payment_number, // QR string or VA number
        expiredAt: payment.expired_at,
      },
    });
  } catch (error: any) {
    console.error("PakaSir create transaction error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
