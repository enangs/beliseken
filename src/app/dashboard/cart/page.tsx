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
            <div className="text-6xl mb-4">🛒</div>
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
                    <span className="text-2xl">📦</span>
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
              className="block w-full py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-center transition-colors text-lg"
            >
              💳 Lanjut ke Checkout
            </Link>
            <a
              href={`${storeInfo.whatsappLink}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl text-center transition-colors text-sm"
            >
              💬 Atau Chat WhatsApp Langsung
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
