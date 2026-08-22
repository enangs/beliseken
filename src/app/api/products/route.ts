export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('q');
    const featured = searchParams.get('featured');
    const badge = searchParams.get('badge');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sort = searchParams.get('sort') || 'newest';
    let orderBy: any = { createdAt: 'desc' };
    
    switch (sort) {
      case 'price_asc':
        orderBy = { sellingPrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { sellingPrice: 'desc' };
        break;
      case 'popular':
        orderBy = { soldCount: 'desc' };
        break;
      case 'rating':
        orderBy = { avgRating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (condition) {
      where.units = {
        some: {
          conditionGrade: { code: { in: condition.split(',') } },
          status: 'AVAILABLE',
        },
      };
    }

    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.units = {
        some: { status: 'AVAILABLE' },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (badge) {
      where.badge = badge;
    }

    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          subcategory: true,
          brand: true,
          units: {
            where: { status: 'AVAILABLE' },
            select: { id: true, status: true },
          },
          _count: {
            select: { units: { where: { status: 'AVAILABLE' } } },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform response
    const transformedProducts = products.map((product) => ({
      ...product,
      availableUnits: product._count.units,
      units: undefined,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
