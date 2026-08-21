"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { storeInfo } from "@/data/products";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[100vh] md:min-h-[100vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.webp"
          alt="BeliSeken.com — Toko Elektronik Bekas Premium di Bekasi"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 opacity-0 animate-fade-in-up">
            Beli Elektronik Bekas
            <br />
            <span className="text-brand">Berkualitas</span>, Hemat Hingga 70%
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-lg opacity-0 animate-fade-in-up delay-200">
            {storeInfo.description}
          </p>

          {/* Search Bar */}
          <div className="mb-8 opacity-0 animate-fade-in-up delay-400">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg">
              <Search
                size={20}
                className="ml-4 text-brand-muted flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Mau cari apa hari ini?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 text-sm outline-none text-brand-navy placeholder:text-brand-muted/60 bg-transparent"
              />
              <button className="px-6 py-4 bg-brand hover:bg-brand-dark text-white font-semibold text-sm transition-colors whitespace-nowrap">
                Cari
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-10 opacity-0 animate-fade-in-up delay-600">
            <Link
              href="/sell"
              className="px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 text-base"
            >
              🟠 Jual Barang Anda
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy font-bold rounded-xl transition-all duration-200 text-base"
            >
              Lihat Katalog →
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 opacity-0 animate-fade-in-up delay-800">
            <div className="flex items-center gap-2 text-white/70">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-semibold">
                Trusted by <span className="text-white">{storeInfo.stats.customers}</span> pelanggan
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 ml-4 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-xs text-white/60">Tersedia di:</span>
              <span className="text-sm font-bold text-white/80">Tokopedia</span>
              <span className="text-white/30">|</span>
              <span className="text-sm font-bold text-white/80">Shopee</span>
              <span className="text-white/30">|</span>
              <span className="text-sm font-bold text-white/80">Blibli</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
