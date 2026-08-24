export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all customers (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');

    // Use raw SQL to bypass Prisma schema validation
    let customersQuery = `
      SELECT id, name, email, phone, city, "role", "createdAt"
      FROM users WHERE "role" = 'CUSTOMER'
    `;
    if (search) {
      customersQuery += ` AND (name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR phone LIKE '%${search}%')`;
    }
    customersQuery += ` ORDER BY "createdAt" DESC`;
    const customers = await prisma.$queryRawUnsafe(customersQuery) as any[];
    
    // Get addresses for each customer
    const customerIds = customers.map((c: any) => c.id);
    let allAddresses: any[] = [];
    if (customerIds.length > 0) {
      allAddresses = await prisma.$queryRaw`
        SELECT id, "userId", label, name, phone, address, city, "cityId", province, "provinceId", postcode, "isDefault"
        FROM user_addresses WHERE "userId" IN (${customerIds.join(',')})
      ` as any[];
    }
    
    // Attach addresses
    const customersWithAddresses = customers.map((c: any) => ({
      ...c,
      createdAt: c.createdAt?.toISOString?.() || String(c.createdAt),
      addresses: allAddresses.filter((a: any) => a.userId === c.id).map((a: any) => ({
        id: a.id, label: a.label, name: a.name, phone: a.phone,
        address: a.address, city: a.city, cityId: a.cityId,
        province: a.province, provinceId: a.provinceId,
        postcode: a.postcode, isDefault: a.isDefault,
      })),
    }));

    // Calculate stats
    const totalCustomers = customersWithAddresses.length;
    const withAddresses = customersWithAddresses.filter((c: any) => c.addresses.length > 0).length;
    const now = new Date();
    const newThisMonth = customersWithAddresses.filter((c: any) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return NextResponse.json({
      success: true,
      data: customersWithAddresses,
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
