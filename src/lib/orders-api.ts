// Client-side API helper for orders
// MERGES data from Supabase API + localStorage so nothing is lost

import type { Order, OrderStatus } from './orders';

const API_BASE = '/api';
const isClient = typeof window !== 'undefined';

// ═══════════════════════════════════════════════════════════
// LOCALSTORAGE HELPERS
// ═══════════════════════════════════════════════════════════

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

function addLocalOrder(order: Order) {
  const orders = getLocalOrders();
  // Avoid duplicates by orderNumber
  const exists = orders.find(o => o.orderNumber === order.orderNumber);
  if (!exists) {
    orders.push(order);
  } else {
    // Update with server data if available
    const idx = orders.findIndex(o => o.orderNumber === order.orderNumber);
    if (idx !== -1 && order.id !== String(Date.now())) {
      orders[idx] = { ...orders[idx], ...order };
    }
  }
  saveLocalOrders(orders);
}

// ═══════════════════════════════════════════════════════════
// MERGE: Combine API data + localStorage data (deduplicated)
// ═══════════════════════════════════════════════════════════

function mergeOrders(apiOrders: Order[], localOrders: Order[]): Order[] {
  const merged = new Map<string, Order>();

  // Add local orders first
  for (const order of localOrders) {
    const key = order.orderNumber || order.id;
    merged.set(key, order);
  }

  // API orders override local (more authoritative)
  for (const order of apiOrders) {
    const key = order.orderNumber || order.id;
    merged.set(key, order);
  }

  return Array.from(merged.values()).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function filterOrders(orders: Order[], options?: {
  userId?: string;
  email?: string;
  status?: string;
}): Order[] {
  let filtered = [...orders];

  if (options?.userId) {
    // Filter by userId only — most reliable identifier
    filtered = filtered.filter(o => o.userId === options.userId);
  } else if (options?.email) {
    // Fallback: filter by email in address snapshot
    const emailLower = options.email.toLowerCase();
    filtered = filtered.filter(o =>
      o.address?.email?.toLowerCase() === emailLower ||
      o.userId?.toLowerCase() === emailLower
    );
  }

  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter(o => o.status === options.status);
  }

  return filtered.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ═══════════════════════════════════════════════════════════
// FETCH ORDERS (admin or user) — MERGES both sources
// ═══════════════════════════════════════════════════════════

export async function fetchOrders(options?: {
  userId?: string;
  email?: string;
  admin?: boolean;
  status?: string;
}): Promise<Order[]> {
  const localOrders = getLocalOrders();
  let apiOrders: Order[] = [];

  // Try API (non-blocking)
  try {
    let url = '';
    let response: Response;

    if (options?.admin) {
      // Admin uses separate API endpoint with admin auth cookie
      const params = new URLSearchParams();
      if (options?.status) params.set('status', options.status.toUpperCase());
      params.set('limit', '50');
      url = `${API_BASE}/admin/orders?${params.toString()}`;
      response = await fetch(url, {
        credentials: 'include', // Send admin cookie
        signal: AbortSignal.timeout(10000),
      });
    } else {
      const params = new URLSearchParams();
      if (options?.userId) params.set('userId', options.userId);
      if (options?.email) params.set('email', options.email);
      if (options?.status) params.set('status', options.status);
      url = `${API_BASE}/orders?${params.toString()}`;
      response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      // Normalize admin API response to match Order interface
      if (options?.admin) {
        apiOrders = data.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          userId: o.userId,
          items: (o.items || []).map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal || item.price * item.quantity,
          })),
          address: (() => {
            try { return typeof o.addressSnapshot === 'string' ? JSON.parse(o.addressSnapshot) : (o.addressSnapshot || {}); } catch { return {}; }
          })(),
          shipping: {
            courier: o.courier || '',
            service: o.shippingService || '',
            description: '',
            cost: o.shippingCost || 0,
            etd: o.shippingEtd || '',
          },
          subtotal: o.subtotal || 0,
          shippingCost: o.shippingCost || 0,
          total: o.total || 0,
          status: (o.status || 'pending').toLowerCase(),
          statusHistory: (o.statusHistory || []).map((h: any) => ({
            status: (h.status || 'pending').toLowerCase(),
            date: h.createdAt?.toString?.() || h.createdAt || '',
            note: h.note || '',
          })),
          paymentMethod: o.paymentMethod || 'bank_transfer',
          paymentProvider: o.paymentProvider || null,
          paymentRef: o.paymentRef || null,
          paymentProofUrl: o.paymentProofUrl || null,
          trackingNumber: o.trackingNumber || null,
          createdAt: o.createdAt?.toString?.() || o.createdAt || '',
          updatedAt: o.updatedAt?.toString?.() || o.updatedAt || '',
          user: o.user || null,
        }));
      } else {
        apiOrders = data.data;
      }
    } else if (!data.success) {
      console.warn('API error:', data.error);
    }
  } catch (error) {
    console.warn('API fetch failed, using localStorage only:', error);
  }

  // Merge both sources
  const merged = mergeOrders(apiOrders, localOrders);

  // Apply filters (email, status, etc.)
  return filterOrders(merged, options);
}

// ═══════════════════════════════════════════════════════════
// FETCH SINGLE ORDER
// ═══════════════════════════════════════════════════════════

export async function fetchOrderById(id: string): Promise<Order | null> {
  // Check localStorage first
  const localOrders = getLocalOrders();
  const local = localOrders.find(o => o.id === id || o.orderNumber === id);
  if (local) return local;

  // Try API
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    if (data.success) return data.data;
  } catch (error) {
    console.warn('API fetch failed:', error);
  }

  return null;
}

// ═══════════════════════════════════════════════════════════
// CREATE ORDER — saves to localStorage + tries API
// ═══════════════════════════════════════════════════════════

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
  // Generate order number
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

  // 1. Save to localStorage FIRST (always works)
  addLocalOrder(newOrder);

  // 2. Try to save to API (background, non-blocking)
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
      const localOrders2 = getLocalOrders();
      const idx = localOrders2.findIndex(o => o.orderNumber === orderNumber);
      if (idx !== -1) {
        localOrders2[idx] = { ...localOrders2[idx], id: data.data.id };
        saveLocalOrders(localOrders2);
      }
      console.log('✅ Order saved to Supabase:', orderNumber);
      return data.data;
    } else {
      console.warn('⚠️ API returned error:', data.error);
    }
  } catch (error) {
    console.warn('⚠️ API save failed, order saved locally:', error);
  }

  return newOrder;
}

// ═══════════════════════════════════════════════════════════
// UPDATE ORDER STATUS
// ═══════════════════════════════════════════════════════════

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
  trackingNumber?: string,
  courier?: string,
  service?: string
): Promise<Order | null> {
  // Update localStorage first
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
