import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('q');

    const where: any = {
      role: 'CUSTOMER',
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { orders: true, addresses: true },
          },
          orders: {
            select: { total: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate stats
    const stats = await prisma.user.aggregate({
      where: { role: 'CUSTOMER' },
      _count: true,
    });

    const customersWithAddresses = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        addresses: { some: { isActive: true } },
      },
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: thisMonth },
      },
    });

    return NextResponse.json({
      success: true,
      data: customers,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        totalCustomers: stats._count,
        withAddresses: customersWithAddresses,
        newThisMonth,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
