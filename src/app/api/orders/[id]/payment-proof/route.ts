export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH upload payment proof for an order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { paymentProofUrl } = body;

    if (!paymentProofUrl) {
      return NextResponse.json(
        { success: false, error: 'Payment proof URL required' },
        { status: 400 }
      );
    }

    // Find order
    const orderRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM orders WHERE id = $1 OR "orderNumber" = $1`, id
    ) as any[];

    if (!orderRows.length) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    // Update payment proof
    await prisma.$executeRawUnsafe(
      `UPDATE orders SET "paymentProofUrl" = $1, "updatedAt" = NOW() WHERE id = $2`,
      paymentProofUrl,
      order.id
    );

    // Add status log
    await prisma.$executeRawUnsafe(
      `INSERT INTO order_status_logs ("id", "orderId", "status", "note", "changedBy", "createdAt")
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      `osl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order.id,
      order.status,
      'Bukti pembayaran diupload oleh pelanggan',
      'customer'
    );

    return NextResponse.json({
      success: true,
      message: 'Bukti pembayaran berhasil diupload',
      data: { paymentProofUrl }
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
