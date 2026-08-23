"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";

export default function CategoryClient({ slug }: { slug: string }) {
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProductsAPI({ category: slug, limit: 50 })
      .then((res) => { if (res?.data) setAllProducts(res.data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [slug]);

  const categoryNames: Record<string, string> = {
    "laptop-notebook": "💻 Laptop & Notebook",
    "smartphone-tablet": "📱 Smartphone & Tablet",
    "monitor-tv": "🖥️ Monitor & TV",
    "networking-it": "🌐 Networking & IT",
    "peripheral-aksesoris": "⌨️ Peripheral & Aksesoris",
  };

  const categoryName = categoryNames[slug] || slug;

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
              <span className="text-white">{categoryName}</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-2">
              {categoryName}
            </h1>
            <p className="text-white/70 text-lg">
              {allProducts.length} produk elektronik bekas berkualitas tersedia
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {allProducts.map((product) => (
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
