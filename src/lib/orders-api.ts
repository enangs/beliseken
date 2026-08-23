// Client-side API helper for orders
// Uses Supabase database with localStorage fallback

import type { Order, OrderStatus } from './orders';

const API_BASE = '/api';

// Check if we're on client side
const isClient = typeof window !== 'undefined';

// localStorage helpers
function getLocalOrders(): Order[] {
  if (!isClient) return [];
  try {
    const stored = localStorage.getItem('beliseken_orders');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveLocalOrders(orders: Order[]) {
  if (!isClient) return;
  localStorage.setItem('beliseken_orders', JSON.stringify(orders));
}

export async function fetchOrders(options?: {
  userId?: string;
  email?: string;
  admin?: boolean;
  status?: string;
}): Promise<Order[]> {
  try {
    const params = new URLSearchParams();
    if (options?.userId) params.set('userId', options.userId);
    if (options?.email) params.set('email', options.email);
    if (options?.admin) params.set('admin', 'true');
    if (options?.status) params.set('status', options.status);

    const response = await fetch(`${API_BASE}/orders?${params.toString()}`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch orders');
    }

    return data.data;
  } catch (error) {
    console.warn('API fetch failed, using localStorage fallback:', error);
    // Fallback to localStorage
    let orders = getLocalOrders();
    
    if (options?.email) {
      orders = orders.filter(o => o.address?.email === options.email);
    }
    if (options?.status && options.status !== 'all') {
      orders = orders.filter(o => o.status === options.status);
    }
    
    return orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Order not found');
    }

    return data.data;
  } catch (error) {
    console.warn('API fetch failed, using localStorage fallback:', error);
    const orders = getLocalOrders();
    return orders.find(o => o.id === id || o.orderNumber === id) || null;
  }
}

export async function createOrder(orderData: {
  items: Array<{
    productName: string;
    productSlug?: string;
    productImage?: string;
    price: number;
    quantity: number;
  }>;
  address: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    cityId: string;
    district?: string;
    districtId?: string;
    province: string;
    provinceId: string;
    postcode: string;
  };
  shipping: {
    courier: string;
    service: string;
    description?: string;
    cost: number;
    etd?: string;
  };
  paymentMethod: string;
  userId?: string;
}): Promise<Order | null> {
  // Generate order number locally
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const orders = getLocalOrders();
  const todayCount = orders.filter(o => o.orderNumber?.includes(dateStr)).length;
  const orderNumber = `BS-${dateStr}-${String(todayCount + 1).padStart(4, '0')}`;

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = orderData.shipping.cost || 0;

  const newOrder: Order = {
    id: String(Date.now()),
    orderNumber,
    userId: orderData.userId,
    items: orderData.items,
    address: orderData.address as any,
    shipping: orderData.shipping as any,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    status: orderData.paymentMethod === 'cod' ? 'processing' : 'waiting_payment',
    statusHistory: [{
      status: orderData.paymentMethod === 'cod' ? 'processing' : 'waiting_payment',
      date: date.toISOString(),
      note: 'Pesanan dibuat',
    }],
    paymentMethod: orderData.paymentMethod,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };

  // Save to localStorage
  orders.push(newOrder);
  saveLocalOrders(orders);

  // Try to save to API (background)
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    if (data.success && data.data) {
      // Update with server-generated ID
      const idx = orders.findIndex(o => o.orderNumber === orderNumber);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], id: data.data.id };
        saveLocalOrders(orders);
      }
      return data.data;
    }
  } catch (error) {
    console.warn('API save failed, order saved locally:', error);
  }

  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
  trackingNumber?: string,
  courier?: string,
  service?: string
): Promise<Order | null> {
  // Update locally first
  const orders = getLocalOrders();
  const idx = orders.findIndex(o => o.id === id);
  
  if (idx !== -1) {
    const now = new Date().toISOString();
    orders[idx].status = status;
    orders[idx].updatedAt = now;
    if (trackingNumber) orders[idx].trackingNumber = trackingNumber;
    orders[idx].statusHistory.push({
      status,
      date: now,
      note: note || `Status diubah ke ${status}`,
    });
    saveLocalOrders(orders);
  }

  // Try API
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, trackingNumber, courier, service }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    if (data.success) return data.data;
  } catch (error) {
    console.warn('API update failed, order updated locally:', error);
  }

  return idx !== -1 ? orders[idx] : null;
}

export async function updateTrackingNumber(
  id: string,
  trackingNumber: string,
  courier?: string
): Promise<Order | null> {
  return updateOrderStatus(id, 'shipping' as OrderStatus, undefined, trackingNumber, courier);
}
