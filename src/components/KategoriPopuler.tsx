"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, type CategoryResponse } from "@/lib/api";

// Category icons mapping (SVG-based for clean look)
const categoryIcons: Record<string, string> = {
  "Laptop & Notebook": "💻",
  "Smartphone & Tablet": "📱",
  "Monitor & TV": "🖥️",
  "Networking & IT": "🌐",
  "Peripheral & Aksesoris": "⌨️",
};

// Badge configuration for each category
const categoryBadges: Record<string, { label: string; color: string }> = {
  "Laptop & Notebook": { label: "Promo", color: "bg-red-500" },
  "Smartphone & Tablet": { label: "Hot", color: "bg-orange-500" },
  "Monitor & TV": { label: "New", color: "bg-green-500" },
  "Networking & IT": { label: "Best", color: "bg-blue-500" },
  "Peripheral & Aksesoris": { label: "Sale", color: "bg-purple-500" },
};

export default function KategoriPopuler() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-8 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Kategori</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Category Grid - Jamtangan.com Style */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {categories.length === 0 ? (
            // Skeleton placeholder
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </>
          ) : (
            categories.map((category) => {
              const icon = categoryIcons[category.name] || "📦";
              const badge = categoryBadges[category.name];

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center gap-3"
                >
                  {/* Icon Card */}
                  <div className="relative">
                    {/* Badge */}
                    {badge && (
                      <span
                        className={`absolute -top-2 -right-2 ${badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10`}
                      >
                        {badge.label}
                      </span>
                    )}

                    {/* Icon Container */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 group-hover:bg-brand/5 border-2 border-gray-100 group-hover:border-brand/30 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                        {icon}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold text-brand-navy group-hover:text-brand transition-colors leading-tight">
                      {category.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-brand-muted mt-0.5">
                      {category.itemCount} produk
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
