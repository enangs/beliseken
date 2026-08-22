import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BS-${dateStr}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, shipping, paymentMethod, userId } = body;

    if (!items || !address || !shipping || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // Validate stock for all items
    const validatedItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const { productId, unitId, quantity } = item;

      // Find available unit
      const unit = await prisma.productUnit.findFirst({
        where: {
          id: unitId,
          productId: productId,
          status: 'AVAILABLE',
        },
        include: {
          product: true,
          conditionGrade: true,
        },
      });

      if (!unit) {
        return NextResponse.json(
          {
            success: false,
            error: `Unit ${unitId} tidak tersedia`,
          },
          { status: 400 }
        );
      }

      const itemSubtotal = unit.sellingPrice * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        unit,
        quantity,
        subtotal: itemSubtotal,
      });
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: userId || null,
          status: paymentMethod === 'COD' ? 'PROCESSING' : 'WAITING_PAYMENT',
          paymentStatus: paymentMethod === 'COD' ? 'PAID' : 'UNPAID',
          paymentMethod,
          subtotal,
          shippingCost: shipping.cost,
          total: subtotal + shipping.cost,
          courier: shipping.courier,
          shippingService: shipping.service,
          shippingEtd: shipping.etd,
          addressSnapshot: JSON.stringify(address),
          expiresAt: paymentMethod !== 'COD' 
            ? new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            : null,
        },
      });

      // Create order items and reserve stock
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            unitId: item.unit.id,
            productId: item.unit.productId,
            productName: item.unit.product.name,
            productSlug: item.unit.product.slug,
            unitSku: item.unit.unitSku,
            gradeCode: item.unit.conditionGrade?.code,
            price: item.unit.sellingPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
            purchasePrice: item.unit.purchasePrice,
            margin: item.unit.sellingPrice - item.unit.purchasePrice,
          },
        });

        // Reserve stock
        await tx.productUnit.update({
          where: { id: item.unit.id },
          data: { status: 'RESERVED' },
        });

        // Create reservation
        await tx.stockReservation.create({
          data: {
            unitId: item.unit.id,
            userId: userId || null,
            orderId: newOrder.id,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          },
        });

        // Log inventory
        await tx.inventoryLog.create({
          data: {
            unitId: item.unit.id,
            action: 'STATUS_CHANGE',
            fromStatus: 'AVAILABLE',
            toStatus: 'RESERVED',
            notes: `Reserved for order ${newOrder.orderNumber}`,
            performedBy: userId || 'anonymous',
          },
        });
      }

      // Create initial status log
      await tx.orderStatusLog.create({
        data: {
          orderId: newOrder.id,
          status: newOrder.status,
          note: 'Pesanan dibuat',
          changedBy: userId || 'system',
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderNumber = searchParams.get('orderNumber');

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
              unit: {
                include: { conditionGrade: true },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Pesanan tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pesanan' },
      { status: 500 }
    );
  }
}
