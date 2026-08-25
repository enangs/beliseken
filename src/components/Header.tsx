"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Heart,
  MapPin,
  Clock,
  Package,
  Settings,
} from "lucide-react";
import { getCategories, type CategoryResponse } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { getCurrentUser, logoutUser, type User as UserType } from "@/lib/auth-api";

const storeInfo = {
  phoneFormatted: '0851-0125-6123',
  operatingHours: 'Senin - Sabtu, 09:00 - 18:00 WIB',
};

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isKategoriOpen, setIsKategoriOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    setUser(getCurrentUser());
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
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
    <>
      {/* Top Info Bar */}
      <div className="bg-brand-navy text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-brand" />
                <span className="font-semibold">Bekasi</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-white/60" />
                <span className="text-white/70">Senin - Sabtu, 09:00 - 18:00 WIB</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/how-to-buy" className="text-white/70 hover:text-white transition-colors">
                Cara Beli
              </Link>
              <Link href="/dashboard/orders" className="text-white/70 hover:text-white transition-colors">
                Lacak Pesanan
              </Link>
              <Link href="/warranty" className="text-white/70 hover:text-white transition-colors">
                Garansi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="BeliSeken.com"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Kategori Button */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsKategoriOpen(!isKategoriOpen)}
                onMouseEnter={() => setIsKategoriOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-brand rounded-xl hover:bg-brand/5 transition-colors"
              >
                <Menu size={18} className="text-brand" />
                <span className="font-semibold text-brand-navy text-sm">Kategori</span>
              </button>

              {/* Kategori Dropdown */}
              {isKategoriOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-brand-border py-2 z-50"
                  onMouseLeave={() => setIsKategoriOpen(false)}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors"
                      onClick={() => setIsKategoriOpen(false)}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">{cat.name}</p>
                        <p className="text-xs text-brand-muted">{cat.itemCount} produk</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-brand-border mt-2 pt-2 px-4">
                    <Link
                      href="/products"
                      className="text-sm font-semibold text-brand hover:text-brand-dark"
                      onClick={() => setIsKategoriOpen(false)}
                    >
                      Lihat Semua Produk →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className={`flex items-center bg-gray-100 rounded-xl transition-all duration-200 ${
                  isSearchFocused ? "ring-2 ring-brand/30 bg-white shadow-lg" : ""
                }`}
              >
                <Search size={18} className="ml-4 text-brand-muted flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari laptop, HP, monitor, router..."
                  className="w-full px-4 py-3 text-sm outline-none bg-transparent text-brand-navy placeholder:text-brand-muted/60"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button type="submit" className="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl mr-1 transition-colors">
                  Cari
                </button>
              </form>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                href="/dashboard/cart"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand/5 transition-colors relative"
              >
                <ShoppingCart size={20} className="text-brand-navy" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="hidden sm:block text-xs font-semibold text-brand-navy">
                  Keranjang
                </span>
              </Link>

              {/* Profile / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-brand-navy max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className={`text-brand-muted transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-brand-border py-2 z-50">
                        <div className="px-4 py-3 border-b border-brand-border">
                          <p className="font-semibold text-brand-navy text-sm truncate">{user.name}</p>
                          <p className="text-xs text-brand-muted truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand/5">
                          <User size={16} className="text-brand-muted" /> Dashboard
                        </Link>
                        <Link href="/dashboard/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand/5">
                          <Package size={16} className="text-brand-muted" /> Pesanan
                        </Link>
                        <div className="border-t border-brand-border mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full">
                            <LogOut size={16} /> Keluar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-brand text-brand font-semibold text-sm rounded-xl hover:bg-brand hover:text-white transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:block">Masuk / Daftar</span>
                </Link>
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
          <div className="lg:hidden bg-white border-t border-brand-border shadow-xl max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    setIsMobileMenuOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="flex items-center bg-gray-100 rounded-xl"
              >
                <Search size={16} className="ml-3 text-brand-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari laptop, HP, monitor..."
              aria-label="Cari produk"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
                <button type="submit" className="px-4 py-3 text-sm font-semibold text-brand">
                  Cari
                </button>
              </form>

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

              <div className="pt-2">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider px-4 mb-2">Kategori</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-semibold text-brand-navy">{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-brand-border pt-2 mt-2">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider px-4 mb-2">Menu</p>
                <Link href="/" className="block px-4 py-2.5 text-sm font-semibold hover:bg-brand/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                <Link href="/products" className="block px-4 py-2.5 text-sm font-semibold hover:bg-brand/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Semua Produk</Link>
                <Link href="/about" className="block px-4 py-2.5 text-sm font-semibold hover:bg-brand/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Tentang Kami</Link>
                <Link href="/blog" className="block px-4 py-2.5 text-sm font-semibold hover:bg-brand/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                <Link href="/contact" className="block px-4 py-2.5 text-sm font-semibold hover:bg-brand/5 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
              </div>

              <div className="pt-3 border-t border-brand-border">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-lg"
                  >
                    Keluar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1 px-4 py-3 text-sm font-semibold text-brand-navy border border-brand-border rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                      Masuk
                    </Link>
                    <Link href="/register" className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-brand rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
