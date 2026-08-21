"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getProducts } from "@/data/products";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

export default function ProdukTerbaru() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🆕</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
                Baru Ditambahkan
              </h2>
            </div>
            <p className="text-brand-muted text-lg">
              Produk segar yang baru saja masuk ke katalog kami
            </p>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-brand font-semibold hover:text-brand-dark transition-colors mt-4 sm:mt-0"
          >
            Semua Produk Baru →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
