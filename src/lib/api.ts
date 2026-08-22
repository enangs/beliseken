// ══════════════════════════════════════════════════════════════
// API Client — Works with API routes OR localStorage fallback
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
  originalPrice?: number; discount: number; weight: number | null;
  dimensions: string | null; badge: string | null; isFeatured: boolean;
  avgRating: number; reviewCount: number; soldCount: number; viewCount: number;
  category: { id: string; name: string; slug: string; icon: string | null; color: string | null };
  subcategory: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  availableUnits: number;
}

export interface ProductDetailResponse extends ProductResponse {
  specs: { key: string; value: string; sortOrder: number }[];
  images: { url: string; alt: string | null; isPrimary: boolean }[];
  units: { id: string; unitSku: string; conditionGrade: { code: string; name: string; description: string }; conditionScore: number; conditionNotes: string | null; batteryHealth: number | null; sellingPrice: number }[];
  reviews: any[]; totalReviews: number;
}

export interface CategoryResponse {
  id: string; name: string; slug: string; icon: string | null; color: string | null;
  itemCount: number; subcategories: { id: string; name: string; slug: string }[];
}

// ══════════════════════════════════════════════════════════════
// Convert local Product → ProductResponse
// ══════════════════════════════════════════════════════════════

function toProductResponse(p: LocalProduct): ProductResponse {
  return {
    id: p.id, name: p.name, slug: p.slug, sku: `SKU-${p.id}`,
    description: p.description || null, sellingPrice: p.price,
    basePrice: Math.round(p.price * 0.65), originalPrice: p.originalPrice,
    discount: p.discount, weight: p.weight || null, dimensions: p.dimensions || null,
    badge: p.badge || null, isFeatured: p.badge === 'HOT DEAL' || p.badge === 'BEST SELLER',
    avgRating: p.rating, reviewCount: p.reviewCount,
    soldCount: Math.floor(Math.random() * 50) + 5, viewCount: Math.floor(Math.random() * 500) + 50,
    category: { id: '', name: p.category, slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'), icon: null, color: null },
    subcategory: p.subcategory ? { id: '', name: p.subcategory, slug: p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    brand: p.brand ? { id: '', name: p.brand, slug: p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    availableUnits: 3,
  };
}

function toCategoryResponse(c: LocalCategory): CategoryResponse {
  return { id: c.id, name: c.name, slug: c.slug, icon: c.icon, color: c.color, itemCount: c.itemCount, subcategories: [] };
}

// ══════════════════════════════════════════════════════════════
// Try API, fallback to localStorage
// ══════════════════════════════════════════════════════════════

async function tryAPI<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success) return data;
  } catch {}
  return null;
}

export async function getProducts(params?: {
  category?: string; brand?: string; search?: string; badge?: string;
  featured?: boolean; sort?: string; page?: number; limit?: number;
  minPrice?: number; maxPrice?: number; condition?: string;
}) {
  // Try API
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

  // Fallback
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
  return { success: true, data: { ...base, specs: (p.specs || []).map((s: string, i: number) => { const parts = s.split(':'); return { key: parts[0]?.trim() || `Spec ${i+1}`, value: parts[1]?.trim() || s, sortOrder: i }; }), images: [], units: [{ id: '1', unitSku: `${base.sku}-001`, conditionGrade: { code: 'A', name: 'Mulus', description: '' }, conditionScore: 90, conditionNotes: null, batteryHealth: null, sellingPrice: p.price }], reviews: [], totalReviews: p.reviewCount } };
}

export async function getCategories() {
  const apiResult = await tryAPI<{ success: boolean; data: CategoryResponse[] }>('/api/categories');
  if (apiResult) return apiResult;
  return { success: true, data: localCategories.map(toCategoryResponse) };
}

// Admin (localStorage for static export)
export async function getAdminProducts(params?: { page?: number; limit?: number; search?: string }) {
  let products = getLocalProducts();
  if (params?.search) { const s = params.search.toLowerCase(); products = products.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)); }
  return { success: true, data: products.map(toProductResponse), meta: { page: 1, limit: 100, total: products.length, totalPages: 1 } };
}
export async function createProduct(d: any) { return { success: true, data: d }; }
export async function updateProduct(id: string, u: any) { return { success: true, data: u }; }
export async function deleteProduct(id: string) { return { success: true, message: 'Deleted' }; }
export async function getAdminOrders() { return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalRevenue: 0, totalOrders: 0 } }; }
export async function updateOrderStatus(id: string, status: string) { return { success: true, data: {} }; }
export async function getAdminCustomers() { return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalCustomers: 0, withAddresses: 0, newThisMonth: 0 } }; }
export async function validateCart(items: any[]) { return { success: true, data: { valid: true, items } }; }
export async function createOrder(d: any) { return { success: true, data: { orderId: String(Date.now()), orderNumber: `BS-${Date.now()}`, total: 0, status: 'pending' } }; }
export async function getOrders(userId: string) { return { success: true, data: [] }; }
export async function getOrder(orderNumber: string) { return { success: true, data: null }; }
