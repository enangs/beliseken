export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PakasirWebhookPayload } from "@/lib/pakasir";

/**
 * POST /api/webhooks/pakasir
 *
 * Receives payment status updates from PakaSir.
 * PakaSir sends this when a payment is completed.
 *
 * Expected body:
 * {
 *   "amount": 22000,
 *   "order_id": "BS-20260901-0001",
 *   "project": "beli-seken",
 *   "status": "completed",
 *   "payment_method": "qris",
 *   "completed_at": "2024-09-10T08:07:02.819+07:00"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const payload: PakasirWebhookPayload = await request.json();

    console.log("📦 PakaSir webhook received:", JSON.stringify(payload));

    const { order_id, status, amount, payment_method, completed_at } = payload;

    if (!order_id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // PakaSir order_id may have unique suffix (e.g. BS-0001-1788252401685)
    // Strip it to get the original orderNumber
    const baseOrderId = order_id.replace(/-\d{13,}$/, '');

    // Find order by orderNumber (try exact match first, then prefix match)
    let rows = (await prisma.$queryRawUnsafe(
      `SELECT "id", "orderNumber", "total", "status", "paymentStatus"
       FROM orders WHERE "orderNumber" = $1`,
      baseOrderId
    )) as any[];

    if (!rows || rows.length === 0) {
      // Try with original order_id
      rows = (await prisma.$queryRawUnsafe(
        `SELECT "id", "orderNumber", "total", "status", "paymentStatus"
         FROM orders WHERE "orderNumber" = $1`,
        order_id
      )) as any[];
    }

    if (!rows || rows.length === 0) {
      console.warn(`⚠️ Webhook: Order ${order_id} (base: ${baseOrderId}) not found`);
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = rows[0];

    // Verify amount matches
    if (amount && order.total !== amount) {
      console.warn(
        `⚠️ Webhook: Amount mismatch for ${order_id}. Expected ${order.total}, got ${amount}`
      );
    }

    // Process based on status
    if (status === "completed") {
      // Update order status to PAID
      await prisma.$executeRawUnsafe(
        `UPDATE orders 
         SET "status" = 'PAID', 
             "paymentStatus" = 'PAID',
             "paidAt" = $1,
             "updatedAt" = NOW()
         WHERE "orderNumber" = $2`,
        completed_at ? new Date(completed_at) : new Date(),
        order_id
      );

      // Add status history
      const historyId = `osh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO order_status_logs ("id", "orderId", "status", "note", "createdAt")
         VALUES ($1, $2, 'PAID', $3, NOW())`,
        historyId,
        order.id,
        `Payment confirmed via ${payment_method || "PakaSir"}`
      );

      // Update payment log
      await prisma.$executeRawUnsafe(
        `UPDATE payment_logs 
         SET "status" = 'COMPLETED',
             "rawResponse" = $1
         WHERE "orderId" = $2 AND "provider" = 'PAKASIR'
         ORDER BY "createdAt" DESC
         LIMIT 1`,
        JSON.stringify(payload),
        order.id
      );

      console.log(`✅ Order ${order_id} marked as PAID`);
    } else if (status === "cancelled" || status === "expired") {
      // Update order status
      const newStatus =
        status === "cancelled" ? "CANCELLED" : "WAITING_PAYMENT";
      await prisma.$executeRawUnsafe(
        `UPDATE orders 
         SET "status" = $1, 
             "updatedAt" = NOW()
         WHERE "orderNumber" = $2`,
        newStatus,
        order_id
      );

      console.log(`ℹ️ Order ${order_id} status updated to ${newStatus}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PakaSir webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/pakasir
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ status: "ok", provider: "pakasir" });
}
