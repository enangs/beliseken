export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/admin-route-wrapper';

// GET all products (admin view) - PROTECTED
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const id = searchParams.get('id');
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          specs: { orderBy: { sortOrder: 'asc' } },
          units: { where: { status: 'AVAILABLE' } },
          _count: { select: { units: true, orderItems: true } },
        },
      });
      if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: product });
    }

    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { sku: { contains: search } }];
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true, name: true, slug: true, sku: true,
          sellingPrice: true, basePrice: true, discount: true,
          isActive: true, isFeatured: true, badge: true,
          avgRating: true, reviewCount: true, soldCount: true, createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          _count: { select: { units: { where: { status: 'AVAILABLE' } }, orderItems: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const transformed = products.map((p: any) => ({
      id: p.id, name: p.name, slug: p.slug, sku: p.sku,
      sellingPrice: p.sellingPrice, basePrice: p.basePrice, discount: p.discount,
      isActive: p.isActive, isFeatured: p.isFeatured, badge: p.badge,
      avgRating: p.avgRating, reviewCount: p.reviewCount, soldCount: p.soldCount,
      imageBase64: p.images?.[0]?.url || null, category: p.category, brand: p.brand,
      stock: p._count.units, supplier: "",
      status: p.isActive ? (p._count.units > 0 ? 'ACTIVE' : 'SOLD_OUT') : 'SOLD_OUT',
      condition: 'Grade A',
    }));

    return NextResponse.json({
      success: true, data: transformed,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data produk' }, { status: 500 });
  }
});

// POST create new product - PROTECTED
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, slug, sku, description, categoryId, subcategoryId, brandId, basePrice, sellingPrice, discount, weight, dimensions, badge, isFeatured, specs, imageBase64, images } = body;

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const product = await prisma.product.create({
      data: {
        name, slug: productSlug, sku: sku || `SKU-${Date.now()}`, description,
        categoryId: categoryId || '', subcategoryId: subcategoryId || null, brandId: brandId || null,
        basePrice: basePrice || 0, sellingPrice: sellingPrice || 0, discount: discount || 0,
        weight: weight || null, dimensions: dimensions || null, badge,
        isFeatured: isFeatured || false, isActive: true, publishedAt: new Date(),
        specs: specs ? { create: specs.map((spec: any, i: number) => ({ key: spec.key || `Spec ${i + 1}`, value: spec.value || spec, sortOrder: i })) } : undefined,
      },
      include: { category: true, brand: true },
    });

    const allImages: string[] = [];
    if (imageBase64) allImages.push(imageBase64);
    if (images && Array.isArray(images)) images.forEach((img: string) => { if (img && !allImages.includes(img)) allImages.push(img); });
    if (allImages.length > 0) {
      await prisma.productImage.createMany({
        data: allImages.filter(Boolean).map((url, i) => ({ productId: product.id, url, alt: `${name} - foto ${i + 1}`, sortOrder: i, isPrimary: i === 0 })),
      });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat produk' }, { status: 500 });
  }
});

// PUT update product - PROTECTED
export const PUT = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, imageBase64, images, specs, ...rawUpdates } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    if (specs && Array.isArray(specs)) {
      await prisma.productSpec.deleteMany({ where: { productId: id } });
      for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        const key = typeof spec === 'string' ? spec.split(':')[0]?.trim() : spec.key;
        const value = typeof spec === 'string' ? spec.split(':').slice(1).join(':').trim() : spec.value;
        if (key) await prisma.productSpec.create({ data: { productId: id, key, value: value || '', sortOrder: i } });
      }
    }

    const validFields = ['name', 'slug', 'sku', 'description', 'shortDesc', 'categoryId', 'subcategoryId', 'brandId', 'modelId', 'basePrice', 'sellingPrice', 'minPrice', 'discount', 'weight', 'dimensions', 'metaTitle', 'metaDesc', 'ogImage', 'isActive', 'isFeatured', 'badge', 'sortOrder', 'avgRating', 'reviewCount', 'soldCount', 'viewCount'];
    const updates: Record<string, any> = {};
    for (const key of validFields) { if (rawUpdates[key] !== undefined) updates[key] = rawUpdates[key]; }
    if (rawUpdates.price !== undefined && !updates.sellingPrice) updates.sellingPrice = rawUpdates.price;
    if (rawUpdates.originalPrice !== undefined && !updates.basePrice) updates.basePrice = rawUpdates.originalPrice;
    if (rawUpdates.status !== undefined) updates.isActive = rawUpdates.status !== 'SOLD_OUT' && rawUpdates.status !== 'RESERVED';

    const product = await prisma.product.update({ where: { id }, data: updates, include: { category: true, brand: true } });

    if (imageBase64 !== undefined || (images && Array.isArray(images))) {
      const allImages: string[] = [];
      if (imageBase64) allImages.push(imageBase64);
      if (images && Array.isArray(images)) images.forEach((img: string) => { if (img && !allImages.includes(img)) allImages.push(img); });
      if (allImages.length > 0) {
        await prisma.$transaction([
          prisma.productImage.deleteMany({ where: { productId: id } }),
          ...allImages.filter(Boolean).map((url, i) => prisma.productImage.create({ data: { productId: id, url, alt: `${product.name} - foto ${i + 1}`, sortOrder: i, isPrimary: i === 0 } })),
        ]);
      } else {
        await prisma.productImage.deleteMany({ where: { productId: id } });
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Gagal update produk' }, { status: 500 });
  }
});

// DELETE product - PROTECTED
export const DELETE = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal hapus produk' }, { status: 500 });
  }
});
