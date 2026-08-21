"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getProductBySlug, storeInfo } from "@/data/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/data/products";

export default function ProductClient({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setProduct(getProductBySlug(slug));
    setAllProducts(getProducts());
    setLoaded(true);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">Produk Tidak Ditemukan</h1>
            <p className="text-brand-muted mb-6">Produk yang Anda cari tidak tersedia atau sudah habis.</p>
            <Link href="/products" className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors">
              Lihat Semua Produk
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-brand-muted mb-6">
            <Link href="/" className="hover:text-brand">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-brand">Produk</Link>
            <ChevronRight size={14} />
            <Link href={`/category/${product.category.toLowerCase().replace(/ & /g, "-")}`} className="hover:text-brand">
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-brand-navy font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="bg-brand-gray rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
                {product.imageBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageBase64} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-8xl opacity-20">📦</div>
                )}
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-lg ${
                    product.badge === "HOT DEAL" ? "bg-brand text-white" :
                    product.badge === "BEST SELLER" ? "bg-amber-500 text-white" :
                    "bg-emerald-500 text-white"
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-brand-gray rounded-xl aspect-square flex items-center justify-center border-2 border-brand-border hover:border-brand cursor-pointer transition-colors">
                    {product.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageBase64} alt={`${product.name} ${i}`} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-2xl opacity-30">📷</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-brand bg-brand/10 px-3 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-brand-navy mt-4 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm text-brand-muted">{product.rating}/5 ({product.reviewCount} ulasan)</span>
              </div>

              <div className="bg-brand/5 rounded-xl p-5 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-brand">{formatPrice(product.price)}</span>
                  <span className="text-lg text-brand-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-brand text-white text-sm font-bold px-2 py-1 rounded-md">-{product.discount}%</span>
                </div>
                <p className="text-sm text-brand-muted mt-1">Hemat {formatPrice(product.originalPrice - product.price)}</p>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-brand-navy mb-2">Deskripsi</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-2">Kondisi</h3>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-200">
                  ✅ {product.condition}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-3">Spesifikasi</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-brand-muted">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-2">Jumlah</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-brand-border rounded-lg flex items-center justify-center hover:bg-gray-100">
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-brand-border rounded-lg flex items-center justify-center hover:bg-gray-100">
                    <Plus size={16} />
                  </button>
                  <span className="text-sm text-brand-muted ml-2">Stok: 1 unit</span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-xl transition-colors ${added ? "bg-emerald-500 text-white" : "bg-brand hover:bg-brand-dark text-white"}`}
                >
                  <ShoppingCart size={20} />
                  {added ? "Ditambahkan!" : "Tambah ke Keranjang"}
                </button>
                <button className="w-14 h-14 border-2 border-brand-border rounded-xl flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                  <Heart size={20} />
                </button>
                <button className="w-14 h-14 border-2 border-brand-border rounded-xl flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              <a
                href={`${storeInfo.whatsappLink}?text=Halo, saya tertarik dengan ${product.name} seharga ${formatPrice(product.price)}. Apakah masih tersedia?`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center transition-colors mb-6"
              >
                💬 Beli via WhatsApp
              </a>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, text: "Garansi 30 Hari", color: "#10b981" },
                  { icon: Truck, text: "Pengiriman Instan", color: "#3b82f6" },
                  { icon: RotateCcw, text: "Retur 7 Hari", color: "#f59e0b" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-brand-gray rounded-xl text-center">
                    <badge.icon size={20} style={{ color: badge.color }} />
                    <span className="text-xs font-semibold text-brand-navy">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {allProducts.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] bg-brand-gray flex items-center justify-center overflow-hidden">
                    {p.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageBase64} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-4xl opacity-20">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-navy text-sm group-hover:text-brand transition-colors line-clamp-2">{p.name}</h3>
                    <p className="text-brand font-bold mt-2">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
