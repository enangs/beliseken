// Client-side API helper for orders
// Uses Supabase database instead of localStorage

import type { Order, OrderStatus } from './orders';

const API_BASE = '/api';

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

    const response = await fetch(`${API_BASE}/orders?${params.toString()}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch orders');
    }

    return data.data;
  } catch (error) {
    console.error('Fetch orders error:', error);
    return [];
  }
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Order not found');
    }

    return data.data;
  } catch (error) {
    console.error('Fetch order error:', error);
    return null;
  }
}

export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    unitId?: string;
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
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data.data;
  } catch (error) {
    console.error('Create order error:', error);
    return null;
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
  trackingNumber?: string,
  courier?: string,
  service?: string
): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, trackingNumber, courier, service }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update order');
    }

    return data.data;
  } catch (error) {
    console.error('Update order error:', error);
    return null;
  }
}

export async function updateTrackingNumber(
  id: string,
  trackingNumber: string,
  courier?: string
): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber, courier }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update tracking number');
    }

    return data.data;
  } catch (error) {
    console.error('Update tracking number error:', error);
    return null;
  }
}
