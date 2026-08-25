"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, type CategoryResponse } from "@/lib/api";

// Category icon mapping (SVG files)
const categoryIcons: Record<string, string> = {
  "Laptop & Notebook": "/icons/laptop.svg",
  "Smartphone & Tablet": "/icons/device-mobile.svg",
  "Monitor & TV": "/icons/monitor.svg",
  "Networking & IT": "/icons/network.svg",
  "Peripheral & Aksesoris": "/icons/circuitry.svg",
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

        {/* Category Grid - Clean SVG Icons + Jual Barang */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {/* Jual Barang - Special Item */}
          <Link
            href="/sell"
            className="group flex flex-col items-center gap-3"
          >
            <div className="relative">
              <span className="absolute -top-2 -right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                Hot
              </span>
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/jualbarang.svg"
                  alt="Jual Barang"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-brand group-hover:text-brand-dark transition-colors leading-tight">
                Jual Barang
              </p>
              <p className="text-[10px] sm:text-xs text-brand-muted mt-0.5">
                Jual barang bekasmu
              </p>
            </div>
          </Link>

          {/* Categories from Database */}
          {categories.length === 0 ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </>
          ) : (
            categories.map((category) => {
              const icon = categoryIcons[category.name] || "/icons/lightbulb.svg";
              const badge = categoryBadges[category.name];

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative">
                    {badge && (
                      <span className={`absolute -top-2 -right-3 ${badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10`}>
                        {badge.label}
                      </span>
                    )}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={icon}
                        alt={category.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
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
