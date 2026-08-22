// ══════════════════════════════════════════════════════════════
// API Client for Frontend
// ══════════════════════════════════════════════════════════════

const API_BASE = '';

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ══════════════════════════════════════════════════════════════
// Products API
// ══════════════════════════════════════════════════════════════

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  sellingPrice: number;
  basePrice: number;
  discount: number;
  weight: number | null;
  dimensions: string | null;
  badge: string | null;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  soldCount: number;
  viewCount: number;
  category: { id: string; name: string; slug: string; icon: string | null; color: string | null };
  subcategory: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  availableUnits: number;
}

export interface ProductDetailResponse extends ProductResponse {
  specs: { key: string; value: string; sortOrder: number }[];
  images: { url: string; alt: string | null; isPrimary: boolean }[];
  units: {
    id: string;
    unitSku: string;
    conditionGrade: { code: string; name: string; description: string };
    conditionScore: number;
    conditionNotes: string | null;
    batteryHealth: number | null;
    sellingPrice: number;
  }[];
  reviews: any[];
  totalReviews: number;
}

export async function getProducts(params?: {
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  badge?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.brand) searchParams.set('brand', params.brand);
  if (params?.condition) searchParams.set('condition', params.condition);
  if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice));
  if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
  if (params?.search) searchParams.set('q', params.search);
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.badge) searchParams.set('badge', params.badge);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return fetchAPI<{ success: boolean; data: ProductResponse[]; meta: any }>(
    `/api/products${query ? `?${query}` : ''}`
  );
}

export async function getProductBySlug(slug: string) {
  return fetchAPI<{ success: boolean; data: ProductDetailResponse }>(
    `/api/products/${slug}`
  );
}

// ══════════════════════════════════════════════════════════════
// Categories API
// ══════════════════════════════════════════════════════════════

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  itemCount: number;
  subcategories: { id: string; name: string; slug: string }[];
}

export async function getCategories() {
  return fetchAPI<{ success: boolean; data: CategoryResponse[] }>('/api/categories');
}

// ══════════════════════════════════════════════════════════════
// Cart Validation API
// ══════════════════════════════════════════════════════════════

export async function validateCart(items: { productId: string; quantity: number }[]) {
  return fetchAPI<{ success: boolean; data: { valid: boolean; items: any[] } }>(
    '/api/cart/validate',
    { method: 'POST', body: JSON.stringify({ items }) }
  );
}

// ══════════════════════════════════════════════════════════════
// Orders API
// ══════════════════════════════════════════════════════════════

export async function createOrder(orderData: {
  items: { productId: string; unitId: string; quantity: number }[];
  address: any;
  shipping: any;
  paymentMethod: string;
  userId?: string;
}) {
  return fetchAPI<{ success: boolean; data: { orderId: string; orderNumber: string; total: number; status: string } }>(
    '/api/orders',
    { method: 'POST', body: JSON.stringify(orderData) }
  );
}

export async function getOrders(userId: string) {
  return fetchAPI<{ success: boolean; data: any[] }>(
    `/api/orders?userId=${userId}`
  );
}

export async function getOrder(orderNumber: string) {
  return fetchAPI<{ success: boolean; data: any }>(
    `/api/orders?orderNumber=${orderNumber}`
  );
}

// ══════════════════════════════════════════════════════════════
// Admin API
// ══════════════════════════════════════════════════════════════

export async function getAdminProducts(params?: { page?: number; limit?: number; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('q', params.search);

  const query = searchParams.toString();
  return fetchAPI<{ success: boolean; data: any[]; meta: any }>(
    `/api/admin/products${query ? `?${query}` : ''}`
  );
}

export async function createProduct(productData: any) {
  return fetchAPI<{ success: boolean; data: any }>(
    '/api/admin/products',
    { method: 'POST', body: JSON.stringify(productData) }
  );
}

export async function updateProduct(id: string, updates: any) {
  return fetchAPI<{ success: boolean; data: any }>(
    '/api/admin/products',
    { method: 'PUT', body: JSON.stringify({ id, ...updates }) }
  );
}

export async function deleteProduct(id: string) {
  return fetchAPI<{ success: boolean; message: string }>(
    `/api/admin/products?id=${id}`,
    { method: 'DELETE' }
  );
}

export async function getAdminOrders(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.search) searchParams.set('q', params.search);

  const query = searchParams.toString();
  return fetchAPI<{ success: boolean; data: any[]; meta: any; stats: any }>(
    `/api/admin/orders${query ? `?${query}` : ''}`
  );
}

export async function updateOrderStatus(id: string, status: string, note?: string) {
  return fetchAPI<{ success: boolean; data: any }>(
    '/api/admin/orders',
    { method: 'PUT', body: JSON.stringify({ id, status, note }) }
  );
}

export async function getAdminCustomers(params?: { page?: number; limit?: number; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('q', params.search);

  const query = searchParams.toString();
  return fetchAPI<{ success: boolean; data: any[]; meta: any; stats: any }>(
    `/api/admin/customers${query ? `?${query}` : ''}`
  );
}
