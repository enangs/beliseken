export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET user addresses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST save address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, label, name, phone, address, city, cityId, province, provinceId, postcode, isDefault } = body;

    if (!userId || !name || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If set as default, unset others
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        label: label || 'Rumah',
        name,
        phone,
        address,
        city: city || '',
        cityId: cityId || '',
        province: province || '',
        provinceId: provinceId || '',
        postcode: postcode || '',
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    console.error('Save address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save address' },
      { status: 500 }
    );
  }
}

// PUT update address
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID required' },
        { status: 400 }
      );
    }

    // If set as default, unset others
    if (updates.isDefault && userId) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, data: updatedAddress });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Address ID required' },
        { status: 400 }
      );
    }

    await prisma.userAddress.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
