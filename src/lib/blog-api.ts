// Blog API helper functions
// Fetches from Supabase via API routes

import type { BlogPost } from '@/data/products';

export async function fetchBlogPosts(params?: {
  q?: string;
  category?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');

    const res = await fetch(`/api/blog?${searchParams.toString()}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/api/blog?q=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data.find((p: BlogPost) => p.slug === slug) || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

// Admin blog API functions
export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/admin/blog', { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch admin blog posts:', error);
    return [];
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost | null> {
  try {
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        imageUrl: post.imageBase64 || post.image,
        isFeatured: post.featured,
        isPublished: true,
      }),
    });
    const data = await res.json();
    
    if (data.success) {
      return { ...post, id: data.data.id };
    }
    return null;
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return null;
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        imageUrl: post.imageBase64 || post.image,
        isFeatured: post.featured,
        isPublished: true,
      }),
    });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/blog?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return false;
  }
}
