"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct } from "@/data/products";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/data/products";

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const p = getProductById(id);
    if (p) setProduct(p);
    else setNotFound(true);
  }, [id]);

  const handleSubmit = (data: Omit<Product, "id"> & { id?: string }) => {
    if (data.id) updateProduct(data.id, data);
    router.push("/admin/products");
  };

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-brand-navy font-semibold text-lg">Produk tidak ditemukan</p>
        <button onClick={() => router.push("/admin/products")} className="mt-4 text-brand hover:text-brand-dark font-medium text-sm">
          ← Kembali ke daftar produk
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Edit Produk</h1>
        <p className="text-brand-muted text-sm mt-1">
          Mengedit: <span className="font-semibold text-brand-navy">{product.name}</span>
        </p>
      </div>
      <ProductForm initialData={product} onSubmit={handleSubmit} submitLabel="Simpan Perubahan" />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto" /></div>}>
      <EditProductContent />
    </Suspense>
  );
}
