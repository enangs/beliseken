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

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  const latestPost = posts[0];
  const gridPosts = posts.slice(1, 5);
  const LatestIcon = getCategoryIcon(latestPost.category);

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

        {/* 1 Featured Blog Terbaru — horizontal card */}
        <Link href={`/blog/${latestPost.slug}`} className="group block bg-white rounded-2xl border border-brand-border overflow-hidden mb-5 hover:shadow-xl transition-all">
          <div className="grid md:grid-cols-[280px_1fr]">
            {/* Image */}
            <div className="aspect-[16/10] md:aspect-auto md:h-[180px] bg-gradient-to-br from-brand/10 to-brand-dark/10 relative overflow-hidden">
              {latestPost.imageBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={latestPost.imageBase64} alt={latestPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <LatestIcon size={40} className="text-brand/20" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-3 py-1 bg-brand text-white text-xs font-bold rounded-lg z-10">✨ Blog Terbaru</span>
            </div>
            {/* Content */}
            <div className="p-5 md:p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                  <LatestIcon size={10} />{latestPost.category}
                </span>
                <span className="text-[10px] text-brand-muted">{latestPost.readTime}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-brand-navy group-hover:text-brand transition-colors mb-2 line-clamp-2">{latestPost.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed mb-3 line-clamp-2">{latestPost.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
                Baca Selengkapnya <ChevronRight size={16} />
              </span>
            </div>
          </div>
        </Link>

        {/* 4 Cards Grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {gridPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-all flex flex-col">
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
            })}
          </div>
        )}
      </div>
    </section>
  );
}
