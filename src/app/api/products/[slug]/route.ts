export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function optimizeImageUrl(url: string | null): string {
  if (!url || !url.includes('cloudinary.com')) return url || '';
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/q_auto,f_auto,w_1200/${parts[1]}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        subcategory: true,
        brand: true,
        model: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        specs: {
          orderBy: { sortOrder: 'asc' },
        },
        units: {
          where: { status: 'AVAILABLE' },
          include: {
            conditionGrade: true,
          },
          orderBy: { conditionScore: 'desc' },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            units: { where: { status: 'AVAILABLE' } },
            reviews: { where: { isApproved: true } },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    // Transform response
    // Optimize all image URLs
    const optimizedImages = product.images.map((img: any) => ({
      ...img,
      url: optimizeImageUrl(img.url),
    }));

    // Build image URL arrays for frontend
    const allImageUrls = optimizedImages.map((img: any) => img.url).filter(Boolean);

    const transformedProduct = {
      ...product,
      imageBase64: allImageUrls[0] || null,
      images: allImageUrls,
      allImages: allImageUrls,
      availableUnits: product._count.units,
      totalReviews: product._count.reviews,
      units: product.units.map((unit: any) => ({
        id: unit.id,
        unitSku: unit.unitSku,
        conditionGrade: unit.conditionGrade,
        conditionScore: unit.conditionScore,
        conditionNotes: unit.conditionNotes,
        batteryHealth: unit.batteryHealth,
        sellingPrice: unit.sellingPrice,
        mainPhoto: unit.mainPhoto,
      })),
      _count: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
