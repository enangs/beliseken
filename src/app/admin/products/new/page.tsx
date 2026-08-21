"use client";

import { useRouter } from "next/navigation";
import { addProduct } from "@/data/products";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/data/products";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = (data: Omit<Product, "id">) => {
    addProduct(data);
    router.push("/admin/products");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Tambah Produk Baru</h1>
        <p className="text-brand-muted text-sm mt-1">
          Upload foto dan isi detail produk untuk ditampilkan di katalog.
        </p>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="Tambah Produk" />
    </div>
  );
}
