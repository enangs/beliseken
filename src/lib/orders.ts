import type { CartItem } from "./cart";

export interface OrderAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  province: string;
  provinceId: string;
  postcode: string;
}

export interface ShippingOption {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | "pending"
  | "waiting_payment"
  | "paid"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  address: OrderAddress;
  shipping: ShippingOption;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; date: string; note: string }[];
  paymentMethod: string;
  paymentProvider?: string; // PAKASIR, MANUAL, etc.
  paymentRef?: any; // Payment provider reference data
  trackingNumber?: string; // No. Resi
  trackingUrl?: string; // URL tracking kurir
  createdAt: string;
  updatedAt: string;
}

const ORDERS_KEY = "beliseken_orders";
const ORDER_COUNTER_KEY = "beliseken_order_counter";

function generateOrderNumber(): string {
  if (typeof window === "undefined") return "";
  let counter = parseInt(localStorage.getItem(ORDER_COUNTER_KEY) || "0");
  counter++;
  localStorage.setItem(ORDER_COUNTER_KEY, String(counter));
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `BS-${dateStr}-${String(counter).padStart(4, "0")}`;
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find((o) => o.orderNumber === orderNumber);
}

export function getUserOrders(userId?: string): Order[] {
  const orders = getOrders();
  if (userId) return orders.filter((o) => o.userId === userId);
  // For anonymous users, get orders without userId
  return orders.filter((o) => !o.userId);
}

export function createOrder(data: {
  items: CartItem[];
  address: OrderAddress;
  shipping: ShippingOption;
  paymentMethod: string;
  userId?: string;
}): Order {
  const orderItems: OrderItem[] = data.items.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    productSlug: item.product.slug,
    productImage: item.product.imageBase64,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

  const now = new Date().toISOString();
  const order: Order = {
    id: String(Date.now()),
    orderNumber: generateOrderNumber(),
    userId: data.userId,
    items: orderItems,
    address: data.address,
    shipping: data.shipping,
    subtotal,
    shippingCost: data.shipping.cost,
    total: subtotal + data.shipping.cost,
    status: data.paymentMethod === "cod" ? "processing" : "waiting_payment",
    statusHistory: [
      {
        status: data.paymentMethod === "cod" ? "processing" : "waiting_payment",
        date: now,
        note: "Pesanan dibuat",
      },
    ],
    paymentMethod: data.paymentMethod,
    createdAt: now,
    updatedAt: now,
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus, note?: string): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  orders[idx].status = status;
  orders[idx].updatedAt = now;
  orders[idx].statusHistory.push({
    status,
    date: now,
    note: note || `Status diubah ke ${status}`,
  });

  saveOrders(orders);
  return orders[idx];
}

export function cancelOrder(id: string): Order | null {
  return updateOrderStatus(id, "cancelled", "Pesanan dibatalkan oleh user");
}

export function updateTrackingNumber(id: string, trackingNumber: string, courier?: string): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  orders[idx].trackingNumber = trackingNumber;
  
  // Generate tracking URL based on courier
  const courierLower = (courier || orders[idx].shipping?.courier || '').toLowerCase();
  if (courierLower.includes('jne')) {
    orders[idx].trackingUrl = `https://www.jne.co.id/tracking/waybill/${trackingNumber}`;
  } else if (courierLower.includes('sicepat')) {
    orders[idx].trackingUrl = `https://www.sicepat.com/checkAWB/${trackingNumber}`;
  } else if (courierLower.includes('j&t') || courierLower.includes('jnt')) {
    orders[idx].trackingUrl = `https://www.jtexpress.co.id/tracking?billCode=${trackingNumber}`;
  } else if (courierLower.includes('pos')) {
    orders[idx].trackingUrl = `https://tracking.posindonesia.co.id/?nos=${trackingNumber}`;
  } else if (courierLower.includes('tiki')) {
    orders[idx].trackingUrl = `https://www.tiki.id/tracking?airwaybill=${trackingNumber}`;
  } else {
    orders[idx].trackingUrl = '';
  }
  
  orders[idx].updatedAt = now;
  orders[idx].statusHistory.push({
    status: orders[idx].status,
    date: now,
    note: `No. Resi: ${trackingNumber}`,
  });

  saveOrders(orders);
  return orders[idx];
}

// Province/City/District data for Bekasi area
export const PROVINCES = [
  { id: "6", name: "JAWA BARAT" },
  { id: "31", name: "DKI JAKARTA" },
  { id: "32", name: "JAWA TENGAH" },
  { id: "33", name: "JAWA TIMUR" },
];

export const CITIES: Record<string, { id: string; name: string }[]> = {
  "6": [
    { id: "68423", name: "KAB. BEKASI" },
    { id: "68424", name: "KAB. BOGOR" },
    { id: "68425", name: "KAB. CIANJUR" },
    { id: "68426", name: "KAB. KARAWANG" },
    { id: "68427", name: "KAB. PURWAKARTA" },
    { id: "68428", name: "KAB. SUBANG" },
    { id: "68429", name: "KOTA BEKASI" },
    { id: "68430", name: "KOTA BOGOR" },
    { id: "68431", name: "KOTA DEPOK" },
    { id: "68432", name: "KOTA SUKABUMI" },
  ],
  "31": [
    { id: "31555", name: "KOTA JAKARTA PUSAT" },
    { id: "31556", name: "KOTA JAKARTA UTARA" },
    { id: "31557", name: "KOTA JAKARTA BARAT" },
    { id: "31558", name: "KOTA JAKARTA SELATAN" },
    { id: "31559", name: "KOTA JAKARTA TIMUR" },
  ],
  "32": [
    { id: "320101", name: "KAB. SEMARANG" },
    { id: "320102", name: "KOTA SEMARANG" },
    { id: "320103", name: "KOTA SOLO" },
  ],
  "33": [
    { id: "330101", name: "KAB. SURABAYA" },
    { id: "330102", name: "KOTA SURABAYA" },
    { id: "330103", name: "KOTA MALANG" },
  ],
};

// Our store origin (Bekasi)
export const STORE_ORIGIN = "68423";

// Default shipping cost for Bekasi local delivery
export const LOCAL_SHIPPING_COST = 10000;
