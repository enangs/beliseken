"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchBlogPosts } from "@/lib/blog-api";
import type { BlogPost } from "@/data/products";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        // Fallback to empty
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-brand-navy py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3">Blog & Artikel</h1>
            <p className="text-white/70 text-lg">Tips, panduan, dan review untuk keputusan belanja yang lebih cerdas</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
              <p className="text-brand-muted">Memuat artikel...</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {posts.filter(p => p.featured).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-brand-border overflow-hidden mb-10 hover:shadow-xl transition-all">
                  <div className="aspect-[21/9] bg-gradient-to-br from-brand/10 to-brand-dark/10 relative overflow-hidden">
                    {post.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.imageBase64} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : null}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-lg z-10">Featured</span>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-md">{post.category}</span>
                      <span className="text-xs text-brand-muted">{post.date} · {post.readTime}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-navy group-hover:text-brand transition-colors mb-3">{post.title}</h2>
                    <p className="text-brand-muted leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              ))}

              {/* All Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.filter(p => !p.featured).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-[16/9] bg-gradient-to-br from-brand/5 to-brand-dark/5 relative overflow-hidden">
                      {post.imageBase64 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.imageBase64} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">{post.category}</span>
                        <span className="text-xs text-brand-muted">{post.date}</span>
                      </div>
                      <h3 className="font-bold text-brand-navy group-hover:text-brand transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-brand-muted mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {posts.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Artikel</h3>
                  <p className="text-brand-muted">Artikel akan segera hadir.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
