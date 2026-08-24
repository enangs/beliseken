"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyProductCard from "@/components/LazyProductCard";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortRef = useRef<AbortController>();

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setAllProducts([]);
        return;
      }

      // Abort previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      abortRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const res = await fetchProductsAPI({ 
          search: searchQuery, 
          limit: 30,
        });
        if (res?.data) {
          setAllProducts(res.data);
        }
      } catch (err) {
        if (err !== abortRef.current?.signal) {
          setError("Gagal memuat produk. Coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, debouncedSearch]);

  // Virtual scrolling for large lists
  const [visibleCount, setVisibleCount] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          setVisibleCount((prev) => Math.min(prev + 10, allProducts.length));
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [allProducts.length]);

  const visibleProducts = useMemo(() => {
    return allProducts.slice(0, visibleCount);
  }, [allProducts, visibleCount]);

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

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
              <span className="ml-3 text-brand-muted">Mencari produk...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <p className="text-brand-muted mb-8">
            {allProducts.length} produk ditemukan
          </p>

          {visibleProducts.length > 0 ? (
            <div 
              ref={containerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-h-[80vh] overflow-y-auto"
            >
              {visibleProducts.map((product) => (
                <LazyProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !loading && query ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Tidak Ada Hasil</h3>
              <p className="text-brand-muted">Coba kata kunci lain atau jelajahi katalog kami.</p>
            </div>
          ) : null}

          {/* Load more indicator */}
          {visibleCount < allProducts.length && (
            <div className="text-center py-4">
              <button
                onClick={() => setVisibleCount((prev) => Math.min(prev + 10, allProducts.length))}
                className="px-6 py-2 bg-brand-gray hover:bg-gray-200 text-brand-navy font-medium text-sm rounded-xl transition-colors"
              >
                Muat Lebih Banyak
              </button>
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
