export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all blog posts (admin — includes unpublished)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    // Transform
    const transformedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: post.readTime || '5 menit',
      category: post.category || 'Umum',
      imageBase64: post.imageUrl || null,
      featured: post.isFeatured || false,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
    }));

    const response = NextResponse.json({
      success: true,
      data: transformedPosts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Admin blog GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, imageUrl, isFeatured, isPublished, readTime } = body;

    // Generate slug if not provided
    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: postSlug,
        excerpt: excerpt || '',
        content: content || '',
        imageUrl: imageUrl || null,
        category: category || 'Umum',
        isFeatured: isFeatured || false,
        isPublished: isPublished !== false,
        readTime: readTime || `${Math.ceil((content?.length || 1000) / 1000)} menit`,
        publishedAt: isPublished !== false ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: post.id, title: post.title, slug: post.slug },
    });
  } catch (error) {
    console.error('Admin blog POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, category, imageUrl, isFeatured, isPublished, readTime } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog post ID required' }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isPublished !== undefined && { isPublished }),
        ...(readTime !== undefined && { readTime }),
        // Set publishedAt when first publishing
        ...(isPublished === true && !existing.publishedAt && { publishedAt: new Date() }),
      },
    });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Admin blog PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog post ID required' }, { status: 400 });
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Admin blog DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
