"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Package, Truck, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import { getAdminProducts, deleteProduct, type ProductResponse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadProducts = async () => {
    try {
      const res = await getAdminProducts({ limit: 100, search: search || undefined });
      setProducts(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (e) { console.error(e); }
    setDeleteConfirm(null);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      loadProducts();
    } catch (e) { console.error(e); }
  };

  const filtered = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.supplier || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "active") return p.stock > 0;
      if (filterStatus === "low") return p.stock > 0 && p.stock <= 2;
      if (filterStatus === "sold_out") return p.stock === 0;
      return true;
    });

  const stats = {
    total: products.length,
    active: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 2).length,
    soldOut: products.filter(p => p.stock === 0).length,
    totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Manajemen Produk & Inventori</h1>
          <p className="text-brand-muted text-sm mt-1">
            {stats.total} produk · {stats.totalStock} unit stok
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          Tambah Produk
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-brand-muted">Total Produk</p>
              <p className="text-xl font-bold text-brand-navy">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-brand-muted">Aktif</p>
              <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-brand-muted">Stok Menipis</p>
              <p className="text-xl font-bold text-amber-600">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Truck size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-brand-muted">Sold Out</p>
              <p className="text-xl font-bold text-red-600">{stats.soldOut}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-brand-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk, brand, supplier..."
              className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "Semua" },
              { value: "active", label: "Aktif" },
              { value: "low", label: "Stok ≤2" },
              { value: "sold_out", label: "Sold Out" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  filterStatus === opt.value
                    ? "bg-brand text-white"
                    : "bg-brand-gray text-brand-navy hover:bg-brand/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-muted bg-brand-gray border-b border-brand-border">
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium text-center">Stok</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30 transition-colors">
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-brand-navy/10 text-brand-navy text-xs font-mono font-bold rounded">
                      {product.sku || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-brand-muted"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-navy truncate max-w-[200px]">{product.name}</p>
                        <p className="text-xs text-brand-muted">{product.brand?.name || '-'} · {product.category?.name || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-brand">{formatPrice(product.sellingPrice)}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-red-500">-{product.discount}%</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : product.stock <= 2
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Truck size={12} className="text-brand-muted flex-shrink-0" />
                      <span className="text-xs text-brand-muted truncate max-w-[120px]">
                        {product.supplier || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleActive(product.id, product.stock > 0)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-colors hover:bg-gray-100"
                      title={product.stock > 0 ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {product.stock > 0 ? (
                        <><ToggleRight size={22} className="text-emerald-500" /><span className="text-emerald-600">Aktif</span></>
                      ) : (
                        <><ToggleLeft size={22} className="text-red-400" /><span className="text-red-500">Nonaktif</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="p-2 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-brand-muted">
                    <div className="text-lg mb-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mx-auto text-brand-muted"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
                    <p>Tidak ada produk ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
