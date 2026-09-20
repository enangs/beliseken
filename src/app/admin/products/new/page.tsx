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
      // Guard: payload terlalu besar → Vercel menolak dengan halaman HTML non-JSON
      // yang membuat res.json() melempar "The string did not match the expected pattern" di Safari
      const payloadSize = JSON.stringify(data).length;
      if (payloadSize > 4_000_000) {
        setError(
          `Data terlalu besar (${(payloadSize / 1_000_000).toFixed(1)} MB). ` +
          "Foto yang belum ter-upload ke Cloudinary dikirim sebagai base64 dan melebihi batas server. " +
          "Hapus foto yang gagal lalu upload ulang (pastikan muncul thumbnail Cloudinary)."
        );
        setSaving(false);
        return;
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      // Defensive parse: jangan langsung res.json() — respons bisa berupa HTML error page
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", res.status, text.slice(0, 200));
        setError(
          `Server mengembalikan respons tidak valid (HTTP ${res.status}). ` +
          (res.status === 413
            ? "Payload terlalu besar — kemungkinan foto base64 melebihi batas 4.5MB Vercel."
            : "Coba lagi, atau cek log Vercel untuk detailnya.")
        );
        setSaving(false);
        return;
      }
      const result = await res.json();
      if (result.success) {
        alert('✅ Produk berhasil ditambahkan!');
        router.push("/admin/products");
      } else {
        setError(result.error || "Gagal menyimpan produk");
      }
    } catch (err: any) {
      console.error('Submit error:', err);
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
