"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/data/products";
import type { Product } from "@/data/products";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAllProducts(getProducts());
  }, []);

  const results = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase()) ||
          p.specs.some(s => s.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-brand-navy mb-4">
            Hasil Pencarian: &ldquo;{query}&rdquo;
          </h1>
          {/* Search refinement */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
              }
            }}
            className="flex items-center gap-2 mb-6"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari produk lain..."
              className="flex-1 max-w-md px-4 py-3 border border-brand-border rounded-xl text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button type="submit" className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl transition-colors">
              Cari
            </button>
          </form>
          <p className="text-brand-muted mb-8">{results.length} produk ditemukan</p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Tidak Ada Hasil</h3>
              <p className="text-brand-muted">Coba kata kunci lain atau jelajahi katalog kami.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
