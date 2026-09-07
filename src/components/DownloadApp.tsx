"use client";

import { useEffect, useState } from "react";

export default function DownloadApp() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate QR code via free API
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://beliseken.com")}&bgcolor=ffffff&color=1a1a2e&format=png`
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#1a1a3e] to-brand-navy py-16 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-[280px]">
              {/* Phone frame */}
              <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl border-4 border-gray-700">
                <div className="bg-white rounded-[32px] overflow-hidden">
                  {/* Notch */}
                  <div className="bg-brand px-4 pt-8 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.34-4.34" />
                        </svg>
                      </div>
                      <div className="flex-1 bg-white/20 rounded-lg h-6" />
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand">BeliSeken</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-brand/5 p-4">
                    {/* Promo banner */}
                    <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-3 mb-3">
                      <p className="text-white text-xs font-bold">Flash Sale Hari Ini!</p>
                      <p className="text-white/70 text-[10px]">Diskon hingga 50%</p>
                    </div>
                    {/* Category icons */}
                    <div className="flex justify-around mb-3">
                      {["💻", "📱", "🖥️", "⌨️", "🎧"].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    {/* Product cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="bg-gray-100 rounded-md h-16 mb-2 flex items-center justify-center text-2xl">
                            {i === 1 ? "💻" : "📱"}
                          </div>
                          <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-brand/20 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-2 -right-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                ⭐ 4.9 Rating
              </div>
              <div className="absolute top-1/3 -left-8 bg-white text-brand-navy text-[10px] font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                🏷️ Point & Rewards
              </div>
              <div className="absolute bottom-1/3 -right-10 bg-white text-brand-navy text-[10px] font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                🚚 Gratis Ongkir
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Download Our App
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Nikmati pengalaman belanja terbaik langsung dari HP kamu. 
              Dapatkan notifikasi flash sale, lacak pesanan, dan belanja lebih mudah dengan satu sentuhan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {/* Google Play */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors group"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.457-2.302 2.457-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/60 leading-none">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
              {/* App Store */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors group"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/60 leading-none">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center lg:justify-end order-3">
            <div className="bg-white rounded-2xl p-4 shadow-xl text-center">
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="QR Code Download BeliSeken App"
                  className="w-40 h-40 rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-lg animate-pulse" />
              )}
              <p className="text-sm font-semibold text-brand-navy mt-3">
                Scan to Download
              </p>
              <p className="text-xs text-brand-muted">BeliSeken App</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
