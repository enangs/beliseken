export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Optimize Cloudinary URLs
function optimizeImageUrl(url: string | null): string | null {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/q_auto,f_auto,w_800/${parts[1]}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('q');
    const featured = searchParams.get('featured');
    const badge = searchParams.get('badge');
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    const sort = searchParams.get('sort') || 'newest';
    let orderByClause = 'p."createdAt" DESC';
    switch (sort) {
      case 'price_asc': orderByClause = 'p."sellingPrice" ASC'; break;
      case 'price_desc': orderByClause = 'p."sellingPrice" DESC'; break;
      case 'popular': orderByClause = 'p."soldCount" DESC'; break;
      case 'rating': orderByClause = 'p."avgRating" DESC'; break;
    }

    // Build WHERE clause
    const conditions: string[] = ['p."isActive" = true'];
    const params: any[] = [];
    let paramIdx = 1;

    if (category) {
      conditions.push(`c.slug = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (brand) {
      conditions.push(`b.slug = $${paramIdx}`);
      params.push(brand);
      paramIdx++;
    }
    if (minPrice) {
      conditions.push(`p."sellingPrice" >= $${paramIdx}`);
      params.push(parseFloat(minPrice));
      paramIdx++;
    }
    if (maxPrice) {
      conditions.push(`p."sellingPrice" <= $${paramIdx}`);
      params.push(parseFloat(maxPrice));
      paramIdx++;
    }
    if (featured === 'true') {
      conditions.push(`p."isFeatured" = true`);
    }
    if (badge) {
      conditions.push(`p.badge = $${paramIdx}`);
      params.push(badge);
      paramIdx++;
    }
    if (search) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx} OR b.name ILIKE $${paramIdx})`);
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (inStock === 'true') {
      conditions.push(`EXISTS (SELECT 1 FROM product_units pu WHERE pu."productId" = p.id AND pu.status = 'AVAILABLE')`);
    }
    if (condition) {
      const codes = condition.split(',');
      const codeConditions = codes.map((_, i) => `$${paramIdx + i}`);
      conditions.push(`EXISTS (SELECT 1 FROM product_units pu2 JOIN condition_grades cg ON pu2."conditionGradeId" = cg.id WHERE pu2."productId" = p.id AND pu2.status = 'AVAILABLE' AND cg.code IN (${codeConditions.join(',')}))`);
      codes.forEach(c => { params.push(c); paramIdx++; });
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int as total
      FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN brands b ON p."brandId" = b.id
      ${whereClause}
    `;
    const countResult = await prisma.$queryRawUnsafe(countQuery, ...params) as any[];
    const total = countResult[0]?.total || 0;

    // Main query - single JOIN query instead of Prisma ORM
    const productsQuery = `
      SELECT 
        p.id, p.name, p.slug, p.sku, p.description, p."shortDesc",
        p."sellingPrice", p."basePrice", p.discount, p.weight, p.dimensions,
        p.badge, p."isFeatured", p."avgRating", p."reviewCount", p."soldCount",
        p."viewCount", p."createdAt",
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.icon as cat_icon, c.color as cat_color,
        sc.id as sub_id, sc.name as sub_name, sc.slug as sub_slug,
        b.id as brand_id, b.name as brand_name, b.slug as brand_slug,
        (SELECT pi.url FROM product_images pi WHERE pi."productId" = p.id AND pi."isPrimary" = true LIMIT 1) as image_url,
        (SELECT COUNT(*)::int FROM product_units pu WHERE pu."productId" = p.id AND pu.status = 'AVAILABLE') as stock_count
      FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN categories sc ON p."subcategoryId" = sc.id
      LEFT JOIN brands b ON p."brandId" = b.id
      ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT ${limit} OFFSET ${skip}
    `;

    const products = await prisma.$queryRawUnsafe(productsQuery, ...params) as any[];

    // Transform
    const transformedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDesc: p.shortDesc,
      sellingPrice: p.sellingPrice,
      basePrice: p.basePrice,
      discount: p.discount,
      weight: p.weight,
      dimensions: p.dimensions,
      badge: p.badge,
      isFeatured: p.isFeatured,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      soldCount: p.soldCount,
      viewCount: p.viewCount,
      createdAt: p.createdAt,
      category: p.cat_id ? { id: p.cat_id, name: p.cat_name, slug: p.cat_slug, icon: p.cat_icon, color: p.cat_color } : null,
      subcategory: p.sub_id ? { id: p.sub_id, name: p.sub_name, slug: p.sub_slug } : null,
      brand: p.brand_id ? { id: p.brand_id, name: p.brand_name, slug: p.brand_slug } : null,
      imageBase64: optimizeImageUrl(p.image_url),
      allImages: [],
      stock: p.stock_count,
      availableUnits: p.stock_count,
      supplier: "",
      status: p.stock_count === 0 ? "SOLD_OUT" : "ACTIVE",
      condition: "Grade A",
    }));

    const response = NextResponse.json({
      success: true,
      data: transformedProducts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    return response;
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
