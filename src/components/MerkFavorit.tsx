"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
  color: string;
}

const brands: Brand[] = [
  { name: "Lenovo", slug: "lenovo", color: "#E2231A" },
  { name: "ASUS", slug: "asus", color: "#00529B" },
  { name: "HP", slug: "hp", color: "#0096D6" },
  { name: "Dell", slug: "dell", color: "#007DB8" },
  { name: "Acer", slug: "acer", color: "#83B81A" },
  { name: "Apple", slug: "apple", color: "#555555" },
  { name: "MSI", slug: "msi", color: "#FF0000" },
  { name: "Samsung", slug: "samsung", color: "#1428A0" },
  { name: "Xiaomi", slug: "xiaomi", color: "#FF6900" },
  { name: "Huawei", slug: "huawei", color: "#CF0A2C" },
  { name: "Toshiba", slug: "toshiba", color: "#0066B3" },
  { name: "LG", slug: "lg", color: "#A50034" },
  { name: "Sony", slug: "sony", color: "#000000" },
  { name: "Microsoft", slug: "microsoft", color: "#737373" },
];

// Brand logo SVG — larger size
function BrandLogo({ brand }: { brand: Brand }) {
  const logoMap: Record<string, React.JSX.Element> = {
    lenovo: (
      <svg viewBox="0 0 120 40" className="h-[34px] w-auto">
        <rect x="0" y="8" width="24" height="24" rx="4" fill="#E2231A" />
        <text x="32" y="26" fontSize="15" fontWeight="bold" fill="#333">Lenovo</text>
      </svg>
    ),
    asus: (
      <svg viewBox="0 0 100 40" className="h-[34px] w-auto">
        <text x="10" y="30" fontSize="26" fontWeight="900" fill="#00529B" letterSpacing="2">ASUS</text>
      </svg>
    ),
    hp: (
      <svg viewBox="0 0 80 44" className="h-[34px] w-auto">
        <circle cx="22" cy="22" r="20" fill="#0096D6" />
        <text x="10" y="30" fontSize="20" fontWeight="bold" fill="white">hp</text>
      </svg>
    ),
    dell: (
      <svg viewBox="0 0 100 40" className="h-[34px] w-auto">
        <ellipse cx="50" cy="20" rx="44" ry="18" fill="none" stroke="#007DB8" strokeWidth="2.5" />
        <text x="16" y="28" fontSize="22" fontWeight="bold" fill="#007DB8">DELL</text>
      </svg>
    ),
    acer: (
      <svg viewBox="0 0 100 40" className="h-[34px] w-auto">
        <text x="10" y="30" fontSize="26" fontWeight="bold" fill="#83B81A" letterSpacing="1">acer</text>
      </svg>
    ),
    apple: (
      <svg viewBox="0 0 100 44" className="h-[34px] w-auto">
        <text x="8" y="34" fontSize="36" fill="#333">{"\uF8FF"}</text>
        <text x="38" y="30" fontSize="18" fontWeight="600" fill="#333">Apple</text>
      </svg>
    ),
    msi: (
      <svg viewBox="0 0 100 40" className="h-[34px] w-auto">
        <rect x="0" y="4" width="32" height="32" rx="5" fill="#FF0000" />
        <text x="5" y="28" fontSize="16" fontWeight="bold" fill="white">MSI</text>
      </svg>
    ),
    samsung: (
      <svg viewBox="0 0 130 44" className="h-[34px] w-auto">
        <ellipse cx="65" cy="22" rx="60" ry="18" fill="none" stroke="#1428A0" strokeWidth="2" />
        <text x="14" y="28" fontSize="18" fontWeight="bold" fill="#1428A0" letterSpacing="3">SAMSUNG</text>
      </svg>
    ),
    xiaomi: (
      <svg viewBox="0 0 130 44" className="h-[34px] w-auto">
        <rect x="0" y="5" width="34" height="34" rx="8" fill="#FF6900" />
        <text x="5" y="30" fontSize="18" fontWeight="bold" fill="white">mi</text>
        <text x="40" y="30" fontSize="18" fontWeight="600" fill="#333">Xiaomi</text>
      </svg>
    ),
    huawei: (
      <svg viewBox="0 0 130 40" className="h-[34px] w-auto">
        <text x="10" y="30" fontSize="18" fontWeight="bold" fill="#CF0A2C" letterSpacing="1">HUAWEI</text>
      </svg>
    ),
    toshiba: (
      <svg viewBox="0 0 130 40" className="h-[34px] w-auto">
        <text x="5" y="28" fontSize="18" fontWeight="bold" fill="#0066B3" letterSpacing="1">TOSHIBA</text>
      </svg>
    ),
    lg: (
      <svg viewBox="0 0 80 44" className="h-[34px] w-auto">
        <circle cx="22" cy="22" r="18" fill="#A50034" />
        <text x="10" y="28" fontSize="16" fontWeight="bold" fill="white">LG</text>
      </svg>
    ),
    sony: (
      <svg viewBox="0 0 100 40" className="h-[34px] w-auto">
        <text x="10" y="30" fontSize="24" fontWeight="900" fill="#000" letterSpacing="4">SONY</text>
      </svg>
    ),
    microsoft: (
      <svg viewBox="0 0 150 44" className="h-[34px] w-auto">
        <rect x="0" y="5" width="14" height="14" fill="#F25022" />
        <rect x="16" y="5" width="14" height="14" fill="#7FBA00" />
        <rect x="0" y="21" width="14" height="14" fill="#00A4EF" />
        <rect x="16" y="21" width="14" height="14" fill="#FFB900" />
        <text x="36" y="30" fontSize="16" fontWeight="600" fill="#333">Microsoft</text>
      </svg>
    ),
  };

  return logoMap[brand.slug] || (
    <span className="text-xl font-bold h-[34px] flex items-center" style={{ color: brand.color }}>{brand.name}</span>
  );
}

export default function MerkFavorit() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
          <h2 className="text-lg font-bold text-brand-navy">Merk Favorit</h2>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
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
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory items-center"
          >
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/products?brand=${brand.slug}`}
                className="group flex-shrink-0 snap-start flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                <BrandLogo brand={brand} />
              </Link>
            ))}
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
