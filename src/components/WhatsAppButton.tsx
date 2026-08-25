"use client";

import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="relative group"
          aria-label="Chat WhatsApp"
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />

          {/* Button */}
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center hover:bg-[#20bd5a] transition-colors hover:scale-110 duration-300">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            <p className="text-xs font-semibold text-brand-navy">Butuh bantuan?</p>
            <p className="text-[10px] text-brand-muted">Chat kami di WhatsApp</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-[320px] overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">BeliSeken.com</p>
                <p className="text-white/70 text-xs">Online biasanya dalam hitungan menit</p>
              </div>
            </div>
            <button
              onClick={() => setMinimized(true)}
              className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-[#ECE5DD] p-4 min-h-[120px]">
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
              <p className="text-sm text-gray-800">
                Halo 👋 ada yang bisa kami bantu?
              </p>
              <p className="text-[10px] text-gray-400 mt-1 text-right">09:00</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-3 border-t border-gray-100">
            <a
              href="https://wa.me/6285101256123?text=Halo%20BeliSeken%2C%20saya%20tertarik%20dengan%20produknya.%20Bisa%20info%20lebih%20lanjut%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl text-center text-sm transition-colors"
            >
              Mulai Chat
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
