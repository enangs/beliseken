export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all customers (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');

    const where: any = {
      role: 'CUSTOMER',
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      include: {
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend format
    const transformedCustomers = customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      createdAt: customer.createdAt.toISOString(),
      addresses: customer.addresses?.map((addr: any) => ({
        id: addr.id,
        label: addr.label,
        name: addr.name,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        cityId: addr.cityId,
        province: addr.province,
        provinceId: addr.provinceId,
        postcode: addr.postcode,
        isDefault: addr.isDefault,
      })) || [],
    }));

    // Calculate stats
    const totalCustomers = transformedCustomers.length;
    const withAddresses = transformedCustomers.filter((c: any) => c.addresses.length > 0).length;
    const now = new Date();
    const newThisMonth = transformedCustomers.filter((c: any) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return NextResponse.json({
      success: true,
      data: transformedCustomers,
      meta: {
        page: 1,
        limit: 100,
        total: totalCustomers,
        totalPages: 1,
      },
      stats: {
        totalCustomers,
        withAddresses,
        newThisMonth,
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
