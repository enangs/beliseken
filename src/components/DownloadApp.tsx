"use client";

import { useEffect, useState } from "react";

export default function DownloadApp() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://beliseken.com")}&bgcolor=ffffff&color=e94560&format=png`
    );
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Transaksi Aman",
      desc: "Garansi 30 hari untuk semua pembelian",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: "Flash Sale Setiap Hari",
      desc: "Notifikasi eksklusif diskon hingga 70%",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: "Gratis Ongkir",
      desc: "Pengiriman instan ke seluruh Indonesia",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: "Wishlist & Notifikasi",
      desc: "Simpan barang favorit dan dapatkan harga terbaik",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-brand-navy via-[#1a1a3e] to-brand-navy py-16 md:py-20 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Phone Mockup + QR */}
          <div className="relative flex flex-col items-center lg:items-start gap-8">
            {/* Phone */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand/20 rounded-[50px] blur-3xl scale-90" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/app-mockup.png"
                alt="BeliSeken App"
                className="relative w-[280px] md:w-[340px] h-auto drop-shadow-2xl z-10"
              />
              {/* Floating badges */}
              <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 animate-bounce">
                ⭐ 4.9
              </div>
              <div className="absolute top-1/2 -left-6 bg-white text-brand-navy text-xs font-semibold px-3 py-2 rounded-xl shadow-lg z-20 flex items-center gap-1.5">
                <span className="text-brand">🏷️</span> Point & Rewards
              </div>
              <div className="absolute bottom-1/3 -right-4 bg-white text-brand-navy text-xs font-semibold px-3 py-2 rounded-xl shadow-lg z-20 flex items-center gap-1.5">
                <span className="text-green-500">🚚</span> Gratis Ongkir
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-4 shadow-xl flex items-center gap-4">
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrUrl} alt="QR Code" className="w-20 h-20 rounded-lg" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
              )}
              <div>
                <p className="text-sm font-bold text-brand-navy">Scan to Download</p>
                <p className="text-xs text-brand-muted">Gratis di App Store & Google Play</p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-brand/10 text-brand text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              📱 Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Belanja Lebih Mudah<br />
              <span className="text-brand">Lewat Aplikasi</span>
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Nikmati pengalaman belanja elektronik bekas premium langsung dari HP kamu. 
              Notifikasi flash sale, tracking pesanan, dan cashback eksklusif.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-brand flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                    <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#" className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-brand-navy px-6 py-3.5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.457-2.302 2.457-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-brand-muted leading-none">GET IT ON</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-brand-navy px-6 py-3.5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-brand-muted leading-none">Download on the</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
