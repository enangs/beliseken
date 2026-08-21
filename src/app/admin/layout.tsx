"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  FileText,
  PenSquare,
  ShoppingBag,
} from "lucide-react";
import { getAdminUser, logoutAdmin } from "@/lib/auth";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Semua Produk", href: "/admin/products", icon: Package },
  { label: "Tambah Produk", href: "/admin/products/new", icon: PlusCircle },
  { label: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { label: "Semua Artikel", href: "/admin/blog", icon: FileText },
  { label: "Tulis Artikel", href: "/admin/blog/new", icon: PenSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getAdminUser>>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  // Allow login page to render without auth check
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    const u = getAdminUser();
    setUser(u);
    setChecking(false);
    if (!u) {
      router.replace("/admin/login");
    }
  }, [pathname, router, isLoginPage]);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  // Login page: no layout wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading / not authenticated
  if (checking || !user) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-muted text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-brand-navy text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="BeliSeken" className="h-8" />
            <span className="font-bold text-lg">
              beli<span className="text-brand">seken</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-3 bg-white/5 rounded-lg px-3 py-2">
            <Shield size={14} className="text-brand" />
            <span className="text-xs text-white/60">Admin Panel</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <link.icon size={18} />
                {link.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-brand-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-brand-gray rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Link href="/admin" className="hover:text-brand transition-colors">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight size={14} />
                <span className="text-brand-navy font-medium">
                  {pathname.includes("/products/new")
                    ? "Tambah Produk"
                    : pathname.includes("/blog/new")
                    ? "Tulis Artikel"
                    : pathname.includes("/blog/") && pathname.includes("edit")
                    ? "Edit Artikel"
                    : pathname === "/admin/blog"
                    ? "Semua Artikel"
                    : pathname === "/admin/orders"
                    ? "Pesanan"
                    : pathname.includes("/edit")
                    ? "Edit Produk"
                    : pathname === "/admin/products"
                    ? "Semua Produk"
                    : "Dashboard"}
                </span>
              </>
            )}
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-brand-muted hover:text-brand transition-colors border border-brand-border px-3 py-1.5 rounded-lg hover:bg-brand-gray"
          >
            Lihat Website ↗
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
