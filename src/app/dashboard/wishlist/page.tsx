"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts as fetchProductsAPI, type ProductResponse } from "@/lib/api";

export default function WishlistPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);

  useEffect(() => {
    fetchProductsAPI({ badge: "HOT DEAL", limit: 4 })
      .then((res) => { if (res?.data) setProducts(res.data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-brand-navy mb-6">Wishlist Saya</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Wishlist Kosong</h3>
              <p className="text-brand-muted mb-4">Belum ada produk yang disimpan.</p>
              <Link href="/products" className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                Jelajahi Produk
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
