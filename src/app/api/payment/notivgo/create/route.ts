export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotivGoQris, NotivGoError } from "@/lib/notivgo";

/**
 * POST /api/payment/notivgo/create
 *
 * Membuat QRIS bernominal untuk sebuah pesanan lewat NotivGo
 * (sekaligus membuat pesanan pendamping agar pembayaran dipantau).
 *
 * Body: { orderNumber: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderNumber: string | undefined = body?.orderNumber;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "orderNumber is required" },
        { status: 400 }
      );
    }

    const rows = (await prisma.$queryRawUnsafe(
      `SELECT "id", "orderNumber", "total", "status"
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
    const status = String(order.status || "").toLowerCase();

    if (status !== "waiting_payment" && status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Order is not in payable state" },
        { status: 400 }
      );
    }

    const amount = Math.round(Number(order.total));
    if (!amount || amount <= 0 || amount > 50000000) {
      return NextResponse.json(
        { success: false, error: `Invalid order amount: ${order.total}` },
        { status: 400 }
      );
    }

    // Ref unik per percobaan pembayaran, tetap ≤ 25 karakter agar
    // ikut tertulis di dalam QR oleh NotivGo.
    const orderRef = `${order.orderNumber}-${Date.now()
      .toString(36)
      .slice(-4)}`;
    const expiresIn = Number(process.env.NOTIVGO_EXPIRES_IN || 3600);

    const qris = await createNotivGoQris({
      orderRef,
      amount,
      expiresIn,
      note: `Pesanan ${order.orderNumber}`,
    });

    const expiredAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const paymentRef = {
      provider: "NOTIVGO",
      paymentMethod: "qris",
      notivgoOrderRef: qris.orderRef,
      notivgoOrderId: qris.notivgoOrderId ?? null,
      qrisPayload: qris.qrisPayload,
      amount,
      expiredAt,
      createdAt: new Date().toISOString(),
    };

    await prisma.$executeRawUnsafe(
      `UPDATE orders
       SET "paymentProvider" = 'NOTIVGO',
           "paymentRef" = $1,
           "updatedAt" = NOW()
       WHERE "orderNumber" = $2`,
      JSON.stringify(paymentRef),
      orderNumber
    );

    const logId = `plog-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO payment_logs
        ("id", "orderId", "provider", "amount", "method", "status", "rawResponse", "createdAt")
       VALUES ($1, $2, 'NOTIVGO', $3, 'qris', 'PENDING', $4, NOW())`,
      logId,
      order.id,
      amount,
      JSON.stringify(paymentRef)
    );

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        dbTotal: amount,
        amount,
        fee: 0,
        totalPayment: amount,
        paymentMethod: "qris",
        // Payload EMV QRIS — dirender jadi QR di browser/aplikasi
        paymentNumber: qris.qrisPayload,
        expiredAt,
      },
    });
  } catch (error: any) {
    console.error("NotivGo create transaction error:", error);

    const status =
      error instanceof NotivGoError && error.status >= 400 && error.status < 500
        ? 400
        : error instanceof NotivGoError && error.status === 500
        ? 500
        : 502;

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create payment",
      },
      { status }
    );
  }
}
