"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function FlashSale() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Countdown timer - berakhir tengah malam
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchProductsAPI({ badge: 'HOT DEAL', limit: 12 })
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  if (products.length === 0) return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-none w-[200px] bg-white rounded-xl border border-brand-border overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
                Flash Sale
              </h2>
              <p className="text-sm text-brand-muted">Elektronik Bekas Premium</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-brand-navy rounded-xl px-4 py-2">
            <span className="text-sm text-white/70 mr-1">Berakhir dalam</span>
            {[
              { value: countdown.hours, label: "J" },
              { value: countdown.minutes, label: "M" },
              { value: countdown.seconds, label: "D" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="bg-brand text-white rounded-lg px-2.5 py-1.5 text-center min-w-[36px]">
                  <span className="text-lg font-bold font-mono">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                {i < 2 && <span className="text-white font-bold animate-pulse">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Product Carousel */}
        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <ChevronLeft size={20} className="text-brand-navy" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <ChevronRight size={20} className="text-brand-navy" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="flex-none w-[180px] sm:w-[200px] bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-lg transition-all duration-300 snap-start group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-brand-gray flex items-center justify-center overflow-hidden">
                  {product.imageBase64 ? (
                    <img
                      src={product.imageBase64}
                      alt={`${product.name} - produk flash sale`}
                      loading="lazy"
                      decoding="async"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Zap size={20} className="text-gray-400" />
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{product.discount}%
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-brand font-bold text-base">
                    {formatPrice(product.sellingPrice)}
                  </p>
                  <p className="text-xs text-brand-muted line-through">
                    {formatPrice(product.sellingPrice * (1 + product.discount / 100))}
                  </p>
                  <p className="text-xs text-brand-navy mt-1 line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand text-brand font-semibold rounded-xl hover:bg-brand hover:text-white transition-colors"
          >
            Lihat Semua Flash Sale →
          </Link>
        </div>
      </div>
    </section>
  );
}
