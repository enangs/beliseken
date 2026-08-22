export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                units: { some: { status: 'AVAILABLE' } },
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const transformedCategories = categories.map((cat) => ({
      ...cat,
      itemCount: cat._count.products,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedCategories,
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
