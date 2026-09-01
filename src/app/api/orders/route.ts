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

    // Use raw SQL to avoid Prisma relation issues with nullable columns
    let whereClause = '';
    const params: any[] = [];
    let paramIdx = 1;

    if (isAdmin) {
      // Admin sees all orders
    } else if (userId) {
      whereClause = `WHERE o."userId" = $${paramIdx}`;
      params.push(userId);
      paramIdx++;
    } else if (email) {
      whereClause = `WHERE o."addressSnapshot"::text ILIKE $${paramIdx}`;
      params.push(`%${email}%`);
      paramIdx++;
    }

    if (status && status !== 'all') {
      const statusUpper = status.toUpperCase();
      whereClause += whereClause ? ` AND o."status" = $${paramIdx}` : ` WHERE o."status" = $${paramIdx}`;
      params.push(statusUpper);
      paramIdx++;
    }

    const ordersQuery = `
      SELECT o.* FROM orders o
      ${whereClause}
      ORDER BY o."createdAt" DESC
    `;

    const orders = await prisma.$queryRawUnsafe(ordersQuery, ...params) as any[];

    // Fetch items and status history for each order
    const transformedOrders = await Promise.all(orders.map(async (order: any) => {
      const items = await prisma.$queryRawUnsafe(
        `SELECT * FROM order_items WHERE "orderId" = $1`,
        order.id
      ) as any[];

      const statusHistory = await prisma.$queryRawUnsafe(
        `SELECT * FROM order_status_logs WHERE "orderId" = $1 ORDER BY "createdAt" DESC`,
        order.id
      ) as any[];

      let address: any = {};
      try { address = JSON.parse(order.addressSnapshot || '{}'); } catch {}

      return {
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
        paymentProvider: order.paymentProvider || null,
        paymentRef: order.paymentRef || null,
        paymentProofUrl: order.paymentProofUrl || null,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingNumber ? generateTrackingUrl(order.trackingNumber, order.courier) : null,
        createdAt: order.createdAt?.toISOString?.() || order.createdAt,
        updatedAt: order.updatedAt?.toISOString?.() || order.updatedAt,
      };
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
    const status = paymentMethod === 'cod' ? 'PROCESSING' : 'WAITING_PAYMENT';
    const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create order with raw SQL (avoids Prisma relation issues)
    await prisma.$executeRawUnsafe(`
      INSERT INTO orders ("id", "orderNumber", "userId", "status", "paymentStatus", "paymentMethod", "subtotal", "shippingCost", "total", "courier", "shippingService", "shippingEtd", "addressSnapshot", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    `,
      orderId,
      orderNumber,
      userId || null,
      status,
      'UNPAID',
      paymentMethod || 'bank_transfer',
      subtotal,
      shippingCost,
      total,
      shipping.courier,
      shipping.service,
      shipping.etd || null,
      JSON.stringify(address)
    );

    // Create order items and mark units as SOLD
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const itemId = `oi-${Date.now()}-${idx}`;
      const productImage = item.productImage?.startsWith('data:') ? null : (item.productImage || null);
      
      // Find available units for this product and mark as SOLD
      const productSlug = item.productSlug;
      if (productSlug) {
        // Get product ID from slug
        const productRows = await prisma.$queryRawUnsafe(
          `SELECT id FROM products WHERE slug = $1`, productSlug
        ) as any[];
        
        if (productRows.length > 0) {
          const productId = productRows[0].id;
          const quantity = item.quantity || 1;
          
          // Get available units (FIFO - oldest first)
          const availableUnits = await prisma.$queryRawUnsafe(
            `SELECT id, "unitSku" FROM product_units 
             WHERE "productId" = $1 AND status = 'AVAILABLE' 
             ORDER BY "createdAt" ASC 
             LIMIT $2`,
            productId, quantity
          ) as any[];
          
          // Mark units as SOLD
          for (const unit of availableUnits) {
            await prisma.$executeRawUnsafe(
              `UPDATE product_units SET status = 'SOLD', "updatedAt" = NOW() WHERE id = $1`,
              unit.id
            );
            
            // Log inventory change
            await prisma.$executeRawUnsafe(
              `INSERT INTO inventory_logs ("id", "productId", "unitId", "changeType", "quantityChange", "reason", "referenceId", "createdAt")
               VALUES ($1, $2, $3, 'SOLD', -1, 'Order created', $4, NOW())`,
              `ilog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              productId,
              unit.id,
              orderId
            );
          }
          
          // Use real unit SKU if available
          if (availableUnits.length > 0) {
            item.unitSku = availableUnits[0].unitSku;
          }
        }
      }
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO order_items ("id", "orderId", "productName", "productSlug", "productImage", "unitSku", "price", "quantity", "subtotal")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        itemId,
        orderId,
        item.productName || 'Unknown Product',
        productSlug || '',
        productImage,
        item.unitSku || `GEN-${orderNumber}-${idx + 1}`,
        item.price || 0,
        item.quantity || 1,
        (item.price || 0) * (item.quantity || 1)
      );
    }

    // Create status history
    await prisma.$executeRawUnsafe(`
      INSERT INTO order_status_logs ("id", "orderId", "status", "note", "changedBy", "createdAt")
      VALUES ($1, $2, $3, $4, $5, NOW())
    `,
      `osl-${Date.now()}`,
      orderId,
      status,
      'Pesanan dibuat',
      'system'
    );

    // Fetch the created order back
    const orderRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM orders WHERE id = $1`, orderId
    ) as any[];
    const order = orderRows[0];

    const itemRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_items WHERE "orderId" = $1`, orderId
    ) as any[];

    const historyRows = await prisma.$queryRawUnsafe(
      `SELECT * FROM order_status_logs WHERE "orderId" = $1 ORDER BY "createdAt" DESC`, orderId
    ) as any[];

    let addr: any = {};
    try { addr = JSON.parse(order.addressSnapshot || '{}'); } catch {}

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      items: (itemRows || []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      address: addr,
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
      statusHistory: (historyRows || []).map((h: any) => ({
        status: h.status?.toLowerCase() || 'pending',
        date: h.createdAt?.toISOString?.() || h.createdAt,
        note: h.note,
      })),
      paymentMethod: order.paymentMethod,
      paymentProofUrl: null,
      createdAt: order.createdAt?.toISOString?.() || order.createdAt,
      updatedAt: order.updatedAt?.toISOString?.() || order.updatedAt,
    };

    // Send WhatsApp notification to admin (non-blocking)
    try {
      const { notifyNewOrder } = await import('@/lib/fonnte');
      const addr = JSON.parse(order.addressSnapshot || '{}');
      notifyNewOrder({
        orderNumber: order.orderNumber,
        customerName: addr.name || 'Customer',
        total: order.total,
        paymentMethod: order.paymentMethod || 'unknown',
        items: items?.map((i: any) => i.productName).join(', ') || '',
      });
    } catch (e) {
      console.warn('WhatsApp notification failed:', e);
    }

    return NextResponse.json({ success: true, data: transformedOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Create order error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
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
