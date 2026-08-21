"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, categories } from "@/data/products";
import type { Product } from "@/data/products";

export default function CategoryClient({ slug }: { slug: string }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAllProducts(getProducts());
    setLoaded(true);
  }, []);

  const category = categories.find((c) => c.slug === slug);

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

  if (!category) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">Kategori Tidak Ditemukan</h1>
            <p className="text-brand-muted mb-6">Kategori yang Anda cari tidak tersedia.</p>
            <Link href="/products" className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
              Lihat Semua Produk
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categoryProducts = allProducts.filter((p) =>
    p.category.toLowerCase().includes(category.name.toLowerCase().split(" & ")[0].toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-brand-navy py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <ChevronRight size={14} />
              <Link href="/products" className="hover:text-white">Produk</Link>
              <ChevronRight size={14} />
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-2">
              {category.icon} {category.name}
            </h1>
            <p className="text-white/70 text-lg">
              {categoryProducts.length} produk elektronik bekas berkualitas tersedia
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Produk</h3>
              <p className="text-brand-muted">Produk untuk kategori ini sedang dalam proses penambahan.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
