"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, Heart, CreditCard, Star, Settings, LogOut, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser, logoutUser, type User as UserType } from "@/lib/auth-api";
import { getUserOrders } from "@/lib/orders";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();
  const [orderStats, setOrderStats] = useState({ total: 0, processing: 0, completed: 0, totalSpent: 0 });

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
    if (!u) {
      router.replace("/login");
      return;
    }

    // Calculate real stats
    const orders = getUserOrders();
    const total = orders.length;
    const processing = orders.filter((o) => ["paid", "processing", "shipping"].includes(o.status)).length;
    const completed = orders.filter((o) => ["completed", "delivered"].includes(o.status)).length;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    setOrderStats({ total, processing, completed, totalSpent });
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
        </main>
      </>
    );
  }

  const menuItems = [
    { icon: Package, label: "Pesanan Saya", href: "/dashboard/orders", count: orderStats.total },
    { icon: ShoppingCart, label: "Keranjang", href: "/dashboard/cart", count: totalItems },
    { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
    { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-brand-navy">{user.name} 👋</h1>
                <p className="text-brand-muted">{user.email}</p>
                <p className="text-sm text-brand-muted mt-1">
                  {user.phone && `📱 ${user.phone}`}
                  {user.phone && user.city && " · "}
                  {user.city && `📍 ${user.city}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/dashboard/orders" className="px-4 py-2 bg-brand/10 text-brand font-semibold text-sm rounded-lg hover:bg-brand/20 transition-colors">
                  Lihat Pesanan
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-red-500 border border-red-200 font-semibold text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
                  <LogOut size={14} />
                  Keluar
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Pesanan", value: String(orderStats.total), color: "#3b82f6" },
              { label: "Dalam Proses", value: String(orderStats.processing), color: "#f59e0b" },
              { label: "Selesai", value: String(orderStats.completed), color: "#10b981" },
              { label: "Total Pengeluaran", value: formatPrice(orderStats.totalSpent), color: "#e94560" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-brand-border p-5">
                <p className="text-sm text-brand-muted">{stat.label}</p>
                <p className="text-2xl font-extrabold mt-1" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-border hover:border-brand hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                  <item.icon size={22} className="text-brand" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy">{item.label}</h3>
                  {item.count !== undefined && <p className="text-xs text-brand-muted">{item.count} item</p>}
                </div>
                <span className="text-brand-muted">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
