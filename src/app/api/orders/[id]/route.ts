export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single order by ID or orderNumber
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const orderRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM orders WHERE id = $1 OR "orderNumber" = $1`, id
    ) as any[];
    const order = orderRows[0];

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const items = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_items WHERE "orderId" = $1`, order.id
    ) as any[];

    const statusHistory = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_status_logs WHERE "orderId" = $1 ORDER BY "createdAt" DESC`, order.id
    ) as any[];

    let address: any = {};
    try { address = JSON.parse(order.addressSnapshot || '{}'); } catch {}

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      items: (items || []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      address,
      shipping: {
        courier: order.courier,
        service: order.shippingService,
        description: '',
        cost: order.shippingCost,
        etd: order.shippingEtd,
      },
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      status: order.status?.toLowerCase() || 'pending',
      statusHistory: (statusHistory || []).map((h: any) => ({
        status: h.status?.toLowerCase() || 'pending',
        date: h.createdAt?.toISOString?.() || h.createdAt,
        note: h.note,
      })),
      paymentMethod: order.paymentMethod,
      paymentProofUrl: order.paymentProofUrl || null,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingNumber ? generateTrackingUrl(order.trackingNumber, order.courier) : null,
      createdAt: order.createdAt?.toISOString?.() || order.createdAt,
      updatedAt: order.updatedAt?.toISOString?.() || order.updatedAt,
    };

    return NextResponse.json({ success: true, data: transformedOrder });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT update order (status, tracking number, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, note, trackingNumber, courier, service } = body;

    // Find order with raw SQL
    const orderRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM orders WHERE id = $1 OR "orderNumber" = $1`, id
    ) as any[];
    const existingOrder = orderRows[0];

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIdx = 1;

    if (status) {
      updates.push(`"status" = $${paramIdx}`);
      values.push(status.toUpperCase());
      paramIdx++;

      if (status.toUpperCase() === 'SHIPPING') {
        updates.push(`"shippedAt" = NOW()`);
      } else if (status.toUpperCase() === 'DELIVERED') {
        updates.push(`"deliveredAt" = NOW()`);
      } else if (status.toUpperCase() === 'PAID') {
        updates.push(`"paymentStatus" = 'PAID'`);
        updates.push(`"paidAt" = NOW()`);
      }
    }

    if (trackingNumber !== undefined) {
      updates.push(`"trackingNumber" = $${paramIdx}`);
      values.push(trackingNumber);
      paramIdx++;
    }

    if (courier) {
      updates.push(`"courier" = $${paramIdx}`);
      values.push(courier);
      paramIdx++;
    }

    if (service) {
      updates.push(`"shippingService" = $${paramIdx}`);
      values.push(service);
      paramIdx++;
    }

    updates.push(`"updatedAt" = NOW()`);

    if (updates.length > 0) {
      values.push(existingOrder.id);
      await prisma.$executeRawUnsafe(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramIdx}`,
        ...values
      );
    }

    // Add status log
    if (status) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO order_status_logs ("id", "orderId", "status", "note", "changedBy", "createdAt")
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        `osl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        existingOrder.id,
        status.toUpperCase(),
        note || `Status diubah ke ${status}`,
        'admin'
      );
    }

    // Fetch updated order
    const updatedRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM orders WHERE id = $1`, existingOrder.id
    ) as any[];
    const updatedOrder = updatedRows[0];

    const items = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_items WHERE "orderId" = $1`, existingOrder.id
    ) as any[];

    const historyRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_status_logs WHERE "orderId" = $1 ORDER BY "createdAt" DESC`, existingOrder.id
    ) as any[];

    let address: any = {};
    try { address = JSON.parse(updatedOrder.addressSnapshot || '{}'); } catch {}

    const transformedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      userId: updatedOrder.userId,
      items: (items || []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      address,
      shipping: {
        courier: updatedOrder.courier,
        service: updatedOrder.shippingService,
        description: '',
        cost: updatedOrder.shippingCost,
        etd: updatedOrder.shippingEtd,
      },
      subtotal: updatedOrder.subtotal,
      shippingCost: updatedOrder.shippingCost,
      total: updatedOrder.total,
      status: updatedOrder.status?.toLowerCase() || 'pending',
      statusHistory: (historyRows || []).map((h: any) => ({
        status: h.status?.toLowerCase() || 'pending',
        date: h.createdAt?.toISOString?.() || h.createdAt,
        note: h.note,
      })),
      paymentMethod: updatedOrder.paymentMethod,
      paymentProofUrl: updatedOrder.paymentProofUrl || null,
      trackingNumber: updatedOrder.trackingNumber,
      trackingUrl: updatedOrder.trackingNumber ? generateTrackingUrl(updatedOrder.trackingNumber, updatedOrder.courier) : null,
      createdAt: updatedOrder.createdAt?.toISOString?.() || updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt?.toISOString?.() || updatedOrder.updatedAt,
    };

    return NextResponse.json({ success: true, data: transformedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}

function generateTrackingUrl(trackingNumber: string, courier?: string | null): string {
  const courierLower = (courier || '').toLowerCase();
  if (courierLower.includes('jne')) {
    return `https://www.jne.co.id/tracking/waybill/${trackingNumber}`;
  } else if (courierLower.includes('sicepat')) {
    return `https://www.sicepat.com/checkAWB/${trackingNumber}`;
  } else if (courierLower.includes('j&t') || courierLower.includes('jnt')) {
    return `https://www.jtexpress.co.id/tracking?billCode=${trackingNumber}`;
  } else if (courierLower.includes('pos')) {
    return `https://tracking.posindonesia.co.id/?nos=${trackingNumber}`;
  } else if (courierLower.includes('tiki')) {
    return `https://www.tiki.id/tracking?airwaybill=${trackingNumber}`;
  }
  return '';
}
