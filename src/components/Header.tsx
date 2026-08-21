"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Heart,
  Package,
  Settings,
} from "lucide-react";
import { categories, storeInfo } from "@/data/products";
import { useCart } from "@/lib/cart";
import { getCurrentUser, logoutUser, type User as UserType } from "@/lib/user-auth";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isKatalogHovered, setIsKatalogHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    setUser(getCurrentUser());
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg h-16"
          : "bg-white/95 backdrop-blur-sm h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="BeliSeken.com — Jual Beli Elektronik Bekas Premium"
              width={160}
              height={60}
              className={`transition-all duration-300 object-contain ${
                isScrolled ? "h-10 w-auto" : "h-14 w-auto"
              }`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand transition-colors rounded-lg hover:bg-brand/5"
            >
              Beranda
            </Link>

            {/* Katalog with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsKatalogHovered(true)}
              onMouseLeave={() => setIsKatalogHovered(false)}
            >
              <button className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand transition-colors rounded-lg hover:bg-brand/5 flex items-center gap-1">
                Katalog
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isKatalogHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mega Menu */}
              {isKatalogHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-white rounded-2xl shadow-2xl border border-brand-border p-6 mt-2 animate-fade-in-up">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-bold text-brand-navy mb-3 text-sm">
                        💻 LAPTOP & NOTEBOOK
                      </h4>
                      <ul className="space-y-2">
                        {["Laptop Gaming", "Laptop Kantor", "Ultrabook", "MacBook"].map(
                          (item) => (
                            <li key={item}>
                              <Link
                                href={`/category/laptop-notebook`}
                                className="text-sm text-brand-muted hover:text-brand transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy mb-3 text-sm">
                        📱 SMARTPHONE & TABLET
                      </h4>
                      <ul className="space-y-2">
                        {["Android", "iPhone", "Tablet", "HP Feature"].map(
                          (item) => (
                            <li key={item}>
                              <Link
                                href={`/category/smartphone-tablet`}
                                className="text-sm text-brand-muted hover:text-brand transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy mb-3 text-sm">
                        🌐 NETWORKING & IT
                      </h4>
                      <ul className="space-y-2">
                        {["Router & Modem", "Switch & Hub", "Access Point", "Kabel Jaringan"].map(
                          (item) => (
                            <li key={item}>
                              <Link
                                href={`/category/networking-it`}
                                className="text-sm text-brand-muted hover:text-brand transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
                    <div className="grid grid-cols-3 gap-6 w-full">
                      <div>
                        <h4 className="font-bold text-brand-navy mb-3 text-sm">
                          🖥️ MONITOR & TV
                        </h4>
                        <ul className="space-y-2">
                          {["Monitor Gaming", "Monitor Kantor", "TV LED/Smart"].map(
                            (item) => (
                              <li key={item}>
                                <Link
                                  href={`/category/monitor-tv`}
                                  className="text-sm text-brand-muted hover:text-brand transition-colors"
                                >
                                  {item}
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy mb-3 text-sm">
                          ⌨️ PERIPHERAL
                        </h4>
                        <ul className="space-y-2">
                          {["Keyboard & Mouse", "Headset & Speaker", "Kamera & Webcam"].map(
                            (item) => (
                              <li key={item}>
                                <Link
                                  href={`/category/peripheral-aksesoris`}
                                  className="text-sm text-brand-muted hover:text-brand transition-colors"
                                >
                                  {item}
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-brand/10 to-brand-dark/10 rounded-xl p-4">
                        <p className="font-bold text-brand text-sm">🔥 PROMO MINGGUAN</p>
                        <p className="text-xs text-brand-muted mt-1">
                          Diskon hingga 40% untuk produk pilihan
                        </p>
                        <Link
                          href="/products"
                          className="inline-block mt-2 text-xs font-semibold text-brand hover:underline"
                        >
                          Lihat Sekarang →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand transition-colors rounded-lg hover:bg-brand/5"
            >
              Tentang Kami
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand transition-colors rounded-lg hover:bg-brand/5"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-semibold text-brand-navy hover:text-brand transition-colors rounded-lg hover:bg-brand/5"
            >
              Kontak
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-semibold text-brand-muted hover:text-brand transition-colors rounded-lg hover:bg-brand/5 border-l border-brand-border pl-5 ml-1"
            >
              ⚙️ Admin
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <div
                className={`flex items-center bg-gray-100 rounded-xl transition-all duration-300 ${
                  isSearchOpen ? "w-64 shadow-lg ring-2 ring-brand/30" : "w-48"
                }`}
              >
                <Search size={16} className="ml-3 text-brand-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari laptop, HP, monitor..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-brand-muted/60"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            </div>

            {/* Wishlist */}
            <Link
              href="/dashboard/wishlist"
              className="hidden sm:flex p-2 text-brand-navy hover:text-brand transition-colors"
            >
              <Heart size={20} />
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-brand-navy hover:text-brand transition-colors">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Cart */}
            <Link
              href="/dashboard/cart"
              className="relative p-2 text-brand-navy hover:text-brand transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth: Show profile if logged in, else show Masuk/Daftar */}
            {user ? (
              <div className="hidden sm:flex items-center relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-gray transition-colors"
                >
                  <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-brand-navy max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-brand-muted transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-brand-border py-2 z-50 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-brand-border">
                        <p className="font-semibold text-brand-navy text-sm truncate">{user.name}</p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-gray transition-colors"
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-gray transition-colors"
                      >
                        <Package size={16} />
                        Pesanan Saya
                      </Link>
                      <Link
                        href="/dashboard/cart"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-gray transition-colors"
                      >
                        <ShoppingCart size={16} />
                        Keranjang
                      </Link>
                      <div className="border-t border-brand-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                        >
                          <LogOut size={16} />
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-brand-navy border border-brand-border rounded-lg hover:border-brand hover:text-brand transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-dark rounded-lg transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-brand-navy"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-border shadow-xl">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-xl">
              <Search size={16} className="ml-3 text-brand-muted" />
              <input
                type="text"
                placeholder="Cari laptop, HP, monitor..."
                className="w-full bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>

            {user && (
              <div className="flex items-center gap-3 p-3 bg-brand/5 rounded-xl">
                <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-brand-navy text-sm">{user.name}</p>
                  <p className="text-xs text-brand-muted">{user.email}</p>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Katalog
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
            )}
            <Link
              href="/about"
              className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-3 text-sm font-semibold text-brand-muted hover:bg-brand/5 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ⚙️ Admin Panel
            </Link>

            <div className="pt-3 border-t border-brand-border">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-lg text-center hover:bg-red-100 transition-colors"
                >
                  Keluar
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 px-4 py-3 text-sm font-semibold text-brand-navy border border-brand-border rounded-lg text-center hover:border-brand"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-brand hover:bg-brand-dark rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
