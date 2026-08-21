"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserOrders, type Order, type OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { storeInfo } from "@/data/products";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Menunggu", color: "text-amber-500 bg-amber-50", icon: Clock },
  waiting_payment: { label: "Menunggu Pembayaran", color: "text-amber-500 bg-amber-50", icon: CreditCard },
  paid: { label: "Dibayar", color: "text-blue-500 bg-blue-50", icon: CheckCircle },
  processing: { label: "Diproses", color: "text-blue-500 bg-blue-50", icon: Package },
  shipping: { label: "Dikirim", color: "text-purple-500 bg-purple-50", icon: Truck },
  delivered: { label: "Diterima", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle },
  completed: { label: "Selesai", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-500 bg-red-50", icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(getUserOrders());
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-bold text-brand-navy mb-6">Pesanan Saya</h1>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Pesanan</h2>
              <p className="text-brand-muted mb-6">Mulai belanja untuk membuat pesanan pertama Anda.</p>
              <Link href="/products" className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const sc = statusConfig[order.status];
                const StatusIcon = sc.icon;
                return (
                  <div key={order.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border bg-brand-gray/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package size={16} className="text-brand" />
                          <span className="font-bold text-brand-navy text-sm">{order.orderNumber}</span>
                        </div>
                        <p className="text-xs text-brand-muted">{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${sc.color}`}>
                        <StatusIcon size={14} />
                        {sc.label}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-5">
                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold">
                              {item.quantity}×
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-brand-navy line-clamp-1">{item.productName}</p>
                              <p className="text-xs text-brand-muted">{formatPrice(item.price)} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-brand">{formatPrice(item.subtotal)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="border-t pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm text-brand-muted">
                          <span>Pengiriman: {order.shipping.courier} {order.shipping.service}</span>
                          <span className="mx-2">·</span>
                          <span>{order.shipping.etd}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-brand-muted">Total</p>
                            <p className="text-lg font-extrabold text-brand">{formatPrice(order.total)}</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="px-4 py-2 border border-brand-border text-brand font-semibold text-sm rounded-lg hover:bg-brand-gray transition-colors"
                          >
                            {selectedOrder?.id === order.id ? "Tutup" : "Detail"}
                          </button>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      {selectedOrder?.id === order.id && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-brand-navy text-sm mb-3">Status Pesanan</h4>
                          <div className="space-y-3">
                            {[...order.statusHistory].reverse().map((h, i) => {
                              const hc = statusConfig[h.status];
                              const HIcon = hc.icon;
                              return (
                                <div key={i} className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? hc.color : "bg-gray-100 text-gray-400"}`}>
                                    <HIcon size={14} />
                                  </div>
                                  <div>
                                    <p className={`text-sm font-semibold ${i === 0 ? "text-brand-navy" : "text-brand-muted"}`}>{hc.label}</p>
                                    <p className="text-xs text-brand-muted">{new Date(h.date).toLocaleString("id-ID")} — {h.note}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Shipping Address */}
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-brand-navy text-sm mb-2">Alamat Pengiriman</h4>
                            <p className="text-sm text-brand-muted">{order.address.name} · {order.address.phone}</p>
                            <p className="text-sm text-brand-muted">{order.address.address}, {order.address.city}</p>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex gap-3">
                            <a
                              href={`${storeInfo.whatsappLink}?text=Halo, saya ingin menanyakan pesanan ${order.orderNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                              💬 Chat WhatsApp
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
