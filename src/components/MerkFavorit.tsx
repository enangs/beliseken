"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
  logo: string;
  color: string;
}

// Logo PNG asli per brand (public/brands)
const brands: Brand[] = [
  { name: "Lenovo", slug: "lenovo", logo: "/brands/lenovo-seeklogo.png", color: "#E2231A" },
  { name: "ASUS", slug: "asus", logo: "/brands/asus-seeklogo.png", color: "#00529B" },
  { name: "HP", slug: "hp", logo: "/brands/hp-seeklogo.png", color: "#0096D6" },
  { name: "Dell", slug: "dell", logo: "/brands/dell-seeklogo.png", color: "#007DB8" },
  { name: "Acer", slug: "acer", logo: "/brands/acer-seeklogo.png", color: "#83B81A" },
  { name: "Apple", slug: "apple", logo: "/brands/apple-seeklogo.png", color: "#555555" },
  { name: "MSI", slug: "msi", logo: "/brands/msi-seeklogo.png", color: "#FF0000" },
  { name: "Samsung", slug: "samsung", logo: "/brands/samsung-seeklogo.png", color: "#1428A0" },
  { name: "Xiaomi", slug: "xiaomi", logo: "/brands/xiaomi-seeklogo.png", color: "#FF6900" },
  { name: "Huawei", slug: "huawei", logo: "/brands/huawei-seeklogo.png", color: "#CF0A2C" },
  { name: "Toshiba", slug: "toshiba", logo: "/brands/toshiba-seeklogo.png", color: "#0066B3" },
  { name: "LG", slug: "lg", logo: "/brands/lg-seeklogo.png", color: "#A50034" },
  { name: "Sony", slug: "sony", logo: "/brands/sony-seeklogo.png", color: "#000000" },
  { name: "Microsoft", slug: "microsoft", logo: "/brands/microsoft-seeklogo.png", color: "#737373" },
  { name: "BenQ", slug: "benq", logo: "/brands/benq-seeklogo.png", color: "#0099A8" },
  { name: "Logitech", slug: "logitech", logo: "/brands/logitech-seeklogo.png", color: "#00B8FC" },
  { name: "MikroTik", slug: "mikrotik", logo: "/brands/mikrotik-seeklogo.png", color: "#293239" },
  { name: "NVIDIA", slug: "nvidia", logo: "/brands/nvidia-seeklogo.png", color: "#76B900" },
  { name: "Alienware", slug: "alienware", logo: "/brands/alienware-seeklogo.png", color: "#000000" },
];

// Logo PNG asli — tinggi maksimal 34px, lebar mengikuti rasio asli
function BrandLogo({ brand }: { brand: Brand }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={`${brand.name} logo`}
      style={{ maxHeight: 34, width: "auto" }}
      className="object-contain"
      loading="lazy"
    />
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
