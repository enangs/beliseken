"use client";

import { useState, useEffect, useRef } from "react";
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

// Category icon mapping
const categoryIconMap: Record<string, string> = {
  "Laptop & Notebook": "/icons/laptop.svg",
  "Smartphone & Tablet": "/icons/device-mobile.svg",
  "Monitor & TV": "/icons/monitor.svg",
  "Networking & IT": "/icons/network.svg",
  "Peripheral & Aksesoris": "/icons/circuitry.svg",
};

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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

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
              <Link href="/how-to-buy" className="text-white/70 hover:text-white transition-colors">Cara Beli</Link>
              <Link href="/dashboard/orders" className="text-white/70 hover:text-white transition-colors">Lacak Pesanan</Link>
              <Link href="/warranty" className="text-white/70 hover:text-white transition-colors">Garansi</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="BeliSeken" className="h-12 w-auto" />
            </Link>

            {/* Kategori Dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsKategoriOpen(!isKategoriOpen)}
                onMouseEnter={() => setIsKategoriOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-brand rounded-xl hover:bg-brand/5 transition-colors"
              >
                <Menu size={18} className="text-brand" />
                <span className="font-semibold text-brand-navy text-sm">Kategori</span>
              </button>

              {isKategoriOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-brand-border py-2 z-50"
                  onMouseLeave={() => setIsKategoriOpen(false)}
                >
                  {categories.map((cat) => {
                    const icon = categoryIconMap[cat.name] || "/icons/lightbulb.svg";
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors"
                        onClick={() => setIsKategoriOpen(false)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={icon} alt="" className="w-6 h-6" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-brand-navy">{cat.name}</p>
                          <p className="text-xs text-brand-muted">{cat.itemCount} produk</p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="border-t border-brand-border mt-2 pt-2 px-4">
                    <Link href="/products" className="text-sm font-semibold text-brand hover:text-brand-dark" onClick={() => setIsKategoriOpen(false)}>
                      Lihat Semua Produk →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden lg:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className={`flex items-center bg-gray-100 rounded-xl transition-all duration-200 ${isSearchFocused ? "ring-2 ring-brand/30 bg-white shadow-lg" : ""}`}
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
                <button type="submit" className="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl mr-1 transition-colors">Cari</button>
              </form>
            </div>

            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-brand/5 transition-colors"
              aria-label="Buka pencarian"
            >
              <Search size={20} className="text-brand-navy" />
            </button>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Link href="/dashboard/cart" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand/5 transition-colors relative">
                <ShoppingCart size={20} className="text-brand-navy" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand/5 transition-colors">
                    <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">{user.name?.charAt(0) || "U"}</div>
                    <span className="text-sm font-medium text-brand-navy hidden md:block">{user.name?.split(" ")[0]}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-2xl border border-brand-border py-2 z-50">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Package size={16} className="text-brand-muted" />
                        <span className="text-sm text-brand-navy">Dashboard</span>
                      </Link>
                      <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand/5 transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Package size={16} className="text-brand-muted" />
                        <span className="text-sm text-brand-navy">Pesanan Saya</span>
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
                        <LogOut size={16} className="text-red-500" />
                        <span className="text-sm text-red-500">Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors text-sm font-semibold">
                  <User size={16} />
                  <span className="hidden md:block">Masuk / Daftar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border">
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setMobileSearchQuery("");
              }}
              className="flex-shrink-0 p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tutup pencarian"
            >
              <X size={20} className="text-brand-navy" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mobileSearchQuery.trim()) {
                  setIsMobileSearchOpen(false);
                  router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
                }
              }}
              className="flex-1 flex items-center bg-gray-100 rounded-xl"
            >
              <Search size={18} className="ml-4 text-brand-muted flex-shrink-0" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Cari laptop, HP, monitor..."
                className="w-full px-4 py-3 text-sm outline-none bg-transparent text-brand-navy placeholder:text-brand-muted/60"
              />
              {mobileSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMobileSearchQuery("")}
                  className="p-2 mr-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={16} className="text-brand-muted" />
                </button>
              )}
              <button type="submit" className="px-5 py-3 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl mr-1 transition-colors">Cari</button>
            </form>
          </div>
          {/* Quick suggestions */}
          <div className="p-4">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">Pencarian Populer</p>
            <div className="flex flex-wrap gap-2">
              {["Laptop", "iPhone", "Samsung", "iPad", "Monitor", "Router"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setIsMobileSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-brand/10 text-sm font-medium text-brand-navy rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
