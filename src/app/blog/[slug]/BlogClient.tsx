"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPosts, storeInfo } from "@/data/products";
import type { BlogPost } from "@/data/products";

export default function BlogClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getBlogPosts();
    const found = all.find((p) => p.slug === slug);
    setPost(found);
    if (found) {
      setRelatedPosts(all.filter((p) => p.id !== found.id).slice(0, 3));
    }
    setLoaded(true);
  }, [slug]);

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">Artikel Tidak Ditemukan</h1>
            <p className="text-brand-muted mb-6">Artikel yang Anda cari tidak tersedia.</p>
            <Link href="/blog" className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
              Kembali ke Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-brand-navy py-12">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <ChevronRight size={14} />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight size={14} />
              <span className="text-white">{post.category}</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-brand/20 text-brand text-xs font-bold rounded-lg">{post.category}</span>
              <span className="text-white/50 text-sm flex items-center gap-1">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{storeInfo.name}</span>
              </div>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-12">
          {post.imageBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageBase64} alt={post.title} className="w-full rounded-2xl aspect-[21/9] object-cover mb-8" />
          ) : (
            <div className="bg-gradient-to-br from-brand/5 to-brand-dark/5 rounded-2xl aspect-[21/9] mb-8 flex items-center justify-center">
              <span className="text-6xl opacity-30">📖</span>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-brand-muted leading-relaxed mb-6">{post.excerpt}</p>

            {post.content ? (
              post.content.split("\n").filter(Boolean).map((para, i) => (
                <p key={i} className="text-brand-muted leading-relaxed mb-4">{para}</p>
              ))
            ) : (
              <>
                <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">Kenapa Beli Elektronik Bekas?</h2>
                <p className="text-brand-muted leading-relaxed mb-4">
                  Membeli elektronik bekas bukan berarti mengorbankan kualitas. Di BeliSeken.com, setiap produk melalui
                  proses inspeksi ketat sebelum dijual.
                </p>
              </>
            )}
          </div>

          <div className="mt-10 p-6 bg-brand/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-brand-navy">Tertarik dengan produk kami?</p>
              <p className="text-sm text-brand-muted">Lihat katalog lengkap atau hubungi kami via WhatsApp</p>
            </div>
            <div className="flex gap-3">
              <Link href="/products" className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors">
                Lihat Katalog
              </Link>
              <a href={storeInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl text-sm transition-colors">
                Chat WhatsApp
              </a>
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Artikel Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-white rounded-2xl border border-brand-border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[16/9] bg-gradient-to-br from-brand/5 to-brand-dark/5 relative overflow-hidden">
                    {rp.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rp.imageBase64} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md">{rp.category}</span>
                    <h3 className="font-bold text-brand-navy group-hover:text-brand transition-colors mt-2 line-clamp-2">{rp.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
