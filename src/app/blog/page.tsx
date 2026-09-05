"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Shield, Monitor, Smartphone, Wrench, ShoppingBag, FileText, HelpCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

// Small card component
function BlogCard({ post, size = "normal" }: { post: BlogPost; size?: "small" | "normal" }) {
  const CategoryIcon = getCategoryIcon(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-all flex flex-col">
      <div className={`relative overflow-hidden ${size === "small" ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <div className="w-full h-full bg-gradient-to-br from-brand/5 to-brand-dark/5 flex items-center justify-center">
          {post.imageBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageBase64} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <CategoryIcon size={size === "small" ? 28 : 36} className="text-brand/15" />
          )}
        </div>
        {post.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand text-white text-[10px] font-bold rounded-md z-10">Baru</span>
        )}
      </div>
      <div className={`flex-1 flex flex-col ${size === "small" ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
            <CategoryIcon size={10} />{post.category}
          </span>
          <span className="text-[10px] text-brand-muted">{post.date}</span>
        </div>
        <h3 className={`font-bold text-brand-navy group-hover:text-brand transition-colors line-clamp-2 ${size === "small" ? "text-sm" : "text-base"}`}>
          {post.title}
        </h3>
        {size === "normal" && (
          <p className="text-xs text-brand-muted mt-1.5 line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

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
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Split posts: featured first, then recent, then older
  const featuredPosts = posts.filter(p => p.featured);
  const nonFeatured = posts.filter(p => !p.featured);
  const latestFeatured = featuredPosts[0]; // 1 big card
  const rowPosts = featuredPosts.slice(1).concat(nonFeatured).slice(0, 3); // 3 cards in row
  const morePosts = featuredPosts.slice(1).concat(nonFeatured).slice(3); // remaining

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-brand-navy py-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Blog & Artikel</h1>
            <p className="text-white/70 text-sm md:text-base">Tips, panduan, dan review untuk keputusan belanja yang lebih cerdas</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand mx-auto mb-4"></div>
              <p className="text-brand-muted text-sm">Memuat artikel...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto text-brand/20 mb-4" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Belum Ada Artikel</h3>
              <p className="text-brand-muted text-sm">Artikel akan segera hadir.</p>
            </div>
          ) : (
            <>
              {/* 1 BIG Featured Card */}
              {latestFeatured && (
                <Link href={`/blog/${latestFeatured.slug}`} className="group block bg-white rounded-2xl border border-brand-border overflow-hidden mb-6 hover:shadow-xl transition-all">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-[16/10] md:aspect-auto bg-gradient-to-br from-brand/10 to-brand-dark/10 relative overflow-hidden">
                      {latestFeatured.imageBase64 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={latestFeatured.imageBase64} alt={latestFeatured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center min-h-[200px]">
                          {(() => { const Icon = getCategoryIcon(latestFeatured.category); return <Icon size={48} className="text-brand/20" />; })()}
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-brand text-white text-xs font-bold rounded-lg z-10">✨ Artikel Terbaru</span>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        {(() => { const Icon = getCategoryIcon(latestFeatured.category); return <span className="flex items-center gap-1.5 text-xs font-semibold text-brand bg-brand/10 px-2.5 py-1 rounded-md"><Icon size={12} />{latestFeatured.category}</span>; })()}
                        <span className="text-xs text-brand-muted">{latestFeatured.readTime}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-brand-navy group-hover:text-brand transition-colors mb-3">{latestFeatured.title}</h2>
                      <p className="text-sm text-brand-muted leading-relaxed mb-4 line-clamp-3">{latestFeatured.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
                        Baca Selengkapnya <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* 3 Cards in a Row */}
              {rowPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {rowPosts.map((post) => (
                    <BlogCard key={post.id} post={post} size="normal" />
                  ))}
                </div>
              )}

              {/* Section Title: Artikel Lainnya */}
              {morePosts.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4 mt-8">
                    <h2 className="text-lg font-bold text-brand-navy">Artikel Lainnya</h2>
                    <div className="flex-1 h-px bg-brand-border"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {morePosts.map((post) => (
                      <BlogCard key={post.id} post={post} size="small" />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
