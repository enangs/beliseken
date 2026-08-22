import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    const validationResults = [];

    for (const item of items) {
      const { productId, quantity } = item;

      // Check product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          units: {
            where: { status: 'AVAILABLE' },
          },
        },
      });

      if (!product) {
        validationResults.push({
          productId,
          valid: false,
          error: 'Produk tidak ditemukan',
        });
        continue;
      }

      // Check available units
      const availableUnits = product.units.length;
      
      if (availableUnits < quantity) {
        validationResults.push({
          productId,
          valid: false,
          error: `Stok tidak cukup. Tersedia: ${availableUnits} unit`,
          availableUnits,
          requestedQuantity: quantity,
        });
        continue;
      }

      // Check price changes
      const currentPrice = product.sellingPrice;

      validationResults.push({
        productId,
        valid: true,
        productName: product.name,
        price: currentPrice,
        availableUnits,
      });
    }

    const allValid = validationResults.every((r) => r.valid);

    return NextResponse.json({
      success: true,
      data: {
        valid: allValid,
        items: validationResults,
      },
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate cart' },
      { status: 500 }
    );
  }
}
