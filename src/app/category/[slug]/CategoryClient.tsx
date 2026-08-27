"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";

const categoryIcons: Record<string, React.ReactNode> = {
  "laptop-notebook": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  ),
  "smartphone-tablet": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  "monitor-tv": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  "networking-it": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  "peripheral-aksesoris": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  ),
};

const categoryNames: Record<string, string> = {
  "laptop-notebook": "Laptop & Notebook",
  "smartphone-tablet": "Smartphone & Tablet",
  "monitor-tv": "Monitor & TV",
  "networking-it": "Networking & IT",
  "peripheral-aksesoris": "Peripheral & Aksesoris",
};

export default function CategoryClient({ slug }: { slug: string }) {
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProductsAPI({ category: slug, limit: 50 })
      .then((res) => { if (res?.data) setAllProducts(res.data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [slug]);

  const categoryName = categoryNames[slug] || slug;
  const categoryIcon = categoryIcons[slug];

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
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              {categoryIcon}
              {categoryName}
            </h1>
            <p className="text-white/70 text-lg">
              {allProducts.length} produk elektronik bekas berkualitas tersedia
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-400">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
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
