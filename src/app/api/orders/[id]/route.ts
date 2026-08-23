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

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id },
        ],
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend format
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      address: JSON.parse(order.addressSnapshot || '{}'),
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
      status: order.status.toLowerCase(),
      statusHistory: order.statusHistory.map(h => ({
        status: h.status.toLowerCase(),
        date: h.createdAt.toISOString(),
        note: h.note,
      })),
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingNumber ? generateTrackingUrl(order.trackingNumber, order.courier) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: transformedOrder });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
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

    // Find order
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id },
        ],
      },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const order = await prisma.$transaction(async (tx) => {
      const updateData: any = {};

      if (status) {
        updateData.status = status.toUpperCase();
        if (status.toUpperCase() === 'SHIPPING') {
          updateData.shippedAt = new Date();
        } else if (status.toUpperCase() === 'DELIVERED') {
          updateData.deliveredAt = new Date();
        } else if (status.toUpperCase() === 'PAID') {
          updateData.paymentStatus = 'PAID';
          updateData.paidAt = new Date();
        }
      }

      if (trackingNumber !== undefined) {
        updateData.trackingNumber = trackingNumber;
      }

      if (courier) {
        updateData.courier = courier;
      }

      if (service) {
        updateData.shippingService = service;
      }

      const updatedOrder = await tx.order.update({
        where: { id: existingOrder.id },
        data: updateData,
      });

      // Add status log
      if (status) {
        await tx.orderStatusLog.create({
          data: {
            orderId: existingOrder.id,
            status: status.toUpperCase(),
            note: note || `Status diubah ke ${status}`,
            changedBy: 'admin',
          },
        });
      }

      // If cancelled, release stock
      if (status && status.toUpperCase() === 'CANCELLED') {
        for (const item of existingOrder.items) {
          if (item.unitId && item.unitId !== 'unknown') {
            await tx.productUnit.update({
              where: { id: item.unitId },
              data: { status: 'AVAILABLE' },
            });

            await tx.inventoryLog.create({
              data: {
                unitId: item.unitId,
                action: 'STATUS_CHANGE',
                fromStatus: 'RESERVED',
                toStatus: 'AVAILABLE',
                notes: `Order ${existingOrder.orderNumber} cancelled`,
                performedBy: 'admin',
              },
            });
          }
        }
      }

      // If completed, update product stats
      if (status && status.toUpperCase() === 'COMPLETED') {
        for (const item of existingOrder.items) {
          if (item.productId && item.productId !== 'unknown') {
            await tx.product.update({
              where: { id: item.productId },
              data: { soldCount: { increment: item.quantity } },
            });
          }
        }
      }

      return updatedOrder;
    });

    // Fetch updated order with relations
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Transform response
    const transformedOrder = {
      id: updatedOrder!.id,
      orderNumber: updatedOrder!.orderNumber,
      userId: updatedOrder!.userId,
      items: updatedOrder!.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      address: JSON.parse(updatedOrder!.addressSnapshot || '{}'),
      shipping: {
        courier: updatedOrder!.courier,
        service: updatedOrder!.shippingService,
        description: '',
        cost: updatedOrder!.shippingCost,
        etd: updatedOrder!.shippingEtd,
      },
      subtotal: updatedOrder!.subtotal,
      shippingCost: updatedOrder!.shippingCost,
      total: updatedOrder!.total,
      status: updatedOrder!.status.toLowerCase(),
      statusHistory: updatedOrder!.statusHistory.map(h => ({
        status: h.status.toLowerCase(),
        date: h.createdAt.toISOString(),
        note: h.note,
      })),
      paymentMethod: updatedOrder!.paymentMethod,
      trackingNumber: updatedOrder!.trackingNumber,
      trackingUrl: updatedOrder!.trackingNumber ? generateTrackingUrl(updatedOrder!.trackingNumber, updatedOrder!.courier) : null,
      createdAt: updatedOrder!.createdAt.toISOString(),
      updatedAt: updatedOrder!.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: transformedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
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
