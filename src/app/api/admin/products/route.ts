export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const id = searchParams.get('id');
    const search = searchParams.get('q');
    const status = searchParams.get('status');

    // GET single product by ID
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
          specs: { orderBy: { sortOrder: 'asc' } },
          units: { where: { status: 'AVAILABLE' } },
          _count: {
            select: { units: true, orderItems: true },
          },
        },
      });

      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: product });
    }

    // GET all products
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              units: true,
              orderItems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform to include imageBase64 for compatibility
    const transformed = products.map((p: any) => ({
      ...p,
      imageBase64: p.images?.[0]?.url || null,
      images: undefined, // Don't send all images in list view
    }));

    return NextResponse.json({
      success: true,
      data: transformed,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, slug, sku, description, categoryId, subcategoryId,
      brandId, basePrice, sellingPrice, discount, weight, dimensions,
      badge, isFeatured, specs, imageBase64, images,
      stock, supplier, condition, status,
    } = body;

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        sku: sku || `SKU-${Date.now()}`,
        description,
        categoryId: categoryId || '',
        subcategoryId: subcategoryId || null,
        brandId: brandId || null,
        basePrice: basePrice || 0,
        sellingPrice: sellingPrice || 0,
        discount: discount || 0,
        weight: weight || null,
        dimensions: dimensions || null,
        badge,
        isFeatured: isFeatured || false,
        isActive: status !== 'SOLD_OUT',
        publishedAt: new Date(),
        specs: specs ? {
          create: specs.map((spec: any, index: number) => ({
            key: spec.key || `Spec ${index + 1}`,
            value: spec.value || spec,
            sortOrder: index,
          })),
        } : undefined,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    // Save images
    const allImages: string[] = [];
    if (imageBase64) allImages.push(imageBase64);
    if (images && Array.isArray(images)) {
      images.forEach((img: string) => {
        if (img && !allImages.includes(img)) allImages.push(img);
      });
    }
    
    for (let i = 0; i < allImages.length; i++) {
      if (allImages[i]) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: allImages[i],
            alt: `${name} - foto ${i + 1}`,
            sortOrder: i,
            isPrimary: i === 0,
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, imageBase64, images, specs, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    // Handle specs: delete old and create new if provided
    if (specs && Array.isArray(specs)) {
      await prisma.productSpec.deleteMany({ where: { productId: id } });
      for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        const key = typeof spec === 'string' ? spec.split(':')[0]?.trim() : spec.key;
        const value = typeof spec === 'string' ? spec.split(':').slice(1).join(':').trim() : spec.value;
        if (key) {
          await prisma.productSpec.create({
            data: {
              productId: id,
              key,
              value: value || '',
              sortOrder: i,
            },
          });
        }
      }
      delete updates.specs;
    }

    // Update product fields
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updates,
        sellingPrice: updates.sellingPrice || updates.price,
        isActive: updates.status !== 'SOLD_OUT',
      },
      include: {
        category: true,
        brand: true,
      },
    });

    // Update images if provided
    if (imageBase64 !== undefined || (images && Array.isArray(images))) {
      // Delete existing images
      await prisma.productImage.deleteMany({ where: { productId: id } });
      
      // Build image list - deduplicated
      const allImages: string[] = [];
      if (imageBase64) allImages.push(imageBase64);
      if (images && Array.isArray(images)) {
        images.forEach((img: string) => {
          if (img && !allImages.includes(img)) allImages.push(img);
        });
      }
      
      for (let i = 0; i < allImages.length; i++) {
        if (allImages[i]) {
          await prisma.productImage.create({
            data: {
              productId: id,
              url: allImages[i],
              alt: `${product.name} - foto ${i + 1}`,
              sortOrder: i,
              isPrimary: i === 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
