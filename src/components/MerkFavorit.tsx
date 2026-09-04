"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
  logo: string; // SVG inline or emoji fallback
  color: string;
}

const brands: Brand[] = [
  { name: "Lenovo", slug: "lenovo", logo: ".Lenovo", color: "#E2231A" },
  { name: "ASUS", slug: "asus", logo: ".ASUS", color: "#00529B" },
  { name: "HP", slug: "hp", logo: ".HP", color: "#0096D6" },
  { name: "Dell", slug: "dell", logo: ".DELL", color: "#007DB8" },
  { name: "Acer", slug: "acer", logo: ".Acer", color: "#83B81A" },
  { name: "Apple", slug: "apple", logo: ".Apple", color: "#555555" },
  { name: "MSI", slug: "msi", logo: ".MSI", color: "#FF0000" },
  { name: "Samsung", slug: "samsung", logo: ".Samsung", color: "#1428A0" },
  { name: "Xiaomi", slug: "xiaomi", logo: ".Xiaomi", color: "#FF6900" },
  { name: "Huawei", slug: "huawei", logo: ".Huawei", color: "#CF0A2C" },
  { name: "Toshiba", slug: "toshiba", logo: ".Toshiba", color: "#0066B3" },
  { name: "LG", slug: "lg", logo: ".LG", color: "#A50034" },
  { name: "Sony", slug: "sony", logo: ".Sony", color: "#000000" },
  { name: "Microsoft", slug: "microsoft", logo: ".Microsoft", color: "#737373" },
];

// Brand logo SVG components for professional look
function BrandLogo({ brand }: { brand: Brand }) {
  const logoMap: Record<string, React.JSX.Element> = {
    lenovo: (
      <svg viewBox="0 0 120 40" className="w-20 h-8">
        <rect x="0" y="8" width="24" height="24" rx="4" fill="#E2231A" />
        <text x="32" y="25" fontSize="14" fontWeight="bold" fill="#333">Lenovo</text>
      </svg>
    ),
    asus: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <text x="10" y="28" fontSize="22" fontWeight="900" fill="#00529B" letterSpacing="2">ASUS</text>
      </svg>
    ),
    hp: (
      <svg viewBox="0 0 80 40" className="w-14 h-8">
        <circle cx="22" cy="20" r="18" fill="#0096D6" />
        <text x="12" y="27" fontSize="18" fontWeight="bold" fill="white">hp</text>
      </svg>
    ),
    dell: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <ellipse cx="50" cy="20" rx="40" ry="18" fill="none" stroke="#007DB8" strokeWidth="2" />
        <text x="18" y="27" fontSize="20" fontWeight="bold" fill="#007DB8">DELL</text>
      </svg>
    ),
    acer: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <text x="10" y="28" fontSize="22" fontWeight="bold" fill="#83B81A" letterSpacing="1">acer</text>
      </svg>
    ),
    apple: (
      <svg viewBox="0 0 80 40" className="w-14 h-8">
        <text x="8" y="30" fontSize="32" fill="#333">{"\uF8FF"}</text>
        <text x="32" y="27" fontSize="16" fontWeight="600" fill="#333">Apple</text>
      </svg>
    ),
    msi: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <rect x="0" y="5" width="30" height="30" rx="4" fill="#FF0000" />
        <text x="4" y="26" fontSize="14" fontWeight="bold" fill="white">MSI</text>
      </svg>
    ),
    samsung: (
      <svg viewBox="0 0 120 40" className="w-20 h-8">
        <ellipse cx="60" cy="20" rx="55" ry="16" fill="none" stroke="#1428A0" strokeWidth="2" />
        <text x="18" y="26" fontSize="16" fontWeight="bold" fill="#1428A0" letterSpacing="3">SAMSUNG</text>
      </svg>
    ),
    xiaomi: (
      <svg viewBox="0 0 120 40" className="w-20 h-8">
        <rect x="0" y="5" width="30" height="30" rx="6" fill="#FF6900" />
        <text x="4" y="27" fontSize="16" fontWeight="bold" fill="white">mi</text>
        <text x="36" y="26" fontSize="16" fontWeight="600" fill="#333">Xiaomi</text>
      </svg>
    ),
    huawei: (
      <svg viewBox="0 0 120 40" className="w-20 h-8">
        <text x="10" y="28" fontSize="16" fontWeight="bold" fill="#CF0A2C" letterSpacing="1">HUAWEI</text>
      </svg>
    ),
    toshiba: (
      <svg viewBox="0 0 120 40" className="w-20 h-8">
        <text x="5" y="26" fontSize="16" fontWeight="bold" fill="#0066B3" letterSpacing="1">TOSHIBA</text>
      </svg>
    ),
    lg: (
      <svg viewBox="0 0 80 40" className="w-14 h-8">
        <circle cx="20" cy="20" r="16" fill="#A50034" />
        <text x="10" y="26" fontSize="14" fontWeight="bold" fill="white">LG</text>
      </svg>
    ),
    sony: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <text x="10" y="28" fontSize="20" fontWeight="900" fill="#000" letterSpacing="3">SONY</text>
      </svg>
    ),
    microsoft: (
      <svg viewBox="0 0 140 40" className="w-24 h-8">
        <rect x="0" y="5" width="12" height="12" fill="#F25022" />
        <rect x="14" y="5" width="12" height="12" fill="#7FBA00" />
        <rect x="0" y="19" width="12" height="12" fill="#00A4EF" />
        <rect x="14" y="19" width="12" height="12" fill="#FFB900" />
        <text x="32" y="26" fontSize="14" fontWeight="600" fill="#333">Microsoft</text>
      </svg>
    ),
  };

  return logoMap[brand.slug] || (
    <span className="text-lg font-bold" style={{ color: brand.color }}>
      {brand.name}
    </span>
  );
}

export default function MerkFavorit() {
  return (
    <section className="py-8 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title - OLX Style */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Merk Favorit</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        {/* Brand Grid - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:overflow-visible md:grid md:grid-cols-7 md:gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/products?brand=${brand.slug}`}
              className="group flex-shrink-0 w-[120px] md:w-auto"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center justify-center hover:border-brand/30 hover:shadow-md transition-all duration-300 group-hover:scale-105 min-h-[100px]">
                <BrandLogo brand={brand} />
              </div>
              <p className="text-center text-xs font-medium text-gray-600 mt-2 group-hover:text-brand transition-colors">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
