"use client";

import { useEffect, useState } from "react";

export default function DownloadApp() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://beliseken.com")}&bgcolor=ffffff&color=1a1a2e&format=png`
    );
  }, []);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* iPhone Mockup - cropped at bottom */}
          <div className="flex justify-center lg:justify-start order-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/app-mockup.png"
              alt="BeliSeken App Preview"
              className="w-[300px] md:w-[360px] h-auto drop-shadow-2xl translate-y-8"
            />
          </div>

          {/* Text Content */}
          <div className="order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Download Our App
            </h2>
            <p className="text-brand-muted text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Nikmati pengalaman belanja terbaik langsung dari HP kamu.
              Dapatkan notifikasi flash sale, lacak pesanan, dan belanja lebih mudah dengan satu sentuhan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              {/* Google Play */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors"
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
                className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors"
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
            <div className="bg-white rounded-2xl p-4 shadow-xl text-center border border-brand-border">
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
