"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, type CategoryResponse } from "@/lib/api";

export default function KategoriPopuler() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-6 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-semibold text-brand-navy whitespace-nowrap hidden sm:block">
            Kategori:
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-gray hover:bg-brand/10 border border-brand-border hover:border-brand/30 rounded-full text-sm font-medium text-brand-navy hover:text-brand transition-all whitespace-nowrap flex-shrink-0"
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs text-brand-muted">({category.itemCount})</span>
            </Link>
          ))}
          <Link
            href="/products"
            className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors whitespace-nowrap flex-shrink-0"
          >
            Lihat Semua →
          </Link>
        </div>
      </div>
    </section>
  );
}
