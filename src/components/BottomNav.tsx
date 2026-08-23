"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Grid3X3, ShoppingCart, User, Search } from "lucide-react";
import { useCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/user-auth";

const navItems = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/products", icon: Grid3X3, label: "Kategori" },
  { href: "/search", icon: Search, label: "Cari" },
  { href: "/dashboard/cart", icon: ShoppingCart, label: "Keranjang" },
  { href: "/dashboard", icon: User, label: "Akun" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const user = getCurrentUser();

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-brand-border safe-area-bottom lg:hidden">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors ${
                isActive
                  ? "text-brand"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {/* Cart badge */}
                {item.href === "/dashboard/cart" && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
                {/* User logged in indicator */}
                {item.href === "/dashboard" && user && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
