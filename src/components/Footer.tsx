"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Lock,
} from "lucide-react";
import { storeInfo } from "@/data/products";

const belanjaLinks = [
  { label: "Semua Produk", href: "/products" },
  { label: "💻 Laptop & Notebook", href: "/category/laptop-notebook" },
  { label: "📱 Smartphone & Tablet", href: "/category/smartphone-tablet" },
  { label: "🖥️ Monitor & TV", href: "/category/monitor-tv" },
  { label: "🌐 Networking & IT", href: "/category/networking-it" },
  { label: "⌨️ Peripheral & Aksesoris", href: "/category/peripheral-aksesoris" },
];

const bantuanLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Cara Beli", href: "/how-to-buy" },
  { label: "Cara Jual", href: "/how-to-sell" },
  { label: "Pengiriman & Pengembalian", href: "/shipping-returns" },
  { label: "Garansi 30 Hari", href: "/warranty" },
  { label: "Hubungi Kami", href: "/contact" },
];

const companyLinks = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Karir", href: "/careers" },
  { label: "Kebijakan Privasi", href: "/privacy-policy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Return Policy", href: "/return-policy" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy-policy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "Kebijakan Cookie", href: "/cookie-policy" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [showSellButton, setShowSellButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSellButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-brand-navy text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">
              📧 Dapatkan Info Promo & Produk Terbaru!
            </h3>
            <p className="text-white/70 mb-6">
              Berlangganan newsletter kami untuk mendapatkan diskon eksklusif dan
              update produk baru.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 text-sm"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand hover:bg-brand-dark font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                {isSubscribed ? "✓ Tersubscribe!" : "Berlangganan →"}
              </button>
            </form>
            <p className="text-white/50 text-xs mt-3">
              Kami hormati privasi kamu. Unsubscribe kapan saja.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-xl mb-4">
              beli<span className="text-brand">seken</span>.com
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {storeInfo.tagline} — di Bekasi. Hemat hingga 70% dari harga baru.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={storeInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram BeliSeken"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/6285101256123"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp BeliSeken"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#25D366] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href={storeInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook BeliSeken"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={storeInfo.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok BeliSeken"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-black transition-colors"
              >
                <span className="text-xs font-bold">TT</span>
              </a>
              <a
                href={storeInfo.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube BeliSeken"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Belanja */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/90">
              Belanja
            </h4>
            <ul className="space-y-2.5">
              {belanjaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/90">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              {bantuanLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/90">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/90">
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 leading-relaxed">
                  {storeInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand flex-shrink-0" />
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="text-sm text-white/50 hover:text-brand transition-colors"
                >
                  {storeInfo.phoneFormatted}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand flex-shrink-0" />
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="text-sm text-white/50 hover:text-brand transition-colors"
                >
                  {storeInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} className="text-brand flex-shrink-0" />
                <span className="text-sm text-white/50">
                  {storeInfo.operatingHours}
                </span>
              </li>
            </ul>
            {/* Google Maps Link */}
            <a
              href="https://maps.google.com/?q=Griyaasri+2+Blok+H6+No+30+Tambun+Selatan+Bekasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs text-brand hover:text-brand-dark transition-colors"
            >
              📍 Lihat di Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Payment & Trust */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/40 mb-2">Metode Pembayaran:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {["BCA", "Mandiri", "BNI", "BRI", "GoPay", "OVO", "DANA", "QRIS"].map(
                  (method) => (
                    <span
                      key={method}
                      className="px-2.5 py-1 bg-white/10 rounded text-[11px] font-semibold text-white/70"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/40">
                <Lock size={12} />
                <span className="text-xs">SSL Secured (256-bit)</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <span className="text-xs">PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              © 2026 BeliSeken.com. All Rights Reserved. Made with ❤️ in Bekasi,
              Indonesia
            </p>
            <div className="flex items-center gap-3">
              {legalLinks.map((link, i) => (
                <span key={link.href} className="flex items-center gap-3">
                  <Link
                    href={link.href}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {i < legalLinks.length - 1 && (
                    <span className="text-white/20">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Jual Barang Button */}
      {showSellButton && (
        <Link
          href="/sell"
          className="fixed bottom-20 right-6 px-5 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 z-40 text-sm"
        >
          📸 Jual Barang
        </Link>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-brand hover:bg-brand-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  );
}
