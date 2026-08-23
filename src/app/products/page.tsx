"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts as fetchProductsAPI, getCategories, type ProductResponse, type CategoryResponse } from "@/lib/api";

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Harga Terendah" },
  { value: "price-high", label: "Harga Tertinggi" },
  { value: "popular", label: "Terpopuler" },
  { value: "rating", label: "Rating Tertinggi" },
];

const conditionOptions = ["Semua", "Like New", "Grade A", "Grade B+", "Grade B"];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedCondition, setSelectedCondition] = useState("Semua");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProductsAPI({ limit: 50 })
      .then((res) => setAllProducts(res.data))
      .catch(() => {});
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const filteredProducts = allProducts
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.brand?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "semua" || (p.category?.name || '').toLowerCase().includes(selectedCategory);
      const matchesCondition = selectedCondition === "Semua" || (p.units?.[0]?.conditionGrade?.name || 'Grade A') === selectedCondition;
      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "price-low": return a.sellingPrice - b.sellingPrice;
        case "price-high": return b.sellingPrice - a.sellingPrice;
        case "popular": return b.soldCount - a.soldCount;
        case "rating": return b.avgRating - a.avgRating;
        default: return 0;
      }
    });

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-brand-gray py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-brand-navy mb-2">Semua Produk</h1>
            <p className="text-brand-muted">
              Menampilkan {filteredProducts.length} produk elektronik bekas berkualitas
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
              <div className="bg-white rounded-xl border border-brand-border p-5 sticky top-24">
                <h3 className="font-bold text-brand-navy mb-4">Filter</h3>

                {/* Search */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-brand-navy mb-2 block">Cari Produk</label>
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <Search size={16} className="ml-3 text-brand-muted" />
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-brand-navy mb-2 block">Kategori</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("semua")}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === "semua"
                          ? "bg-brand/10 text-brand font-semibold"
                          : "text-brand-muted hover:bg-gray-100"
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedCategory === cat.name.toLowerCase()
                            ? "bg-brand/10 text-brand font-semibold"
                            : "text-brand-muted hover:bg-gray-100"
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-brand-navy mb-2 block">Kondisi</label>
                  <div className="space-y-2">
                    {conditionOptions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedCondition === cond
                            ? "bg-brand/10 text-brand font-semibold"
                            : "text-brand-muted hover:bg-gray-100"
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Info */}
                <div className="p-3 bg-brand/5 rounded-lg">
                  <p className="text-xs text-brand-muted">Harga</p>
                  <p className="text-sm font-semibold text-brand">
                    Mulai dari {allProducts.length > 0 ? `Rp ${Math.min(...allProducts.map((p) => p.sellingPrice)).toLocaleString("id-ID")}` : "Rp 0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-brand-border rounded-lg text-sm font-semibold"
                  >
                    <SlidersHorizontal size={16} />
                    Filter
                  </button>
                  <span className="text-sm text-brand-muted">
                    {filteredProducts.length} produk ditemukan
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="appearance-none bg-white border border-brand-border rounded-lg px-4 py-2 pr-8 text-sm font-semibold text-brand-navy outline-none cursor-pointer"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted" />
                  </div>

                  {/* View Mode */}
                  <div className="hidden sm:flex items-center border border-brand-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-brand text-white" : "text-brand-muted"}`}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-brand text-white" : "text-brand-muted"}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">Produk Tidak Ditemukan</h3>
                  <p className="text-brand-muted">Coba ubah filter atau kata kunci pencarian Anda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
