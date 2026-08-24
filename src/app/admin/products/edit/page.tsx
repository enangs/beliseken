"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/data/products";
import { Loader2 } from "lucide-react";

function EditProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    
    getProductById(id).then((p) => {
      if (p) {
        // Map API response to Product type for ProductForm
        setProduct({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          description: p.description || "",
          category: p.category?.name || "",
          subcategory: p.subcategory?.name || "",
          brand: p.brand?.name || "",
          price: p.sellingPrice || p.sellingPrice,
          originalPrice: p.originalPrice || p.sellingPrice,
          discount: p.discount || 0,
          stock: p.stock || p.availableUnits || 0,
          weight: p.weight,
          dimensions: p.dimensions,
          badge: p.badge,
          imageBase64: p.imageBase64,
          specs: p.specs?.map((s: any) => `${s.key}: ${s.value}`) || [],
          rating: p.avgRating || 0,
          reviewCount: p.reviewCount || 0,
          status: p.status || "ACTIVE",
          supplier: p.supplier || "",
          condition: p.condition || "Grade A",
        } as any);
      } else {
        setNotFound(true);
      }
    }).catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (data: Omit<Product, "id"> & { id?: string }) => {
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      const result = await updateProduct(id, {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        sellingPrice: data.price,
        originalPrice: data.originalPrice,
        discount: data.discount,
        weight: data.weight,
        dimensions: data.dimensions,
        badge: data.badge,
        imageBase64: data.imageBase64,
        specs: data.specs,
        stock: data.stock,
        supplier: data.supplier,
        condition: data.condition,
      });
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
        <p className="text-brand-muted text-sm mt-4">Memuat data produk...</p>
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}
      {saving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Menyimpan perubahan ke database...
        </div>
      )}
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
