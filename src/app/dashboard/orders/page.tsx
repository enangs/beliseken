"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard, MapPin, ChevronDown, ChevronUp, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchOrders } from "@/lib/orders-api";
import { formatPrice } from "@/lib/utils";
import { storeInfo } from "@/data/products";
import { getCurrentUser } from "@/lib/auth-api";
import type { Order, OrderStatus } from "@/lib/orders";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType; step: number }> = {
  pending: { label: "Menunggu", color: "text-amber-500 bg-amber-50", icon: Clock, step: 0 },
  waiting_payment: { label: "Menunggu Pembayaran", color: "text-amber-500 bg-amber-50", icon: CreditCard, step: 1 },
  paid: { label: "Dibayar", color: "text-blue-500 bg-blue-50", icon: CheckCircle, step: 2 },
  processing: { label: "Diproses", color: "text-blue-500 bg-blue-50", icon: Package, step: 3 },
  shipping: { label: "Dikirim", color: "text-purple-500 bg-purple-50", icon: Truck, step: 4 },
  delivered: { label: "Diterima", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle, step: 5 },
  completed: { label: "Selesai", color: "text-emerald-500 bg-emerald-50", icon: CheckCircle, step: 6 },
  cancelled: { label: "Dibatalkan", color: "text-red-500 bg-red-50", icon: XCircle, step: -1 },
};

const trackingSteps = [
  { label: "Pesanan Dibuat", icon: Clock },
  { label: "Menunggu Bayar", icon: CreditCard },
  { label: "Dibayar", icon: CheckCircle },
  { label: "Diproses", icon: Package },
  { label: "Dikirim", icon: Truck },
  { label: "Diterima", icon: CheckCircle },
  { label: "Selesai", icon: CheckCircle },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = getCurrentUser();
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('beliseken_user_email') : null);
      
      const data = await fetchOrders({ 
        userId: user?.id,
        email: email || undefined,
      });
      
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Gagal memuat pesanan. Silakan coba lagi.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id: string) => {
    setSelectedOrder(selectedOrder === id ? null : id);
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen bg-brand-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Pesanan Saya</h1>
              <p className="text-brand-muted text-sm mt-1">
                {loading ? "Memuat..." : `${orders.length} pesanan`}
              </p>
            </div>
            <Link 
              href="/products" 
              className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
            >
              + Belanja Lagi
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={loadOrders}
                className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-brand-border">
              <Loader2 size={48} className="mx-auto text-brand-muted mb-4 animate-spin" />
              <p className="text-brand-muted font-medium">Memuat pesanan Anda...</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-xl border border-brand-border">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Pesanan</h2>
              <p className="text-brand-muted mb-6">Mulai belanja untuk membuat pesanan pertama Anda.</p>
              <Link 
                href="/products" 
                className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors inline-block"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {orders.map((order) => {
                const sc = getStatusConfig(order.status);
                const StatusIcon = sc.icon;
                const isExpanded = selectedOrder === order.id;
                const currentStep = sc.step;

                return (
                  <div key={order.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
                    {/* Order Header */}
                    <div
                      className="p-4 sm:p-5 cursor-pointer hover:bg-brand-gray/30 transition-colors"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sc.color}`}>
                            <StatusIcon size={22} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Package size={14} className="text-brand" />
                              <span className="font-bold text-brand-navy text-sm">{order.orderNumber}</span>
                            </div>
                            <p className="text-xs text-brand-muted">
                              {new Date(order.createdAt).toLocaleDateString("id-ID", { 
                                day: "numeric", 
                                month: "long", 
                                year: "numeric", 
                                hour: "2-digit", 
                                minute: "2-digit" 
                              })}
                            </p>
                            {/* Show tracking number in header if available */}
                            {order.trackingNumber && (
                              <div className="flex items-center gap-2 mt-1.5 text-xs text-purple-600">
                                <Truck size={12} />
                                <span className="font-semibold">No. Resi:</span>
                                <span className="font-mono bg-purple-50 px-2 py-0.5 rounded">
                                  {order.trackingNumber}
                                </span>
                                {order.trackingUrl && (
                                  <a 
                                    href={order.trackingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-purple-800"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-brand-muted">Total</p>
                            <p className="text-lg font-extrabold text-brand">{formatPrice(order.total)}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${sc.color}`}>
                            {sc.label}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-brand-muted" />
                          ) : (
                            <ChevronDown size={18} className="text-brand-muted" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-brand-border p-4 sm:p-5 bg-brand-gray/20">
                        {/* Visual Tracking */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-brand-navy text-sm mb-4">📍 Status Pengiriman</h4>
                          <div className="flex items-center justify-between overflow-x-auto pb-2">
                            {trackingSteps.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isActive = idx <= currentStep;
                              const isCurrent = idx === currentStep;
                              return (
                                <div key={idx} className="flex flex-col items-center flex-1 min-w-[60px]">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                    isCurrent
                                      ? "bg-brand text-white ring-4 ring-brand/20"
                                      : isActive
                                      ? "bg-brand text-white"
                                      : "bg-gray-200 text-gray-400"
                                  }`}>
                                    <StepIcon size={16} />
                                  </div>
                                  <p className={`text-[10px] font-medium text-center ${isActive ? "text-brand-navy" : "text-brand-muted"}`}>
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tracking Info Card */}
                        {order.trackingNumber && (
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-purple-900 text-sm mb-1 flex items-center gap-2">
                                  🚚 Informasi Pengiriman
                                </h4>
                                <p className="text-xs text-purple-700">
                                  Kurir: {order.shipping?.courier} {order.shipping?.service}
                                </p>
                                <p className="text-lg font-mono font-bold text-purple-900 mt-1">
                                  {order.trackingNumber}
                                </p>
                              </div>
                              {order.trackingUrl && (
                                <a
                                  href={order.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                                >
                                  📌 Lacak Kiriman <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-purple-600 mt-2">
                              💡 Simpan nomor resi ini untuk melacak status pengiriman barang Anda
                            </p>
                          </div>
                        )}

                        {/* Items */}
                        <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                          <h4 className="font-semibold text-brand-navy text-sm mb-3">📦 Item Pesanan</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-brand-gray rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand">
                                  {item.quantity}×
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-brand-navy line-clamp-1">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-brand-muted">
                                    {formatPrice(item.price)} × {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm font-bold text-brand">
                                  {formatPrice(item.subtotal)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t mt-3 pt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-brand-muted">Subtotal</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-brand-muted">
                                Ongkir ({order.shipping?.courier} {order.shipping?.service})
                              </span>
                              <span>{formatPrice(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-brand-navy border-t pt-2">
                              <span>Total</span>
                              <span className="text-brand">{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Address & Payment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-xl p-4 border border-brand-border">
                            <h4 className="font-semibold text-brand-navy text-sm mb-2 flex items-center gap-2">
                              <MapPin size={14} className="text-brand" /> Alamat Pengiriman
                            </h4>
                            <p className="text-sm font-medium">{order.address?.name}</p>
                            <p className="text-xs text-brand-muted">{order.address?.phone}</p>
                            <p className="text-xs text-brand-muted mt-1">{order.address?.address}</p>
                            <p className="text-xs text-brand-muted">
                              {order.address?.city}, {order.address?.province} {order.address?.postcode}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-brand-border">
                            <h4 className="font-semibold text-brand-navy text-sm mb-2">💳 Pembayaran</h4>
                            <p className="text-sm">
                              {order.paymentMethod === "bank_transfer" ? "🏦 Transfer Bank" :
                               order.paymentMethod === "ewallet" ? "📱 E-Wallet" :
                               "💵 COD (Bayar di Tempat)"}
                            </p>
                            <p className="text-xs text-brand-muted mt-2">
                              {order.shipping?.etd}
                            </p>
                          </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                          <h4 className="font-semibold text-brand-navy text-sm mb-3">📋 Riwayat Status</h4>
                          <div className="space-y-2">
                            {[...(order.statusHistory || [])].reverse().map((h, i) => {
                              const hc = getStatusConfig(h.status);
                              const HIcon = hc.icon;
                              return (
                                <div key={i} className="flex items-start gap-3">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    i === 0 ? hc.color : "bg-gray-100 text-gray-400"
                                  }`}>
                                    <HIcon size={12} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className={`text-sm font-semibold ${i === 0 ? "text-brand-navy" : "text-brand-muted"}`}>
                                        {hc.label}
                                      </p>
                                      <span className="text-xs text-brand-muted">
                                        {new Date(h.date).toLocaleString("id-ID")}
                                      </span>
                                    </div>
                                    {h.note && (
                                      <p className="text-xs text-brand-muted">{h.note}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <a
                            href={`${storeInfo.whatsappLink}?text=Halo, saya ingin menanyakan pesanan ${order.orderNumber}. Status: ${sc.label}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                          >
                            💬 Chat WhatsApp
                          </a>
                          <Link
                            href={`/products`}
                            className="px-4 py-3 border border-brand-border text-brand-navy font-semibold text-sm rounded-xl hover:bg-brand-gray transition-colors text-center"
                          >
                            🛒 Belanja Lagi
                          </Link>
                        </div>
                      </div>
                    )}
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
