export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all orders for a user (or all orders for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('admin') === 'true';
    const status = searchParams.get('status');

    let where: any = {};

    if (isAdmin) {
      // Admin can see all orders
    } else if (email) {
      // Filter by email (stored in addressSnapshot JSON)
      where.addressSnapshot = { contains: email };
    } else if (userId) {
      where.userId = userId;
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend format
    const transformedOrders = orders.map(order => ({
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
    }));

    return NextResponse.json({ success: true, data: transformedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, shipping, paymentMethod, userId } = body;

    console.log('POST /api/orders received:', {
      itemCount: items?.length,
      paymentMethod,
      userId,
      shippingCost: shipping?.cost,
      firstItem: items?.[0]?.productName,
    });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    // Generate order number
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    
    // Count existing orders today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayCount = await prisma.order.count({
      where: { createdAt: { gte: todayStart } },
    });
    
    const orderNumber = `BS-${dateStr}-${String(todayCount + 1).padStart(4, '0')}`;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shippingCost = shipping.cost || 0;
    const total = subtotal + shippingCost;

    // Create order in database (step by step, no nested relation creates)
    const status = paymentMethod === 'cod' ? 'PROCESSING' : 'WAITING_PAYMENT';
    
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        status,
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod || 'bank_transfer',
        subtotal,
        shippingCost,
        total,
        courier: shipping.courier,
        shippingService: shipping.service,
        shippingEtd: shipping.etd || null,
        addressSnapshot: JSON.stringify(address),
      },
    });

    // Create order items (separately to avoid relation issues)
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      await prisma.$executeRaw`
        INSERT INTO order_items ("id", "orderId", "productName", "productSlug", "productImage", "unitSku", "price", "quantity", "subtotal")
        VALUES (${`oi-${Date.now()}-${idx}`}, ${newOrder.id}, ${item.productName || 'Unknown Product'}, ${item.productSlug || ''}, ${item.productImage?.startsWith('data:') ? null : (item.productImage || null)}, ${`GEN-${orderNumber}-${idx + 1}`}, ${item.price || 0}, ${item.quantity || 1}, ${(item.price || 0) * (item.quantity || 1)})
      `;
    }

    // Create status history
    await prisma.$executeRaw`
      INSERT INTO order_status_logs ("id", "orderId", "status", "note", "changedBy")
      VALUES (${`osl-${Date.now()}`}, ${newOrder.id}, ${status}, 'Pesanan dibuat', 'system')
    `;

    // Fetch full order with items
    const order = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    // Transform response
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order created but not found' }, { status: 500 });
    }
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      items: (order.items || []).map(item => ({
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
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: transformedOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Create order error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order', code: error.code },
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
