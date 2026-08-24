"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/data/products";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: Omit<Product, "id">) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || "Gagal menyimpan produk");
      }
    } catch (err: any) {
      setError("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Tambah Produk Baru</h1>
        <p className="text-brand-muted text-sm mt-1">
          Upload foto dan isi detail produk untuk ditampilkan di katalog.
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}
      {saving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Menyimpan ke database...
        </div>
      )}
      <ProductForm onSubmit={handleSubmit} submitLabel="Tambah Produk" />
    </div>
  );
}
