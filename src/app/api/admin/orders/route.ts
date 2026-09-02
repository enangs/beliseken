export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all orders (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('q');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Calculate summary stats
    const stats = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        totalRevenue: stats._sum.total || 0,
        totalOrders: stats._count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PUT update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, note, trackingNumber, courier, service } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status required' },
        { status: 400 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      // Update order
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status,
          ...(trackingNumber && { trackingNumber }),
          ...(courier && { courier }),
          ...(service && { shippingService: service }),
          ...(status === 'SHIPPING' && { shippedAt: new Date() }),
          ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        },
      });

      // Add status log
      await tx.orderStatusLog.create({
        data: {
          orderId: id,
          status,
          note: note || `Status diubah ke ${status}`,
          changedBy: 'admin',
        },
      });

      // If cancelled, release stock
      if (status === 'CANCELLED') {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
        });

        for (const item of orderItems) {
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
              notes: `Order ${updatedOrder.orderNumber} cancelled`,
              performedBy: 'admin',
            },
          });
        }
      }

      // If completed, update product stats
      if (status === 'COMPLETED') {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } },
          });
        }
      }

      return updatedOrder;
    });

    // Send WhatsApp notification for status changes (non-blocking)
    try {
      const { notifyOrderShipped, notifyOrderCancelled } = await import('@/lib/fonnte');
      const addr = JSON.parse((order as any).addressSnapshot || '{}');
      const customerName = addr.name || 'Customer';

      if (status === 'SHIPPING' && trackingNumber) {
        await notifyOrderShipped({
          orderNumber: order.orderNumber,
          customerName,
          trackingNumber,
          courier: courier || order.courier || 'Kurir',
        });
      } else if (status === 'CANCELLED') {
        await notifyOrderCancelled({
          orderNumber: order.orderNumber,
          customerName,
          total: order.total,
        });
      }
    } catch (e) {
      console.warn('WhatsApp notification failed:', e);
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
