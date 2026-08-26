import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE all banners and recreate only the correct 3 PROMO_CARDs
export async function POST() {
  try {
    // Count before
    const count = await prisma.banner.count();

    // Delete ALL banners
    await prisma.banner.deleteMany();

    // Recreate the 3 correct PROMO_CARD banners
    const promos = [
      {
        type: 'PROMO_CARD',
        title: 'Laptop & Notebook',
        subtitle: 'Mulai 3.5 Juta',
        description: 'MacBook, ThinkPad, ASUS ROG & lainnya',
        imageUrl: 'https://res.cloudinary.com/ru7la0qb/image/upload/q_auto,f_auto,w_800/v1787562061/beliseken/promos/wgqrsjplpdnued0b5pae.jpg',
        gradient: 'from-blue-500 to-blue-600',
        ctaText: 'Lihat Sekarang',
        ctaLink: '/category/laptop-notebook',
        isActive: true,
        sortOrder: 0,
      },
      {
        type: 'PROMO_CARD',
        title: 'Networking & IT',
        subtitle: 'Mulai Rp150rb',
        description: 'MikroTik, TP-Link, Ubiquiti & lainnya',
        imageUrl: 'https://res.cloudinary.com/ru7la0qb/image/upload/q_auto,f_auto,w_800/v1787562133/beliseken/promos/jz2eboo4snpfevppxdi2.jpg',
        gradient: 'from-amber-500 to-orange-500',
        ctaText: 'Lihat Sekarang',
        ctaLink: '/category/networking-it',
        isActive: true,
        sortOrder: 1,
      },
      {
        type: 'PROMO_CARD',
        title: 'Smartphone & Tablet',
        subtitle: 'Mulai 1.2 Juta',
        description: 'iPhone, Samsung, iPad & lainnya',
        imageUrl: 'https://res.cloudinary.com/ru7la0qb/image/upload/q_auto,f_auto,w_800/v1787562091/beliseken/promos/dvus3oz6drhsgprdmjo6.jpg',
        gradient: 'from-emerald-500 to-emerald-600',
        ctaText: 'Lihat Sekarang',
        ctaLink: '/category/smartphone-tablet',
        isActive: true,
        sortOrder: 2,
      },
    ];

    for (const p of promos) {
      await prisma.banner.create({ data: p });
    }

    const afterCount = await prisma.banner.count();
    return NextResponse.json({
      success: true,
      message: `Cleaned: ${count} → ${afterCount} banners`,
      before: count,
      after: afterCount,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ success: false, error: 'Cleanup failed' }, { status: 500 });
  }
}
