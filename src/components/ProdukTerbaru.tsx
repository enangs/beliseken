"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function ProdukTerbaru() {
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    fetchProductsAPI({ sort: "newest", limit: 50 })
      .then((res) => {
        if (res?.data) {
          const available = res.data.filter((p: ProductResponse) => p.stock > 0);
          const soldOut = res.data.filter((p: ProductResponse) => p.stock === 0);
          setAllProducts([...available, ...soldOut]);
        }
      })
      .catch(() => {});
  }, []);

  // New products (just added)
  const newProducts = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // Best sellers (most sold, with stock)
  const bestSellers = [...allProducts]
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);

  // Regular products (rest of available products)
  const regularProducts = [...allProducts]
    .filter((p) => p.stock > 0)
    .slice(0, 8);

  if (allProducts.length === 0) return null;

  return (
    <>
      {/* Section 1: Produk Baru Ditambahkan */}
      {newProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🆕</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Baru Ditambahkan</h2>
                </div>
                <p className="text-brand-muted text-sm">Produk segar yang baru saja masuk ke katalog kami</p>
              </div>
              <Link href="/products?sort=newest" className="text-brand font-semibold hover:text-brand-dark transition-colors mt-3 sm:mt-0 text-sm">
                Semua Produk Baru →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Produk Paling Laris */}
      {bestSellers.length > 0 && (
        <section className="py-12 md:py-16 bg-brand-gray/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🔥</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Paling Laris</h2>
                </div>
                <p className="text-brand-muted text-sm">Produk terlaris yang paling banyak dibeli pelanggan</p>
              </div>
              <Link href="/products?sort=bestselling" className="text-brand font-semibold hover:text-brand-dark transition-colors mt-3 sm:mt-0 text-sm">
                Semua Produk Terlaris →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {bestSellers.map((product) => (
                <ProductCard key={`best-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Semua Produk */}
      {regularProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🛒</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Semua Produk</h2>
                </div>
                <p className="text-brand-muted text-sm">Jelajahi semua produk elektronik bekas berkualitas</p>
              </div>
              <Link href="/products" className="text-brand font-semibold hover:text-brand-dark transition-colors mt-3 sm:mt-0 text-sm">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {regularProducts.map((product) => (
                <ProductCard key={`reg-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
