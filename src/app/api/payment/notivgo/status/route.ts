export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNotivGoOrder } from "@/lib/notivgo";
import { markOrderPaidByNumber } from "@/lib/payment-confirmation";

/**
 * GET /api/payment/notivgo/status?orderNumber=BS-XXX
 *
 * Dipanggil halaman checkout/aplikasi untuk memantau pembayaran.
 * Bila NotivGo menyatakan pesanan sudah dibayar, status pesanan di DB
 * langsung diperbarui ke paid (idempoten).
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

    let rows = (await prisma.$queryRawUnsafe(
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

    let order = rows[0];

    let paymentRef: any = null;
    try {
      paymentRef = order.paymentRef ? JSON.parse(order.paymentRef) : null;
    } catch {}

    const isNotivgo =
      String(order.paymentProvider || "").toUpperCase() === "NOTIVGO" &&
      Boolean(paymentRef?.notivgoOrderRef);

    const isPaid =
      String(order.status || "").toLowerCase() === "paid" ||
      String(order.paymentStatus || "").toUpperCase() === "PAID";

    let gatewayStatus: string | null = null;

    // Tanya status terkini ke NotivGo (sumber kebenaran pencocokan pembayaran).
    if (isNotivgo && !isPaid) {
      try {
        const gateway = await getNotivGoOrder(paymentRef.notivgoOrderRef);
        gatewayStatus = gateway.status;

        if (gateway.status === "paid") {
          await markOrderPaidByNumber(orderNumber, {
            method: "qris",
            amount: Number(gateway.amount ?? order.total),
          });

          rows = (await prisma.$queryRawUnsafe(
            `SELECT "orderNumber", "status", "paymentStatus", "paymentProvider",
                    "paymentRef", "paidAt", "total"
             FROM orders WHERE "orderNumber" = $1`,
            orderNumber
          )) as any[];
          if (rows && rows.length > 0) order = rows[0];
        }
      } catch (error: any) {
        // API gateway sedang bermasalah: tetap balas status dari DB
        // supaya halaman tidak error.
        console.error(
          "[NotivGo] Cek status gagal:",
          error?.message || error
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: String(order.status || "").toLowerCase(),
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        paymentMethod: paymentRef?.paymentMethod || (isNotivgo ? "qris" : null),
        notivgoOrderRef: paymentRef?.notivgoOrderRef || null,
        expiredAt: paymentRef?.expiredAt || null,
        gatewayStatus,
        paidAt: order.paidAt,
        total: order.total,
      },
    });
  } catch (error: any) {
    console.error("NotivGo status check error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Status check failed" },
      { status: 500 }
    );
  }
}
