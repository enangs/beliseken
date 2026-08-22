// ══════════════════════════════════════════════════════════════
// API Client with localStorage Fallback
// Works with: API routes (local dev) OR localStorage (cPanel static)
// ══════════════════════════════════════════════════════════════

import {
  initialProducts,
  categories as localCategories,
  type Product as LocalProduct,
  type Category as LocalCategory,
  type BlogPost,
  initialBlogPosts,
  getProducts as getLocalProducts,
  getProductBySlug as getLocalProductBySlug,
  getBlogPosts as getLocalBlogPosts,
  storeInfo,
} from '@/data/products';

// ══════════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════════

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  sellingPrice: number;
  basePrice: number;
  originalPrice?: number;
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

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  itemCount: number;
  subcategories: { id: string; name: string; slug: string }[];
}

export { storeInfo };

// ══════════════════════════════════════════════════════════════
// Helper: Convert Local Product to ProductResponse
// ══════════════════════════════════════════════════════════════

function toProductResponse(p: LocalProduct): ProductResponse {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: `SKU-${p.id}`,
    description: p.description || null,
    sellingPrice: p.price,
    basePrice: Math.round(p.price * 0.65),
    originalPrice: p.originalPrice,
    discount: p.discount,
    weight: p.weight || null,
    dimensions: p.dimensions || null,
    badge: p.badge || null,
    isFeatured: p.badge === 'HOT DEAL' || p.badge === 'BEST SELLER',
    avgRating: p.rating,
    reviewCount: p.reviewCount,
    soldCount: Math.floor(Math.random() * 50) + 5,
    viewCount: Math.floor(Math.random() * 500) + 50,
    category: {
      id: '',
      name: p.category,
      slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: null,
      color: null,
    },
    subcategory: p.subcategory ? { id: '', name: p.subcategory, slug: p.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    brand: p.brand ? { id: '', name: p.brand, slug: p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : null,
    availableUnits: 3,
  };
}

function toCategoryResponse(c: LocalCategory): CategoryResponse {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
    itemCount: c.itemCount,
    subcategories: [],
  };
}

// ══════════════════════════════════════════════════════════════
// API Functions (with fallback)
// ══════════════════════════════════════════════════════════════

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
}): Promise<{ success: boolean; data: ProductResponse[]; meta: any }> {
  // Try API first
  try {
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
    const res = await fetch(`/api/products${query ? `?${query}` : ''}`);
    const data = await res.json();
    if (data.success) return data;
  } catch {}

  // Fallback to localStorage
  let products = getLocalProducts();

  // Apply filters
  if (params?.category) {
    products = products.filter(p => p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.category);
  }
  if (params?.brand) {
    products = products.filter(p => p.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.brand);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (params?.badge) {
    products = products.filter(p => p.badge === params.badge);
  }
  if (params?.featured) {
    products = products.filter(p => p.badge === 'HOT DEAL' || p.badge === 'BEST SELLER');
  }
  if (params?.minPrice) {
    products = products.filter(p => p.price >= params.minPrice!);
  }
  if (params?.maxPrice) {
    products = products.filter(p => p.price <= params.maxPrice!);
  }

  // Sort
  if (params?.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (params?.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (params?.sort === 'popular') products.sort((a, b) => b.reviewCount - a.reviewCount);

  const limit = params?.limit || 20;
  const page = params?.page || 1;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return {
    success: true,
    data: paginated.map(toProductResponse),
    meta: { page, limit, total: products.length, totalPages: Math.ceil(products.length / limit) },
  };
}

export async function getProductBySlug(slug: string): Promise<{ success: boolean; data: ProductDetailResponse } | null> {
  // Try API first
  try {
    const res = await fetch(`/api/products/${slug}`);
    const data = await res.json();
    if (data.success) return data;
  } catch {}

  // Fallback to localStorage
  const product = getLocalProductBySlug(slug);
  if (!product) return null;

  const base = toProductResponse(product);
  return {
    success: true,
    data: {
      ...base,
      specs: (product.specs || []).map((s: string, i: number) => {
        const parts = s.split(':');
        return { key: parts[0]?.trim() || `Spec ${i + 1}`, value: parts[1]?.trim() || s, sortOrder: i };
      }),
      images: [],
      units: [
        { id: '1', unitSku: `${base.sku}-001`, conditionGrade: { code: 'A', name: 'Mulus', description: 'Kondisi bagus' }, conditionScore: 90, conditionNotes: null, batteryHealth: product.specs?.find((s: string) => s.includes('Baterai')) ? parseInt(product.specs.find((s: string) => s.includes('Baterai'))!) : null, sellingPrice: product.price },
        { id: '2', unitSku: `${base.sku}-002`, conditionGrade: { code: 'B+', name: 'Bagus', description: 'Lecet minor' }, conditionScore: 80, conditionNotes: 'Ada lecet minor', batteryHealth: null, sellingPrice: Math.round(product.price * 0.9) },
        { id: '3', unitSku: `${base.sku}-003`, conditionGrade: { code: 'B', name: 'Biasa', description: 'Lecet pemakaian' }, conditionScore: 70, conditionNotes: 'Lecet pemakaian', batteryHealth: null, sellingPrice: Math.round(product.price * 0.8) },
      ],
      reviews: [],
      totalReviews: product.reviewCount,
    },
  };
}

export async function getCategories(): Promise<{ success: boolean; data: CategoryResponse[] }> {
  // Try API first
  try {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) return data;
  } catch {}

  // Fallback to localStorage
  return {
    success: true,
    data: localCategories.map(toCategoryResponse),
  };
}

export async function getBlogPostsLocal(): Promise<BlogPost[]> {
  return getLocalBlogPosts();
}

// ══════════════════════════════════════════════════════════════
// Admin API (localStorage only for static export)
// ══════════════════════════════════════════════════════════════

export async function getAdminProducts(params?: { page?: number; limit?: number; search?: string }) {
  const products = getLocalProducts();
  let filtered = products;
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  return {
    success: true,
    data: filtered.map(toProductResponse),
    meta: { page: 1, limit: 100, total: filtered.length, totalPages: 1 },
  };
}

export async function createProduct(productData: any) {
  return { success: true, data: productData };
}

export async function updateProduct(id: string, updates: any) {
  return { success: true, data: updates };
}

export async function deleteProduct(id: string) {
  return { success: true, message: 'Deleted' };
}

export async function getAdminOrders(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalRevenue: 0, totalOrders: 0 } };
}

export async function updateOrderStatus(id: string, status: string, note?: string) {
  return { success: true, data: {} };
}

export async function getAdminCustomers(params?: { page?: number; limit?: number; search?: string }) {
  return { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 }, stats: { totalCustomers: 0, withAddresses: 0, newThisMonth: 0 } };
}

export async function validateCart(items: { productId: string; quantity: number }[]) {
  return { success: true, data: { valid: true, items: items.map(i => ({ ...i, valid: true })) } };
}

export async function createOrder(orderData: any) {
  return { success: true, data: { orderId: Date.now().toString(), orderNumber: `BS-${Date.now()}`, total: 0, status: 'pending' } };
}

export async function getOrders(userId: string) {
  return { success: true, data: [] };
}

export async function getOrder(orderNumber: string) {
  return { success: true, data: null };
}
