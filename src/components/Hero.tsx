"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, Truck, Shield } from "lucide-react";
import { getProducts, storeInfo } from "@/data/products";

const banners = [
  {
    id: 1,
    title: "Elektronik Bekas",
    subtitle: "Berkualitas & Terjamin",
    highlight: "Hemat Hingga 70%",
    description: "Garansi 30 hari, pengiriman aman ke seluruh Indonesia",
    cta: "Lihat Katalog",
    href: "/products",
    bg: "from-brand to-brand-dark",
  },
  {
    id: 2,
    title: "Flash Sale",
    subtitle: "Hari Ini Saja",
    highlight: "Mulai Rp100rb-an",
    description: "Jangan sampai kehabisan, stok terbatas!",
    cta: "Buruan Beli",
    href: "/products",
    bg: "from-rose-600 to-orange-500",
  },
  {
    id: 3,
    title: "Jual Barang Bekas",
    subtitle: "Mudah & Cepat",
    highlight: "Harga Terbaik",
    description: "Foto, kirim, dapat uang. Praktis!",
    cta: "Jual Sekarang",
    href: "/sell",
    bg: "from-emerald-600 to-teal-500",
  },
];

export default function Hero() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts.slice(0, 6));
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const banner = banners[currentBanner];

  return (
    <section className="bg-brand-gray pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Banner (Left - 2/3 width) */}
          <div className="lg:col-span-2 relative">
            <div
              className={`relative bg-gradient-to-r ${banner.bg} rounded-2xl overflow-hidden min-h-[320px] md:min-h-[400px] transition-all duration-500`}
            >
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
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentBanner ? "bg-white w-6" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Promo Cards (Right - 1/3 width) */}
          <div className="flex flex-col gap-4">
            {/* Card 1 */}
            <Link
              href="/category/laptop-notebook"
              className="flex-1 relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-semibold mb-1">💻 Laptop & Notebook</p>
                <p className="text-2xl font-extrabold text-white mb-2">Mulai 3.5 Juta</p>
                <p className="text-white/60 text-xs">MacBook, ThinkPad, ASUS ROG & lainnya</p>
              </div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute bottom-2 right-4 w-12 h-12 bg-white/5 rounded-full" />
            </Link>

            {/* Card 2 */}
            <Link
              href="/category/smartphone-tablet"
              className="flex-1 relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-semibold mb-1">📱 Smartphone & Tablet</p>
                <p className="text-2xl font-extrabold text-white mb-2">Mulai 1.2 Juta</p>
                <p className="text-white/60 text-xs">iPhone, Samsung, iPad & lainnya</p>
              </div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute bottom-2 right-4 w-12 h-12 bg-white/5 rounded-full" />
            </Link>

            {/* Card 3 */}
            <Link
              href="/category/networking-it"
              className="flex-1 relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-semibold mb-1">🌐 Networking & IT</p>
                <p className="text-2xl font-extrabold text-white mb-2">Mulai Rp150rb</p>
                <p className="text-white/60 text-xs">MikroTik, TP-Link, Ubiquiti & lainnya</p>
              </div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full" />
              <div className="absolute bottom-2 right-4 w-12 h-12 bg-white/5 rounded-full" />
            </Link>
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
                  <p className="text-xs text-brand-muted">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
