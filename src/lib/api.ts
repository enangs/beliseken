// ══════════════════════════════════════════════════════════════
// API Client — Works with Supabase API routes
// ══════════════════════════════════════════════════════════════

import {
  initialProducts,
  categories as localCategories,
  type Product as LocalProduct,
  type Category as LocalCategory,
  type BlogPost,
  getProducts as getLocalProducts,
  getProductBySlug as getLocalProductBySlug,
  getBlogPosts as getLocalBlogPosts,
  storeInfo,
} from '@/data/products';

export { storeInfo };
export type { BlogPost };

export interface ProductResponse {
  id: string; name: string; slug: string; sku: string;
  description: string | null; sellingPrice: number; basePrice: number;
  imageBase64: string | null;
  originalPrice?: number; discount: number; weight: number | null;
  dimensions: string | null; badge: string | null; isFeatured: boolean;
  avgRating: number; reviewCount: number; soldCount: number; viewCount: number;
  category: { id: string; name: string; slug: string; icon: string | null; color: string | null };
  subcategory: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  availableUnits: number;
  // Inventory fields
  stock: number;
  supplier: string;
  status: string; // ACTIVE, SOLD_OUT, RESERVED
  condition: string;
}

export interface ProductDetailResponse extends ProductResponse {
  specs: { key: string; value: string; sortOrder: number }[];
  images: string[]; // array of base64 images
  allImages: string[]; // all images including main
  units: { id: string; unitSku: string; conditionGrade: { code: string; name: string; description: string }; conditionScore: number; conditionNotes: string | null; batteryHealth: number | null; sellingPrice: number }[];
  reviews: any[]; totalReviews: number;
}

export interface CategoryResponse {
  id: string; name: string; slug: string; icon: string | null; color: string | null;
  itemCount: number; subcategories: { id: string; name: string; slug: string }[];
}

// ══════════════════════════════════════════════════════════════
// Helper: try API, fallback to null
// ══════════════════════════════════════════════════════════════

async function tryAPI<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) return data;
  } catch {}
  return null;
}

// ══════════════════════════════════════════════════════════════
// Products (public)
// ══════════════════════════════════════════════════════════════

export async function getProducts(params?: {
  category?: string; brand?: string; search?: string; badge?: string;
  featured?: boolean; sort?: string; page?: number; limit?: number;
  minPrice?: number; maxPrice?: number; condition?: string;
}) {
  const sp = new URLSearchParams();
  if (params?.category) sp.set('category', params.category);
  if (params?.brand) sp.set('brand', params.brand);
  if (params?.search) sp.set('q', params.search);
  if (params?.badge) sp.set('badge', params.badge);
  if (params?.featured) sp.set('featured', 'true');
  if (params?.sort) sp.set('sort', params.sort);
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  const q = sp.toString();
  const apiResult = await tryAPI<{ success: boolean; data: ProductResponse[]; meta: any }>(`/api/products${q ? `?${q}` : ''}`);
  if (apiResult) return apiResult;

  // Fallback to localStorage
  let products = getLocalProducts();
  if (params?.category) products = products.filter(p => p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.category);
  if (params?.brand) products = products.filter(p => p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.brand);
  if (params?.search) { const s = params.search.toLowerCase(); products = products.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)); }
  if (params?.badge) products = products.filter(p => p.badge === params.badge);
  if (params?.minPrice) products = products.filter(p => p.price >= params.minPrice!);
  if (params?.maxPrice) products = products.filter(p => p.price <= params.maxPrice!);
  if (params?.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (params?.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (params?.sort === 'popular') products.sort((a, b) => b.reviewCount - a.reviewCount);
  const limit = params?.limit || 20; const page = params?.page || 1;
  const start = (page - 1) * limit;
  return { success: true, data: products.slice(start, start + limit).map(toProductResponse), meta: { page, limit, total: products.length, totalPages: Math.ceil(products.length / limit) } };
}

export async function getProductBySlug(slug: string) {
  const apiResult = await tryAPI<{ success: boolean; data: ProductDetailResponse }>(`/api/products/${slug}`);
  if (apiResult) return apiResult;
  const p = getLocalProductBySlug(slug);
  if (!p) return null;
  const base = toProductResponse(p);
  const allImages = (p as any).images || (p.imageBase64 ? [p.imageBase64] : []);
  return { success: true, data: { ...base, specs: (p.specs || []).map((s: string, i: number) => { const parts = s.split(':'); return { key: parts[0]?.trim() || `Spec ${i+1}`, value: parts[1]?.trim() || s, sortOrder: i }; }), images: allImages.slice(1), allImages: allImages.length > 0 ? allImages : [], units: [{ id: '1', unitSku: `${base.sku}-001`, conditionGrade: { code: 'A', name: 'Mulus', description: '' }, conditionScore: 90, conditionNotes: null, batteryHealth: null, sellingPrice: p.price }], reviews: [], totalReviews: p.reviewCount } };
}

export async function getCategories() {
  const apiResult = await tryAPI<{ success: boolean; data: CategoryResponse[] }>('/api/categories');
  if (apiResult) return apiResult;
  return { success: true, data: localCategories.map(toCategoryResponse) };
}

// ══════════════════════════════════════════════════════════════
// Admin: Products — fetch from Supabase API
// ══════════════════════════════════════════════════════════════

export async function getAdminProducts(params?: { page?: number; limit?: number; search?: string }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.search) sp.set('q', params.search);
  const q = sp.toString();
  const apiResult = await tryAPI<{ success: boolean; data: any[]; meta: any }>(`/api/admin/products${q ? `?${q}` : ''}`);
  if (apiResult) return apiResult;

  // Fallback
  let products = getLocalProducts();
  if (params?.search) { const s = params.search.toLowerCase(); products = products.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)); }
  return { success: true, data: products.map(toProductResponse), meta: { page: 1, limit: 100, total: products.length, totalPages: 1 } };
}

export async function getProductById(id: string) {
  // Try API
  try {
    const res = await fetch(`/api/admin/products?id=${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch {}

  // Fallback to local
  const { products } = await import('@/data/products');
  const p = products.find((x: any) => x.id === id);
  if (!p) return null;
  return toProductResponse(p);
}

export async function createProduct(d: any) {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProduct(id: string, u: any) {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...u }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════════
// Admin: Orders — fetch from Supabase API
// ══════════════════════════════════════════════════════════════

export async function getAdminOrders() {
  const apiResult = await tryAPI<{ success: boolean; data: any[]; meta: any; stats: any }>('/api/orders?admin=true');
  if (apiResult) return apiResult;
  return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalRevenue: 0, totalOrders: 0 } };
}

export async function updateOrderStatus(id: string, status: string, trackingNumber?: string, courier?: string) {
  try {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber, courier }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════════
// Admin: Customers — fetch from Supabase API
// ══════════════════════════════════════════════════════════════

export async function getAdminCustomers(options?: { search?: string; limit?: number }) {
  const sp = new URLSearchParams();
  if (options?.search) sp.set('q', options.search);
  if (options?.limit) sp.set('limit', String(options.limit));
  const q = sp.toString();
  const apiResult = await tryAPI<{ success: boolean; data: any[]; meta: any; stats: any }>(`/api/admin/customers${q ? `?${q}` : ''}`);
  if (apiResult) return apiResult;

  // Fallback to localStorage
  try {
    const { getAllCustomers } = await import('./user-auth');
    let customers = getAllCustomers();
    if (options?.search) {
      const s = options.search.toLowerCase();
      customers = customers.filter(c =>
        c.name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.phone?.includes(s)
      );
    }
    return {
      success: true,
      data: customers,
      meta: { page: 1, limit: options?.limit || 100, total: customers.length, totalPages: 1 },
      stats: {
        totalCustomers: customers.length,
        withAddresses: customers.filter(c => c.addresses && c.addresses.length > 0).length,
        newThisMonth: customers.filter(c => {
          const d = new Date(c.createdAt);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length
      }
    };
  } catch {
    return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalCustomers: 0, withAddresses: 0, newThisMonth: 0 } };
  }
}

// ══════════════════════════════════════════════════════════════
// Cart & Checkout
// ══════════════════════════════════════════════════════════════

export async function validateCart(items: any[]) {
  return { success: true, data: { valid: true, items } };
}

// ══════════════════════════════════════════════════════════════
// Orders (customer)
// ══════════════════════════════════════════════════════════════

export async function getOrders(userId: string) {
  try {
    const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch {}
  return { success: true, data: [] };
}

export async function getOrder(orderNumber: string) {
  try {
    const res = await fetch(`/api/orders?q=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch {}
  return { success: true, data: null };
}

// ══════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════

function toProductResponse(p: LocalProduct): ProductResponse {
  return {
    id: p.id, name: p.name, slug: p.slug, sku: p.sku || `BS-${p.id}`,
    description: p.description || null, sellingPrice: p.price,
    basePrice: Math.round(p.price * 0.65), originalPrice: p.originalPrice,
    discount: p.discount, weight: p.weight || null, dimensions: p.dimensions || null,
    imageBase64: p.imageBase64 || null,
    badge: p.badge || null, isFeatured: p.badge === 'HOT DEAL' || p.badge === 'BEST SELLER',
    avgRating: p.rating, reviewCount: p.reviewCount,
    soldCount: Math.floor(Math.random() * 50) + 5, viewCount: Math.floor(Math.random() * 500) + 50,
    category: { id: '', name: p.category, slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'), icon: null, color: null },
    subcategory: p.subcategory ? { id: '', name: p.subcategory, slug: p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    brand: p.brand ? { id: '', name: p.brand, slug: p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    availableUnits: p.stock ?? 1,
    stock: p.stock ?? 1,
    supplier: p.supplier || '',
    status: p.status || (p.stock === 0 ? 'SOLD_OUT' : 'ACTIVE'),
    condition: p.condition || 'Grade A',
  };
}

function toCategoryResponse(c: LocalCategory): CategoryResponse {
  return { id: c.id, name: c.name, slug: c.slug, icon: c.icon, color: c.color, itemCount: c.itemCount, subcategories: [] };
}
