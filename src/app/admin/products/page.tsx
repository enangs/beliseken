"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAdminProducts, deleteProduct } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Semua Produk</h1>
          <p className="text-brand-muted text-sm mt-1">
            {products.length} produk total
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

      {/* Search */}
      <div className="bg-white rounded-xl border border-brand-border p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-muted bg-brand-gray border-b border-brand-border">
                <th className="px-5 py-3 font-medium">Produk</th>
                <th className="px-5 py-3 font-medium">Harga</th>
                <th className="px-5 py-3 font-medium">Diskon</th>
                <th className="px-5 py-3 font-medium">Kondisi</th>
                <th className="px-5 py-3 font-medium">Badge</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        📦
                      </div>
                      <div>
                        <p className="font-semibold text-brand-navy">{product.name}</p>
                        <p className="text-xs text-brand-muted">{product.brand?.name || '-'} · {product.category?.name || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-brand">{formatPrice(product.sellingPrice)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs font-bold rounded-full">
                      -{product.discount}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
                      {product.badge || 'Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {product.badge ? (
                      <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-brand-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
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
                  <td colSpan={6} className="px-5 py-12 text-center text-brand-muted">
                    <p className="text-lg mb-2">📦</p>
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
