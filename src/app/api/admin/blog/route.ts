export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all blog posts (admin)
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
        : '',
      readTime: post.readTime || '5 menit',
      category: post.category || 'Umum',
      imageBase64: post.imageUrl || null,
      featured: post.isFeatured || false,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
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
    const { title, slug, excerpt, content, category, imageUrl, isFeatured, isPublished } = body;

    // Generate slug if not provided
    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Create using raw SQL
    const postId = `blog-${Date.now()}`;
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_posts (id, title, slug, excerpt, content, "imageUrl", category, "isFeatured", "isPublished", "readTime", "publishedAt", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), NOW())
    `,
      postId,
      title,
      postSlug,
      excerpt || '',
      content || '',
      imageUrl || null,
      category || 'Umum',
      isFeatured || false,
      isPublished !== false,
      `${Math.ceil((content?.length || 1000) / 1000)} menit`
    );

    return NextResponse.json({
      success: true,
      data: { id: postId, title, slug: postSlug },
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
    const { id, title, slug, excerpt, content, category, imageUrl, isFeatured, isPublished } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog post ID required' }, { status: 400 });
    }

    // Update using raw SQL
    await prisma.$executeRawUnsafe(`
      UPDATE blog_posts SET
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        excerpt = COALESCE($4, excerpt),
        content = COALESCE($5, content),
        "imageUrl" = $6,
        category = COALESCE($7, category),
        "isFeatured" = COALESCE($8, "isFeatured"),
        "isPublished" = COALESCE($9, "isPublished"),
        "readTime" = $10,
        "updatedAt" = NOW()
      WHERE id = $1
    `,
      id,
      title,
      slug,
      excerpt,
      content,
      imageUrl || null,
      category,
      isFeatured,
      isPublished,
      `${Math.ceil((content?.length || 1000) / 1000)} menit`
    );

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

    await prisma.$executeRawUnsafe('DELETE FROM blog_posts WHERE id = $1', id);

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Admin blog DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
