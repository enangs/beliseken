"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyProductCard from "@/components/LazyProductCard";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";

const popularSearches = [
  "Laptop", "iPhone", "Samsung", "iPad", "MacBook", "Monitor",
  "Router", "ThinkPad", "ASUS", "Headphone",
];

const popularCategories = [
  { name: "Laptop & Notebook", href: "/category/laptop-notebook", icon: "💻" },
  { name: "Smartphone & Tablet", href: "/category/smartphone-tablet", icon: "📱" },
  { name: "Networking & IT", href: "/category/networking-it", icon: "🌐" },
];

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortRef = useRef<AbortController>();

  // Focus input on mount
  useEffect(() => {
    if (!query && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        } else {
          setAllProducts([]);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Search error:', err);
          setError("Gagal memuat produk. Coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, debouncedSearch]);

  // Virtual scrolling
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchInput(term);
  };

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen bg-white">
        {/* Compact search header */}
        <div className="sticky top-0 z-30 bg-white border-b border-brand-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari laptop, iPhone, monitor..."
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-brand-border rounded-xl text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 focus:bg-white"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => { setSearchInput(""); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-navy"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
              >
                Cari
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Query results header */}
          {query && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-brand-navy">
                  Hasil: &ldquo;{query}&rdquo;
                </h1>
                <p className="text-sm text-brand-muted">
                  {loading ? "Mencari..." : `${allProducts.length} produk ditemukan`}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
              <span className="ml-3 text-brand-muted text-sm">Mencari produk...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {/* Results grid */}
          {query && visibleProducts.length > 0 && !loading && (
            <div 
              ref={containerRef}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {visibleProducts.map((product) => (
                <LazyProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty state with suggestions */}
          {!loading && !query && (
            <div className="py-6">
              {/* Popular searches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-brand" />
                  <h2 className="text-base font-bold text-brand-navy">Pencarian Populer</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-4 py-2 bg-brand-gray hover:bg-brand/10 text-brand-navy text-sm font-medium rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-base font-bold text-brand-navy mb-3">Kategori</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {popularCategories.map((cat) => (
                    <a
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 p-4 bg-white border border-brand-border rounded-xl hover:border-brand/50 hover:shadow-sm transition-all"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-brand-navy text-sm">{cat.name}</p>
                        <p className="text-xs text-brand-muted">Lihat semua</p>
                      </div>
                      <ArrowRight size={16} className="text-brand-muted" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query && allProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">Tidak Ada Hasil</h3>
              <p className="text-brand-muted text-sm mb-6">Coba kata kunci lain atau jelajahi katalog kami.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 6).map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-4 py-2 bg-brand-gray hover:bg-brand/10 text-brand-navy text-sm font-medium rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Load more */}
          {visibleCount < allProducts.length && !loading && (
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
