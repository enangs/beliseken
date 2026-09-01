export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/admin/orders/cleanup
 * Deletes all orders and related data (for testing purposes)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Delete in correct order (respect foreign keys)
    await prisma.$executeRawUnsafe(`DELETE FROM payment_logs`);
    await prisma.$executeRawUnsafe(`DELETE FROM shipment_logs`);
    await prisma.$executeRawUnsafe(`DELETE FROM order_status_logs`);
    await prisma.$executeRawUnsafe(`DELETE FROM order_items`);
    await prisma.$executeRawUnsafe(`DELETE FROM orders`);

    return NextResponse.json({ success: true, message: "All orders deleted" });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
