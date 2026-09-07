"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";
import ProductCard from "./ProductCard";

type Tab = "terlaris" | "grade-a" | "baru";

export default function ProdukTerbaru() {
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("terlaris");

  useEffect(() => {
    fetchProductsAPI({ sort: "newest", limit: 50 })
      .then((res) => {
        if (res?.data) {
          const available = res.data.filter((p: ProductResponse) => p.stock > 0);
          const soldOut = res.data.filter((p: ProductResponse) => p.stock === 0);
          setAllProducts([...available, ...soldOut]);
        }
      })
      .catch(() => {});
  }, []);

  // Compute product lists for each tab
  const bestSellers = [...allProducts]
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);

  const gradeA = [...allProducts]
    .filter((p) => p.stock > 0 && (p.condition || "").toLowerCase().includes("grade a"))
    .slice(0, 8);

  const newest = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const displayProducts =
    activeTab === "terlaris"
      ? bestSellers
      : activeTab === "grade-a"
        ? gradeA
        : newest;

  const tabConfig: { key: Tab; label: string; icon: string; desc: string }[] = [
    { key: "terlaris", label: "Paling Laris", icon: "🔥", desc: "Produk terlaris yang paling banyak dibeli" },
    { key: "grade-a", label: "Grade A+", icon: "✨", desc: "Kondisi terbaik, seperti baru" },
    { key: "baru", label: "Baru Ditambahkan", icon: "🆕", desc: "Produk segar yang baru masuk" },
  ];

  const currentTab = tabConfig.find((t) => t.key === activeTab)!;

  if (allProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-brand text-white shadow-lg shadow-brand/25"
                  : "bg-gray-100 text-brand-navy hover:bg-gray-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentTab.icon}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
                {currentTab.label}
              </h2>
            </div>
            <p className="text-brand-muted text-base">{currentTab.desc}</p>
          </div>
          <Link
            href="/products"
            className="text-brand font-semibold hover:text-brand-dark transition-colors mt-3 sm:mt-0 text-sm"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Product Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-brand-muted">
            <p className="text-lg">Belum ada produk di kategori ini</p>
          </div>
        )}
      </div>
    </section>
  );
}
