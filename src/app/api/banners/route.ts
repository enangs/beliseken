export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Optimize Cloudinary URLs — add auto format (WebP/AVIF) and quality
function optimizeImageUrl(url: string | null): string {
  if (!url || !url.includes('cloudinary.com')) return url || '';
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/q_auto,f_auto,w_1200/${parts[1]}`;
}

// GET all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const transformed = banners.map((b: any) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || '',
      highlight: b.description || '',
      description: b.description || '',
      cta: b.ctaText || 'Lihat Sekarang',
      href: b.ctaLink || '/products',
      bg: b.gradient || 'from-brand to-brand-dark',
      imageBase64: optimizeImageUrl(b.imageUrl),
      active: b.isActive,
      type: b.type,
    }));

    const response = NextResponse.json({ success: true, data: transformed });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    return response;
  } catch (error) {
    console.error('Banners API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST save all banners (replace all)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { banners } = body;

    if (!banners || !Array.isArray(banners)) {
      return NextResponse.json({ success: false, error: 'Banners array required' }, { status: 400 });
    }

    // Delete all existing banners
    await prisma.banner.deleteMany();

    // Insert new banners
    for (let i = 0; i < banners.length; i++) {
      const b = banners[i];
      await prisma.banner.create({
        data: {
          type: b.type || 'HERO',
          title: b.title,
          subtitle: b.subtitle || '',
          description: b.description || '',
          imageUrl: b.imageBase64 || null,
          gradient: b.bg || 'from-brand to-brand-dark',
          ctaText: b.cta || 'Lihat Sekarang',
          ctaLink: b.href || '/products',
          isActive: b.active !== false,
          sortOrder: i,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Banners saved' });
  } catch (error) {
    console.error('Save banners error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save banners' }, { status: 500 });
  }
}
