"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug as fetchProductBySlug, getProducts as fetchProductsAPI, type ProductDetailResponse, type ProductResponse } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

const storeInfo = {
  whatsappLink: 'https://wa.me/6285101256123',
};

export default function ProductClient({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductDetailResponse | undefined>(undefined);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductBySlug(slug)
      .then((res) => { if (res?.data) setProduct(res.data); setLoaded(true); })
      .catch(() => setLoaded(true));
    fetchProductsAPI({ limit: 4 })
      .then((res) => { if (res?.data) setAllProducts(res.data); })
      .catch(() => {});
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: typeof product.category === 'string' ? product.category : (product.category?.name || ''),
      subcategory: product.subcategory?.name || '',
      brand: product.brand?.name || '',
      price: product.sellingPrice,
      originalPrice: product.sellingPrice,
      discount: product.discount,
      rating: product.avgRating,
      reviewCount: product.reviewCount,
      condition: product.units?.[0]?.conditionGrade?.name || 'Grade A',
      badge: product.badge as "HOT DEAL" | "BEST SELLER" | "NEW" | undefined,
      image: '',
      specs: (product.specs || []).map((s: any) => `${s.key}: ${s.value}`),
      weight: product.weight || undefined,
      dimensions: product.dimensions || undefined,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const categoryName = typeof product?.category === 'string' 
    ? product.category 
    : (product?.category as any)?.name || '';
  const categorySlug = typeof product?.category === 'string'
    ? product.category.toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9-]/g, '')
    : (product?.category as any)?.slug || '';

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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
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
            {categoryName && (
              <>
                <Link href={`/category/${categorySlug}`} className="hover:text-brand">
                  {categoryName}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-brand-navy font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              {/* Main Image */}
              <div className="bg-brand-gray rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
                {product.allImages && product.allImages.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.allImages[selectedImage] || product.allImages[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-400">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
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
              {/* Thumbnails */}
              {product.allImages && product.allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {product.allImages.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`bg-brand-gray rounded-lg aspect-square flex items-center justify-center border-2 overflow-hidden transition-colors ${
                        selectedImage === i ? "border-brand ring-1 ring-brand/30" : "border-brand-border hover:border-brand/50"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-sm font-semibold text-brand bg-brand/10 px-3 py-1 rounded-md">
                {categoryName}
              </span>
              <h1 className="text-3xl font-bold text-brand-navy mt-4 mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-brand-navy/10 text-brand-navy text-xs font-mono font-bold rounded">
                  SKU: {product.sku || '-'}
                </span>
                {product.brand && (
                  <span className="px-2.5 py-1 bg-gray-100 text-brand-navy text-xs font-semibold rounded">
                    {product.brand?.name || product.brand}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm text-brand-muted">{product.avgRating}/5 ({product.reviewCount} ulasan)</span>
              </div>

              <div className="bg-brand/5 rounded-xl p-5 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-brand">{formatPrice(product.sellingPrice)}</span>
                  <span className="text-lg text-brand-muted line-through">{formatPrice(product.sellingPrice * (1 + product.discount / 100))}</span>
                  <span className="bg-brand text-white text-sm font-bold px-2 py-1 rounded-md">-{product.discount}%</span>
                </div>
                <p className="text-sm text-brand-muted mt-1">Hemat {formatPrice(Math.round(product.sellingPrice * product.discount / 100))}</p>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-brand-navy mb-2">Deskripsi</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-2">Kondisi</h3>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-200 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {product.units?.[0]?.conditionGrade?.name || product.badge || 'Grade A'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-3">Spesifikasi</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(product.specs || []).map((spec: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-brand-muted">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0" />
                      {spec.value || spec}
                    </div>
                  ))}
                </div>
              </div>

              {(product.weight || product.dimensions) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    Informasi Pengiriman
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.weight && (
                      <div className="bg-brand-gray rounded-lg p-3">
                        <p className="text-xs text-brand-muted">Berat</p>
                        <p className="font-semibold text-brand-navy">{product.weight >= 1000 ? `${(product.weight / 1000).toFixed(1)} kg` : `${product.weight} gram`}</p>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="bg-brand-gray rounded-lg p-3">
                        <p className="text-xs text-brand-muted">Dimensi (PxLxT)</p>
                        <p className="font-semibold text-brand-navy">{product.dimensions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                  <span className={`text-sm font-semibold ml-2 ${
                    product.stock === 0 ? "text-red-500" : product.stock <= 2 ? "text-amber-600" : "text-brand-muted"
                  }`}>
                    Stok: {product.stock} unit
                    {product.stock <= 2 && product.stock > 0 && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline ml-1 text-amber-500">
                        <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                {product.stock === 0 ? (
                  <div className="flex-1 py-4 bg-red-100 text-red-600 font-bold rounded-xl text-center flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    SOLD OUT - Stok Habis
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-xl transition-colors ${added ? "bg-emerald-500 text-white" : "bg-brand hover:bg-brand-dark text-white"}`}
                  >
                    <ShoppingCart size={20} />
                    {added ? "Ditambahkan!" : "Tambah ke Keranjang"}
                  </button>
                )}
                <button className="w-14 h-14 border-2 border-brand-border rounded-xl flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                  <Heart size={20} />
                </button>
                <button className="w-14 h-14 border-2 border-brand-border rounded-xl flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              <a
                href={`${storeInfo.whatsappLink}?text=Halo, saya tertarik dengan ${product.name} seharga ${formatPrice(product.sellingPrice)}. Apakah masih tersedia?`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center transition-colors mb-6 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Beli via WhatsApp
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
                    
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-navy text-sm group-hover:text-brand transition-colors line-clamp-2">{p.name}</h3>
                    <p className="text-brand font-bold mt-2">{formatPrice(p.sellingPrice)}</p>
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
