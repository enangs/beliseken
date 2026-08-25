"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";
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
    
    // Fetch product with images from API
    fetch(`/api/admin/products?id=${id}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const p = data.data;
          // Extract images from product_images table
          const imageUrls = p.images?.map((img: any) => img.url) || [];
          const mainImage = imageUrls.length > 0 ? imageUrls[0] : p.imageBase64;
          
          setProduct({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            description: p.description || "",
            category: p.category?.name || "",
            subcategoryId: p.categoryId || "",
            subcategory: p.subcategory?.name || "",
            brandId: p.brandId || "",
            brand: p.brand?.name || "",
            price: p.sellingPrice || 0,
            originalPrice: p.basePrice || p.sellingPrice || 0,
            discount: p.discount || 0,
            stock: p._count?.units || 0,
            weight: p.weight,
            dimensions: p.dimensions,
            badge: p.badge,
            imageBase64: mainImage,
            images: imageUrls, // All images including main
            specs: p.specs?.map((s: any) => `${s.key}: ${s.value}`) || [],
            rating: p.avgRating || 0,
            reviewCount: p.reviewCount || 0,
            status: p.isActive ? "ACTIVE" : "SOLD_OUT",
            supplier: "",
            condition: "Grade A",
          });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      // Send ALL images to API
      const result = await updateProduct(id, {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        sellingPrice: data.price,
        originalPrice: data.originalPrice,
        weight: data.weight,
        dimensions: data.dimensions,
        badge: data.badge,
        imageBase64: data.imageBase64,
        images: data.images, // Send ALL images array!
        specs: data.specs,
        stock: data.stock,
        condition: data.condition,
        status: data.status,
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
        <div className="text-4xl mb-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-brand-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
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
