"use client";

import Link from "next/link";
import { Truck, Shield, RotateCcw, HeadphonesIcon } from "lucide-react";

const trustItems = [
  {
    icon: "🔍",
    title: "Grade Premium",
    description: "Diuji & grading ketat",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "🛡️",
    title: "Garansi 30 Hari",
    description: "Retur jika tidak sesuai",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: "🚚",
    title: "Pengiriman Aman",
    description: "Packing bubble wrap tebal",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: "💬",
    title: "Konsultasi Gratis",
    description: "Tanya via WhatsApp",
    color: "from-purple-500 to-purple-600",
  },
];

export default function PromoBanner() {
  return (
    <section className="py-12 bg-gradient-to-br from-brand-navy via-slate-800 to-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner */}
        <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <p className="text-white/70 text-sm font-semibold mb-2 uppercase tracking-wider">
                🏷️ Spesial Agustusan
              </p>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                Hemat Hingga <span className="text-amber-300">60%</span>
              </h3>
              <p className="text-white/80 mb-6 max-w-md">
                Elektronik bekas berkualitas dengan garansi 30 hari. Pengiriman
                aman ke seluruh Indonesia.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Belanja Sekarang →
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">50+</div>
                <p className="text-white/60 text-sm">Produk</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-5xl font-extrabold text-amber-300">4.8</div>
                <p className="text-white/60 text-sm">Rating</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">2500+</div>
                <p className="text-white/60 text-sm">Pelanggan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition-colors"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-white/50 text-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
