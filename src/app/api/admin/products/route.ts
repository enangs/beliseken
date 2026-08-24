export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('q');
    const status = searchParams.get('status'); // active, inactive, all

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

    return NextResponse.json({
      success: true,
      data: products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
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
    } = body;

    // Generate slug if not provided
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
        weight,
        dimensions,
        badge,
        isFeatured: isFeatured || false,
        isActive: true,
        publishedAt: new Date(),
        specs: specs ? {
          create: specs.map((spec: any, index: number) => ({
            key: spec.key,
            value: spec.value,
            sortOrder: index,
          })),
        } : undefined,
      },
      include: {
        category: true,
        brand: true,
        specs: true,
      },
    });

    // Save images to product_images table
    const allImages: string[] = [];
    if (imageBase64) allImages.push(imageBase64);
    if (images && Array.isArray(images)) allImages.push(...images);
    
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

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, imageBase64, images, specs, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: updates,
      include: {
        category: true,
        brand: true,
      },
    });

    // Update images if provided
    if (imageBase64 !== undefined || (images && Array.isArray(images))) {
      // Delete existing images
      await prisma.productImage.deleteMany({ where: { productId: id } });
      
      const allImages: string[] = [];
      if (imageBase64) allImages.push(imageBase64);
      if (images) allImages.push(...images);
      
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

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Soft delete - just deactivate
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deactivated',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
