"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { storeInfo } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-brand-navy mb-2">Keranjang Kosong</h1>
            <p className="text-brand-muted mb-6">Belum ada produk di keranjang Anda.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-colors"
            >
              <ShoppingCart size={18} />
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const waMessage = `Halo, saya ingin checkout:\n${items.map((i) => `- ${i.product.name} x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-brand-navy">Keranjang Belanja</h1>
            <button
              onClick={clearCart}
              className="text-sm text-brand-muted hover:text-red-500 transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-8">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 bg-white rounded-xl border border-brand-border">
                {/* Image */}
                <Link href={`/product/${product.slug}`} className="w-20 h-20 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageBase64} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-400">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.slug}`} className="font-semibold text-brand-navy hover:text-brand text-sm line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-xs text-brand-muted mt-0.5">{product.brand} · {product.condition}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-brand text-sm">{formatPrice(product.price)}</span>
                    <span className="text-xs text-brand-muted line-through">{formatPrice(product.originalPrice)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-brand-muted hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 border border-brand-border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-semibold text-sm w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 border border-brand-border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-brand-border p-6">
            <h2 className="font-bold text-brand-navy mb-4">Ringkasan Belanja</h2>
            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{product.name} × {quantity}</span>
                  <span className="font-medium">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between mb-2">
              <span className="text-brand-muted">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-brand-muted">Pengiriman</span>
              <span className="font-semibold text-emerald-500">Dihitung via WhatsApp</span>
            </div>
            <div className="border-t pt-4 flex justify-between mb-6">
              <span className="font-bold text-brand-navy text-lg">Total</span>
              <span className="text-xl font-extrabold text-brand">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-center transition-colors text-lg flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Lanjut ke Checkout
            </Link>
            <a
              href={`${storeInfo.whatsappLink}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl text-center transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Atau Chat WhatsApp Langsung
            </a>
            <Link
              href="/products"
              className="block w-full py-3 text-center text-brand font-semibold mt-3 hover:underline text-sm"
            >
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
