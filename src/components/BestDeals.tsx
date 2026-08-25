"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function BestDeals() {
  const [activeTab, setActiveTab] = useState("semua");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 14, seconds: 37 });

  useEffect(() => {
    fetchProductsAPI({ limit: 20 })
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  // Flash sale countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "hot-deal", label: "Hot Deal" },
    { id: "best-seller", label: "Best Seller" },
    { id: "baru", label: "Baru Ditambahkan" },
  ];

  const filteredProducts =
    activeTab === "semua"
      ? products
      : products.filter((p) => {
          if (activeTab === "hot-deal") return p.badge === "HOT DEAL";
          if (activeTab === "best-seller") return p.badge === "BEST SELLER";
          if (activeTab === "baru") return p.badge === "NEW";
          return true;
        });

  if (products.length === 0) return (
    <section className="py-16 md:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-brand-border overflow-hidden">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-16 md:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={24} className="text-brand" />
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                Best Deals Hari Ini
              </h2>
            </div>
            <p className="text-brand-muted text-lg">
              Pilihan terbaik dengan harga terjangkau
            </p>
          </div>
          <Link
            href="/products"
            className="text-brand font-semibold hover:text-brand-dark transition-colors mt-4 sm:mt-0"
          >
            Semua Produk →
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-brand text-white shadow-md"
                  : "bg-white text-brand-navy hover:bg-brand/10 border border-brand-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Flash Sale Countdown */}
        <div className="mt-10 bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-6 md:p-8 animate-gradient">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-white">
              <span className="text-3xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <div>
                <p className="font-bold text-lg">Flash Sale berakhir dalam:</p>
                <p className="text-white/80 text-sm">
                  Diskon spesial untuk produk terbatas!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                { value: countdown.hours, label: "Jam" },
                { value: countdown.minutes, label: "Menit" },
                { value: countdown.seconds, label: "Detik" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-black/20 rounded-lg px-4 py-3 text-center min-w-[60px]">
                    <span className="block text-2xl font-bold text-white font-mono">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-white/70 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="text-xl font-bold text-white animate-blink">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
