"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
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

// Card kategori horizontal — icon besar + teks di sampingnya
function KategoriCard({
  href,
  icon,
  title,
  subtitle,
  badge,
  titleClass = "text-brand-navy",
}: {
  href: string;
  icon: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; color: string };
  titleClass?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex-shrink-0 snap-start w-56 flex items-center gap-4 bg-gray-50 hover:bg-white border border-transparent hover:border-brand-border rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-md"
    >
      <div className="relative flex-shrink-0">
        {badge && (
          <span className={`absolute -top-2 -right-2 ${badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10`}>
            {badge.label}
          </span>
        )}
        <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={icon}
            alt={title}
            className="w-11 h-11 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${titleClass} group-hover:text-brand transition-colors leading-tight truncate`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-brand-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-brand transition-colors flex-shrink-0" />
    </Link>
  );
}

export default function KategoriPopuler() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-8 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Kategori</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-brand-navy" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory items-center"
          >
            {/* Jual Barang - Special Item */}
            <KategoriCard
              href="/sell"
              icon="/icons/jualbarang.svg"
              title="Jual Barang"
              subtitle="Jual barang bekasmu"
              badge={{ label: "Hot", color: "bg-brand" }}
              titleClass="text-brand"
            />

            {/* Loading skeleton */}
            {categories.length === 0 &&
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-56 flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}

            {/* Categories from Database */}
            {categories.map((category) => {
              const icon = categoryIcons[category.name] || "/icons/lightbulb.svg";
              const badge = categoryBadges[category.name];

              return (
                <KategoriCard
                  key={category.id}
                  href={`/category/${category.slug}`}
                  icon={icon}
                  title={category.name}
                  subtitle={`${category.itemCount} produk`}
                  badge={badge}
                />
              );
            })}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} className="text-brand-navy" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
