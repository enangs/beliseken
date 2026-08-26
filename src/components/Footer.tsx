import Link from "next/link";
import { MessageCircle } from "lucide-react";

const footerCategories = [
  { label: "Laptop & Notebook", href: "/category/laptop-notebook", icon: "/icons/laptop.svg" },
  { label: "Smartphone & Tablet", href: "/category/smartphone-tablet", icon: "/icons/device-mobile.svg" },
  { label: "Monitor & TV", href: "/category/monitor-tv", icon: "/icons/monitor.svg" },
  { label: "Networking & IT", href: "/category/networking-it", icon: "/icons/network.svg" },
  { label: "Peripheral & Aksesoris", href: "/category/peripheral-aksesoris", icon: "/icons/circuitry.svg" },
];

const footerLinks = {
  Toko: [
    { label: "Semua Produk", href: "/products" },
    { label: "Cara Beli", href: "/how-to-buy" },
    { label: "Cara Jual", href: "/how-to-sell" },
    { label: "Jual Barang", href: "/sell" },
  ],
  Bantuan: [
    { label: "FAQ", href: "/faq" },
    { label: "Pengiriman & Pengembalian", href: "/shipping-returns" },
    { label: "Garansi 30 Hari", href: "/warranty" },
    { label: "Hubungi Kami", href: "/contact" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "/privacy-policy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <picture>
                <source srcSet="/logo-footer.webp" type="image/webp" />
                <img src="/logo-footer-opt.png" alt="BeliSeken.com - Jual Beli Elektronik Bekas" className="h-12 w-auto" loading="lazy" decoding="async" width="200" height="60" />
              </picture>
            </Link>
            <p className="text-white/60 text-sm mb-4">
              Jual beli elektronik bekas premium di Bekasi. Garansi 30 hari, pengiriman aman.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/beliseken1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61593794008221" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/6285101256123" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Categories with Icons */}
          <div>
            <h3 className="font-bold text-white mb-4">Kategori</h3>
            <ul className="space-y-3">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.icon} alt="" className="w-5 h-5 brightness-0 invert opacity-80" aria-hidden="true" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 BeliSeken.com. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span>Griyaasri 2 Blok H6 No 30, Tambun Selatan, Bekasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
