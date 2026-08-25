"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveBanners, getActivePromoCards, type Banner, type PromoCard } from "@/lib/banners";

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    getActiveBanners().then(setBanners).catch(() => {});
    getActivePromoCards().then(setPromoCards).catch(() => {});
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };
  const prevBanner = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Show skeleton while loading — fixed height prevents CLS
  if (banners.length === 0) {
    return (
      <section className="bg-brand-gray pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative">
              <div className="w-full aspect-[16/7] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse min-h-[150px]" />
              <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse min-h-[150px]" />
            </div>
          </div>
          <div className="mt-6 bg-gray-200 rounded-2xl h-16 animate-pulse" />
        </div>
      </section>
    );
  }

  const banner = banners[currentBanner];

  return (
    <section className="bg-brand-gray pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Banner (Left - 2/3 width) */}
          <div className="lg:col-span-2 relative">
            <div
              className={`relative bg-gradient-to-r ${banner.bg} rounded-2xl overflow-hidden aspect-[16/7] transition-all duration-500`}
            >
              {/* Background Image (if uploaded) */}
              {banner.imageBase64 && (
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.imageBase64}
                    alt={banner.title}
                    width={1200}
                    height={525}
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
                <p className="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wider">
                  {banner.subtitle}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">
                  {banner.title}
                </h2>
                <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-amber-300 mb-4">
                  {banner.highlight}
                </p>
                <p className="text-white/80 mb-6 max-w-md">
                  {banner.description}
                </p>
                <Link
                  href={banner.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand font-bold rounded-xl hover:bg-gray-100 transition-colors w-fit"
                >
                  {banner.cta} →
                </Link>
              </div>

              {/* Nav Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    aria-label="Banner sebelumnya"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextBanner}
                    aria-label="Banner berikutnya"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </>
              )}

              {/* Dots */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentBanner(i)}
                      aria-label={`Banner ${i + 1}`}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentBanner ? "bg-white w-6" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Promo Cards (Right - 1/3 width) */}
          <div className="flex flex-col gap-4">
            {promoCards.length > 0 ? (
              promoCards.map((promo) => (
                <Link
                  key={promo.id}
                  href={promo.href}
                  className="flex-1 relative rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Background */}
                  {promo.imageBase64 ? (
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={promo.imageBase64}
                        alt={promo.title}
                        width={400}
                        height={300}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70" />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${promo.bg}`} />
                  )}

                  {/* Decorative circles */}
                  <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="absolute bottom-2 right-4 w-12 h-12 bg-white/5 rounded-full" />

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    <p className="text-white/80 text-sm font-semibold mb-1">{promo.title}</p>
                    <p className="text-2xl font-extrabold text-white mb-2">{promo.price}</p>
                    <p className="text-white/60 text-xs">{promo.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse min-h-[150px]" />
                <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse min-h-[150px]" />
              </>
            )}
          </div>
        </div>

        {/* Trust Bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-brand-border">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border">
            {[
              { icon: "🔍", label: "Grade Premium", sublabel: "Diuji & grading ketat" },
              { icon: "🛡️", label: "Garansi 30 Hari", sublabel: "Retur jika tidak sesuai" },
              { icon: "🚚", label: "Pengiriman Aman", sublabel: "Packing bubble wrap" },
              { icon: "💬", label: "Konsultasi Gratis", sublabel: "Chat via WhatsApp" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 hover:bg-brand/5 transition-colors">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
