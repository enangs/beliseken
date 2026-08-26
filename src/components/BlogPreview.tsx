"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { fetchBlogPosts } from "@/lib/blog-api";
import type { BlogPost } from "@/data/products";

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(() => {});
  }, []);

  const featuredPost = posts.find((p) => p.featured);
  const sidePosts = posts.filter((p) => !p.featured);

  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={24} className="text-brand" />
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                Tips & Artikel
              </h2>
            </div>
            <p className="text-brand-muted text-lg">
              Bantu kamu membuat keputusan belanja yang lebih cerdas
            </p>
          </div>
          <Link
            href="/blog"
            className="text-brand font-semibold hover:text-brand-dark transition-colors mt-4 sm:mt-0"
          >
            Semua Artikel →
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured Article */}
          {featuredPost && (
            <div className="lg:col-span-3">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-brand-border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-brand/10 to-brand-dark/10 relative overflow-hidden">
                  {featuredPost.imageBase64 ? (
                    <img src={featuredPost.imageBase64} alt={featuredPost.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><BookOpen size={48} className="text-brand/20" /></div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-lg">
                    Featured
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-md">
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {featuredPost.date} · {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand transition-colors leading-snug">
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-4 text-brand font-semibold text-sm group-hover:underline">
                    Baca Selengkapnya →
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Side Articles */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {sidePosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-border hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-brand/5 to-brand-dark/5 relative overflow-hidden">
                  {post.imageBase64 ? (
                    <img src={post.imageBase64} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-brand-muted"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-brand-navy text-base mb-2 group-hover:text-brand transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-brand-muted line-clamp-2 mt-auto">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
