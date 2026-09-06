"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Shield, Monitor, Smartphone, Wrench, ShoppingBag, FileText, HelpCircle } from "lucide-react";
import { fetchBlogPosts } from "@/lib/blog-api";
import type { BlogPost } from "@/data/products";

const blogCategoryIcons: Record<string, any> = {
  "Tips & Panduan": BookOpen,
  "Tips & Trik": Wrench,
  "Networking": Monitor,
  "Review": Smartphone,
  "Informasi": Shield,
  "Panduan": FileText,
  "Jual Barang": ShoppingBag,
};

function getCategoryIcon(category: string) {
  return blogCategoryIcons[category] || HelpCircle;
}

// Reuse same BlogCard pattern as /blog page
function BlogCard({ post }: { post: BlogPost }) {
  const CategoryIcon = getCategoryIcon(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-all flex flex-col">
      <div className="aspect-[16/9] relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-brand/5 to-brand-dark/5 flex items-center justify-center">
          {post.imageBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageBase64} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <CategoryIcon size={28} className="text-brand/15" />
          )}
        </div>
        {post.featured && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-brand text-white text-[10px] font-bold rounded-md z-10">Baru</span>
        )}
      </div>
      <div className="flex-1 flex flex-col p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
            <CategoryIcon size={10} />{post.category}
          </span>
          <span className="text-[10px] text-brand-muted">{post.date}</span>
        </div>
        <h3 className="font-bold text-brand-navy text-sm group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  // Show 4 posts max in a clean 4-column grid (matching /blog style)
  const displayPosts = posts.slice(0, 4);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Tips & Artikel</h2>
            <p className="text-sm text-brand-muted mt-1">Bantu kamu membuat keputusan belanja yang lebih cerdas</p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1">
            Semua Artikel <ChevronRight size={16} />
          </Link>
        </div>

        {/* 4 Cards in a Clean Grid — same style as /blog page */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
