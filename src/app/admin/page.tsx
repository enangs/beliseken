"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, Star, Eye, ShoppingCart, Users, Loader2 } from "lucide-react";
import { getAdminProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { fetchOrders } from "@/lib/orders-api";
import { getAllCustomers } from "@/lib/auth-api";
import type { Product } from "@/data/products";
import type { Order } from "@/lib/orders";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsRes = await getAdminProducts({ limit: 100 });
        if (productsRes?.data) setProducts(productsRes.data as any);
      } catch {}
      try {
        const ordersData = await fetchOrders({ admin: true });
        setOrders(ordersData);
      } catch {}
      setLoading(false);
    };
    loadData();
  }, []);

  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    getAllCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const soldOutCount = products.filter((p) => p.stock === 0).length;
  const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Total Pesanan",
      value: loading ? "..." : orders.length,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "Pendapatan",
      value: loading ? "..." : formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
    {
      label: "Total Produk",
      value: `${products.length} (${totalStock} stok)`,
      icon: Package,
      color: "bg-amber-500",
    },
    {
      label: "Total Pelanggan",
      value: customers.length,
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">Dashboard Admin</h1>
        <p className="text-brand-muted text-sm mt-1">
          Selamat datang kembali! Kelola toko BeliSeken.com dari sini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-brand-muted font-medium">{stat.label}</span>
              <div className={`w-9 h-9 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand-navy">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/products/new"
          className="bg-brand hover:bg-brand-dark text-white rounded-xl p-5 flex items-center gap-3 transition-colors"
        >
          <span className="text-2xl">➕</span>
          <div>
            <p className="font-semibold">Tambah Produk Baru</p>
            <p className="text-white/70 text-xs">Upload foto & isi detail</p>
          </div>
        </Link>
        <Link
          href="/admin/products"
          className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl p-5 flex items-center gap-3 transition-colors"
        >
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-semibold">Kelola Produk</p>
            <p className="text-white/70 text-xs">Edit, hapus, atau lihat produk</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-5 flex items-center gap-3 transition-colors"
        >
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold">Kelola Pesanan</p>
            <p className="text-white/70 text-xs">Lihat & update status pesanan</p>
          </div>
        </Link>
        <Link
          href="/admin/customers"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-5 flex items-center gap-3 transition-colors"
        >
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold">Pelanggan</p>
            <p className="text-white/70 text-xs">Data pelanggan & alamat</p>
          </div>
        </Link>
        <Link
          href="/admin/banners"
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-5 flex items-center gap-3 transition-colors"
        >
          <span className="text-2xl">🖼️</span>
          <div>
            <p className="font-semibold">Banner & Promo</p>
            <p className="text-white/70 text-xs">Kelola hero & kartu promo</p>
          </div>
        </Link>
        <Link
          href="/products"
          target="_blank"
          className="bg-white border border-brand-border hover:border-brand hover:shadow-md rounded-xl p-5 flex items-center gap-3 transition-all"
        >
          <span className="text-2xl">👁️</span>
          <div>
            <p className="font-semibold text-brand-navy">Lihat Website</p>
            <p className="text-brand-muted text-xs">Preview toko dari sisi pelanggan</p>
          </div>
        </Link>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-brand-border">
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-bold text-brand-navy">Produk Terbaru</h2>
          <Link href="/admin/products" className="text-sm text-brand hover:text-brand-dark transition-colors">
            Lihat Semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-muted border-b border-brand-border">
                <th className="px-5 py-3 font-medium">Nama Produk</th>
                <th className="px-5 py-3 font-medium">Harga</th>
                <th className="px-5 py-3 font-medium">Stok</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/50">
                  <td className="px-5 py-3 font-medium text-brand-navy">{product.name}</td>
                  <td className="px-5 py-3 text-brand font-semibold">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      product.stock === 0 ? "bg-red-100 text-red-600" :
                      product.stock <= 2 ? "bg-amber-100 text-amber-600" :
                      "bg-emerald-100 text-emerald-600"
                    }`}>
                      {product.stock} unit
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      product.stock === 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {product.stock === 0 ? "SOLD OUT" : "Aktif"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/edit?id=${product.id}`}
                      className="text-brand hover:text-brand-dark font-medium text-xs"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
