export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Optimize Cloudinary URLs — add auto format (WebP/AVIF) and quality
function optimizeImageUrl(url: string | null): string {
  if (!url || !url.includes('cloudinary.com')) return url || '';
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/q_auto,f_auto,w_800/${parts[1]}`;
}

// Strip emoji characters from text
function stripEmojis(text: string): string {
  if (!text) return '';
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u2600-\u27BF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2300-\u23FF]|[\u2B50\u2B55]|[\u3030\u303D]|[\u3297\u3299]/g, '').replace(/\uFE0F/g, '').replace(/\u200D/g, '').trim();
}

// Map title keywords to icon names for frontend rendering
function mapTitleToIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('laptop') || t.includes('notebook') || t.includes('macbook') || t.includes('thinkpad')) return 'laptop';
  if (t.includes('smartphone') || t.includes('phone') || t.includes('iphone') || t.includes('samsung')) return 'smartphone';
  if (t.includes('tablet') || t.includes('ipad')) return 'tablet';
  if (t.includes('network') || t.includes('wifi') || t.includes('router') || t.includes('tp-link') || t.includes('mikrotik')) return 'wifi';
  if (t.includes('monitor') || t.includes('display') || t.includes('led')) return 'monitor';
  if (t.includes('gaming') || t.includes('game')) return 'gamepad-2';
  if (t.includes('audio') || t.includes('speaker') || t.includes('headphone')) return 'headphones';
  if (t.includes('kamera') || t.includes('camera') || t.includes('cctv')) return 'camera';
  if (t.includes('jam') || t.includes('watch')) return 'watch';
  if (t.includes('komponen') || t.includes('component') || t.includes('pc')) return 'cpu';
  if (t.includes('elektronik') || t.includes('bekas') || t.includes('flash sale')) return 'globe';
  return 'globe';
}

// GET all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const transformed = banners.map((b: any) => ({
      id: b.id,
      title: stripEmojis(b.title),
      subtitle: stripEmojis(b.subtitle || ''),
      highlight: stripEmojis(b.description || ''),
      description: b.description || '',
      cta: b.ctaText || 'Lihat Sekarang',
      href: b.ctaLink || '/products',
      bg: b.gradient || 'from-brand to-brand-dark',
      imageBase64: optimizeImageUrl(b.imageUrl),
      active: b.isActive,
      type: b.type,
      icon: mapTitleToIcon(b.title),
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
          description: b.highlight || b.description || '',
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
