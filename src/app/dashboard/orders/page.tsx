"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard, MapPin, ChevronDown, ChevronUp, ExternalLink, Loader2, AlertCircle, Camera, Upload, MessageCircle, ShoppingCart, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);
  const [retryPayment, setRetryPayment] = useState<string | null>(null);
  const [retryPaymentData, setRetryPaymentData] = useState<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleRetryPayment = async (orderNumber: string, paymentMethod: string = 'qris') => {
    setRetryPayment(orderNumber);
    try {
      const pakasirMethod = paymentMethod === 'qris' ? 'qris' : paymentMethod.replace('va_', '') + '_va';
      const res = await fetch('/api/payment/pakasir/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, method: pakasirMethod }),
      });
      const data = await res.json();
      if (data.success) {
        setRetryPaymentData(prev => ({ ...prev, [orderNumber]: data.data }));
      } else {
        const errMsg = data.error || '';
        if (errMsg.includes('Maximum amount')) {
          alert('Nominal transaksi melebihi batas sandbox. Hubungi admin.');
        } else {
          alert('Gagal memproses pembayaran. Silakan coba lagi.');
        }
      }
    } catch {
      alert('Gagal memproses pembayaran. Silakan coba lagi.');
    }
    setRetryPayment(null);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = getCurrentUser();
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('beliseken_user_email') : null);
      
      // Try with userId first, fallback to email
      let data = await fetchOrders({ 
        userId: user?.id,
        email: !user?.id ? email || undefined : undefined,
      });
      
      // If no results with userId, try with email
      if ((!data || data.length === 0) && email) {
        data = await fetchOrders({ email });
      }

      // If still no results and no user session, show login prompt
      if ((!data || data.length === 0) && !user && !email) {
        setError('Silakan login terlebih dahulu untuk melihat pesanan Anda.');
      }

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
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
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
                          <h4 className="font-semibold text-brand-navy text-sm mb-4 flex items-center gap-2">
                            <MapPin size={14} className="text-brand" />
                            Status Pengiriman
                          </h4>
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
                                  <Truck size={14} />
                                  Informasi Pengiriman
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
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  Lacak Kiriman <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                              </svg>
                              Simpan nomor resi ini untuk melacak status pengiriman barang Anda
                            </p>
                          </div>
                        )}

                        {/* Items */}
                        <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                          <h4 className="font-semibold text-brand-navy text-sm mb-3">Item Pesanan</h4>
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
                            <h4 className="font-semibold text-brand-navy text-sm mb-2 flex items-center gap-2">
                              <CreditCard size={14} className="text-brand" />
                              Pembayaran
                            </h4>
                            <p className="text-sm">
                              {order.paymentMethod === "bank_transfer" ? "🏦 Transfer Bank" :
                               order.paymentMethod?.startsWith("va_") ? `🏦 VA ${order.paymentMethod.replace('va_','').toUpperCase()}` :
                               order.paymentMethod === "qris" ? "📱 QRIS" :
                               order.paymentMethod === "ewallet" ? "💳 E-Wallet" :
                               order.paymentMethod === "cod" ? "💵 COD" :
                               order.paymentMethod}
                            </p>
                            {(order as any).paymentProvider && (
                              <p className="text-xs text-brand-muted mt-1">
                                via {(order as any).paymentProvider}
                              </p>
                            )}
                            <p className="text-xs text-brand-muted mt-2">
                              {order.shipping?.etd}
                            </p>
                          </div>
                        </div>

                        {/* Payment Proof - for waiting_payment + bank_transfer */}
                        {order.status === "waiting_payment" && order.paymentMethod === "bank_transfer" && (
                          <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                            <h4 className="font-semibold text-brand-navy text-sm mb-3 flex items-center gap-2">
                              <Camera size={14} className="text-brand" />
                              Bukti Pembayaran
                            </h4>
                            
                            {(order as any).paymentProofUrl ? (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                <img 
                                  src={(order as any).paymentProofUrl} 
                                  alt="Bukti Pembayaran" 
                                  className="w-full max-h-48 object-contain rounded-lg mb-2"
                                />
                                <div className="flex items-center gap-2 text-emerald-700">
                                  <CheckCircle size={14} />
                                  <span className="font-semibold text-xs">Bukti pembayaran sudah diupload — menunggu verifikasi admin</span>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-brand-border rounded-xl p-4 text-center hover:border-brand/50 transition-colors">
                                <input 
                                  ref={(el) => { fileInputRefs.current[order.id] = el; }}
                                  type="file" 
                                  accept="image/*" 
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
                                      alert('File harus gambar dan maksimal 5MB');
                                      return;
                                    }
                                    setUploadingProof(order.id);
                                    const reader = new FileReader();
                                    reader.onload = async () => {
                                      try {
                                        const res = await fetch(`/api/orders/${order.orderNumber}/payment-proof`, {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ paymentProofUrl: reader.result }),
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          loadOrders();
                                        } else {
                                          alert('Gagal upload');
                                        }
                                      } catch {
                                        alert('Gagal upload bukti pembayaran');
                                      }
                                      setUploadingProof(null);
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                  className="hidden"
                                />
                                {uploadingProof === order.id ? (
                                  <div className="flex flex-col items-center py-2">
                                    <Loader2 size={24} className="animate-spin text-brand mb-2" />
                                    <p className="text-xs text-brand-muted">Mengupload...</p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center py-2">
                                    <Upload size={24} className="text-brand-muted mb-2" />
                                    <p className="text-xs text-brand-muted mb-2">Upload foto bukti transfer</p>
                                    <button 
                                      onClick={() => fileInputRefs.current[order.id]?.click()}
                                      className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark"
                                    >
                                      Pilih Foto
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            <a
                              href={`${storeInfo.whatsappLink}?text=Halo, saya sudah transfer untuk pesanan ${order.orderNumber}. Berikut bukti transfernya:`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              <MessageCircle size={14} />
                              Kirim Bukti via WhatsApp
                            </a>
                          </div>
                        )}

                        {/* PakaSir Payment - QRIS / VA retry */}
                        {order.status === "waiting_payment" && (order.paymentMethod === "qris" || order.paymentMethod?.startsWith("va_")) && (
                          <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                            {retryPaymentData[order.orderNumber] ? (
                              /* Show QR code */
                              <div>
                                <h4 className="font-semibold text-brand-navy text-sm mb-3 flex items-center gap-2">
                                  <QrCode size={14} className="text-brand" />
                                  {retryPaymentData[order.orderNumber].paymentMethod === 'qris' ? 'Scan QRIS untuk Bayar' : 'Virtual Account'}
                                </h4>
                                {retryPaymentData[order.orderNumber].paymentMethod === 'qris' && (
                                  <div className="text-center mb-3">
                                    <div className="bg-white border-2 border-brand-border rounded-2xl p-4 inline-block">
                                      <QRCodeSVG
                                        value={retryPaymentData[order.orderNumber].paymentNumber}
                                        size={200}
                                        level="M"
                                        includeMargin={true}
                                      />
                                    </div>
                                    <p className="text-xs text-brand-muted mt-2">Scan menggunakan mobile banking atau e-wallet</p>
                                  </div>
                                )}
                                {retryPaymentData[order.orderNumber].paymentMethod !== 'qris' && (
                                  <div className="bg-brand-gray rounded-lg p-3 flex items-center justify-between mb-3">
                                    <span className="text-lg font-mono font-bold text-brand-navy">{retryPaymentData[order.orderNumber].paymentNumber}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(retryPaymentData[order.orderNumber].paymentNumber);
                                        alert('Nomor VA dicopy!');
                                      }}
                                      className="px-3 py-1 bg-brand text-white text-xs font-semibold rounded-lg"
                                    >Copy</button>
                                  </div>
                                )}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                                  <p className="text-xs text-amber-700">Total: <span className="font-bold text-lg">Rp{retryPaymentData[order.orderNumber].totalPayment.toLocaleString('id-ID')}</span></p>
                                  {retryPaymentData[order.orderNumber].expiredAt && (
                                    <p className="text-xs text-amber-600 mt-1">
                                      Berlaku hingga {new Date(retryPaymentData[order.orderNumber].expiredAt).toLocaleString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Show bayar button */
                              <div className="text-center py-2">
                                <button
                                  onClick={() => handleRetryPayment(order.orderNumber, order.paymentMethod || 'qris')}
                                  disabled={retryPayment === order.orderNumber}
                                  className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                                >
                                  {retryPayment === order.orderNumber ? (
                                    <>
                                      <Loader2 size={16} className="animate-spin" />
                                      Memproses...
                                    </>
                                  ) : (
                                    <>
                                      <QrCode size={16} />
                                      Bayar Sekarang
                                    </>
                                  )}
                                </button>
                                <p className="text-xs text-brand-muted mt-2">Klik untuk mendapatkan QR code / nomor Virtual Account</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status History */}
                        <div className="bg-white rounded-xl p-4 border border-brand-border mb-4">
                          <h4 className="font-semibold text-brand-navy text-sm mb-3 flex items-center gap-2">
                            <Clock size={14} className="text-brand" />
                            Riwayat Status
                          </h4>
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
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Chat WhatsApp
                          </a>
                          <Link
                            href={`/products`}
                            className="px-4 py-3 border border-brand-border text-brand-navy font-semibold text-sm rounded-xl hover:bg-brand-gray transition-colors text-center flex items-center gap-2"
                          >
                            <ShoppingCart size={14} />
                            Belanja Lagi
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
