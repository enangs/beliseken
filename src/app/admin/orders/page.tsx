"use client";

import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, XCircle, Clock, CreditCard, User, ExternalLink, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { fetchOrders, updateOrderStatus, updateTrackingNumber } from "@/lib/orders-api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/orders";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Menunggu", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  waiting_payment: { label: "Bayar Pending", color: "text-amber-600", bg: "bg-amber-50", icon: CreditCard },
  paid: { label: "Dibayar", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle },
  processing: { label: "Diproses", color: "text-blue-600", bg: "bg-blue-50", icon: Package },
  shipping: { label: "Dikirim", color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Diterima", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  completed: { label: "Selesai", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

const nextStatuses: Record<string, { status: string; label: string }[]> = {
  waiting_payment: [{ status: "paid", label: "Dibayar" }, { status: "cancelled", label: "Batalkan" }],
  paid: [{ status: "processing", label: "Proses" }, { status: "cancelled", label: "Batalkan" }],
  processing: [{ status: "shipping", label: "Kirim" }, { status: "cancelled", label: "Batalkan" }],
  shipping: [{ status: "delivered", label: "Diterima" }],
  delivered: [{ status: "completed", label: "Selesai" }],
  pending: [{ status: "processing", label: "Proses" }, { status: "cancelled", label: "Batalkan" }],
};

const courierList = [
  "JNE", "JNE REG", "JNE OKE", "JNE YES", "JNE JET",
  "SiCepat REG", "SiCepat HAL", "SiCepat BEST",
  "J&T REG", "J&T PRO",
  "POS REG", "POS KILAT",
  "TIKI REG", "TIKI ONS",
  "AnterAja REG", "AnterAja SFD",
  "GrabExpress", "GoSend", "DartaJasa"
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [editingTracking, setEditingTracking] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [courierInput, setCourierInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders({ admin: true, status: filter === "all" ? undefined : filter });
      setOrders(data || []);
      
      // Check data source
      const localOrders = JSON.parse(localStorage.getItem('beliseken_orders') || '[]');
      setDataSource(`${data?.length || 0} orders (local: ${localOrders.length})`);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Gagal memuat pesanan. Silakan coba lagi.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await updateOrderStatus(orderId, newStatus as any);
    await loadOrders();
    setUpdating(null);
  };

  const handleSaveTracking = async (orderId: string) => {
    if (trackingInput.trim()) {
      setUpdating(orderId);
      await updateTrackingNumber(orderId, trackingInput.trim(), courierInput);
      setEditingTracking(null);
      setTrackingInput("");
      setCourierInput("");
      await loadOrders();
      setUpdating(null);
    }
  };

  const startEditTracking = (order: Order) => {
    setEditingTracking(order.id);
    setTrackingInput(order.trackingNumber || "");
    setCourierInput(order.shipping?.courier || "");
  };

  const stats = {
    total: orders.length,
    waiting: orders.filter((o) => o.status === "waiting_payment").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipping: orders.filter((o) => o.status === "shipping").length,
    completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
    totalRevenue: orders.filter((o) => o.status === "completed" || o.status === "delivered").reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Pesanan</h1>
          <p className="text-brand-muted text-sm mt-1">
            {loading ? "Memuat..." : dataSource}
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
          <p className="text-xs text-brand-muted">Total</p>
          <p className="text-xl font-bold text-brand-navy">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
          <p className="text-xs text-brand-muted">Bayar Pending</p>
          <p className="text-xl font-bold text-amber-600">{stats.waiting}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
          <p className="text-xs text-brand-muted">Diproses</p>
          <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
          <p className="text-xs text-brand-muted">Dikirim</p>
          <p className="text-xl font-bold text-purple-600">{stats.shipping}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-3 text-center">
          <p className="text-xs text-brand-muted">Pendapatan</p>
          <p className="text-lg font-bold text-emerald-600">{formatPrice(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-brand text-white" : "bg-white border border-brand-border text-brand-navy hover:bg-brand-gray"
          }`}
        >
          Semua
        </button>
        {Object.entries(statusConfig).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key ? "bg-brand text-white" : "bg-white border border-brand-border text-brand-navy hover:bg-brand-gray"
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
          <Loader2 size={48} className="mx-auto text-brand-muted mb-4 animate-spin" />
          <p className="text-brand-muted font-medium">Memuat pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
          <Package size={48} className="mx-auto text-brand-muted mb-4" />
          <p className="text-brand-muted font-medium">Belum ada pesanan</p>
          <p className="text-xs text-brand-muted mt-1">Pesanan akan muncul di sini setelah pelanggan checkout</p>
          <p className="text-xs text-red-500 mt-3">⚠️ Jika sudah pesan tapi tidak muncul, kemungkinan DATABASE_URL belum terhubung di Vercel</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const Icon = config.icon;
            const isExpanded = expandedOrder === order.id;
            const nexts = nextStatuses[order.status] || [];
            const isEditingTracking = editingTracking === order.id;
            const isUpdating = updating === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-brand-gray/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                      {isUpdating ? (
                        <Loader2 size={20} className={`${config.color} animate-spin`} />
                      ) : (
                        <Icon size={20} className={config.color} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">{order.orderNumber}</p>
                      <div className="flex items-center gap-2 text-xs text-brand-muted mt-0.5">
                        <User size={12} />
                        <span>{order.address?.name || '-'}</span>
                        <span>•</span>
                        <span>{order.address?.email || '-'}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                          <Truck size={12} />
                          <span className="font-mono">{order.trackingNumber}</span>
                          {order.trackingUrl && (
                            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-brand-navy">{formatPrice(order.total)}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-brand-muted" /> : <ChevronDown size={18} className="text-brand-muted" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-brand-border p-4 bg-brand-gray/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-brand-navy mb-2">📦 Item Pesanan:</h4>
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm py-1 border-b border-brand-border last:border-0">
                            <span className="text-brand-muted">{item.productName} × {item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm pt-2 mt-2 border-t border-brand-border">
                          <span className="text-brand-muted">Subtotal</span>
                          <span className="font-medium">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-brand-muted">Ongkir ({order.shipping?.courier} {order.shipping?.service})</span>
                          <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-brand-border">
                          <span>Total</span>
                          <span className="text-brand">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Address & Payment */}
                      <div>
                        <h4 className="text-sm font-semibold text-brand-navy mb-2">📍 Alamat Pengiriman:</h4>
                        <div className="bg-white rounded-lg p-3 border border-brand-border text-sm">
                          <p className="font-semibold">{order.address?.name}</p>
                          <p className="text-brand-muted text-xs">{order.address?.phone} • {order.address?.email}</p>
                          <p className="text-brand-muted text-xs mt-1">{order.address?.address}</p>
                          <p className="text-brand-muted text-xs">{order.address?.city}, {order.address?.province} {order.address?.postcode}</p>
                        </div>

                        <h4 className="text-sm font-semibold text-brand-navy mb-2 mt-3">💳 Pembayaran:</h4>
                        <div className="bg-white rounded-lg p-3 border border-brand-border text-sm">
                          <p className="text-brand-muted">
                            {order.paymentMethod === "bank_transfer" ? "🏦 Transfer Bank" :
                             order.paymentMethod === "ewallet" ? "📱 E-Wallet" :
                             "💵 COD (Bayar di Tempat)"}
                          </p>
                        </div>

                        {/* Tracking Number Section */}
                        {(order.status === "shipping" || order.trackingNumber) && (
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold text-brand-navy mb-2">🚚 No. Resi & Kurir:</h4>
                            {isEditingTracking ? (
                              <div className="bg-white rounded-lg p-3 border border-brand-border space-y-2">
                                <div>
                                  <label className="text-xs text-brand-muted">Kurir</label>
                                  <select
                                    value={courierInput}
                                    onChange={(e) => setCourierInput(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                                  >
                                    <option value="">Pilih Kurir</option>
                                    {courierList.map((c) => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs text-brand-muted">No. Resi</label>
                                  <input
                                    type="text"
                                    value={trackingInput}
                                    onChange={(e) => setTrackingInput(e.target.value)}
                                    placeholder="Masukkan nomor resi"
                                    className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveTracking(order.id)}
                                    disabled={isUpdating}
                                    className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {isUpdating ? <Loader2 size={12} className="animate-spin" /> : '💾'} Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingTracking(null)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white rounded-lg p-3 border border-brand-border text-sm">
                                {order.trackingNumber ? (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-brand-muted">Kurir: {order.shipping?.courier}</p>
                                      <p className="font-mono font-semibold text-brand-navy">{order.trackingNumber}</p>
                                      {order.trackingUrl && (
                                        <a 
                                          href={order.trackingUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs text-brand hover:underline flex items-center gap-1 mt-1"
                                        >
                                          📌 Lacak Kiriman <ExternalLink size={10} />
                                        </a>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => startEditTracking(order)}
                                      className="px-3 py-1.5 bg-brand-gray text-brand-navy text-xs font-semibold rounded-lg hover:bg-brand-border"
                                    >
                                      ✏️ Edit
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditTracking(order)}
                                    className="w-full py-2 border-2 border-dashed border-brand-border rounded-lg text-xs text-brand-muted hover:border-brand hover:text-brand transition-colors"
                                  >
                                    ➕ Tambah No. Resi
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-brand-navy mb-2">📋 Riwayat Status:</h4>
                        <div className="space-y-1">
                          {order.statusHistory.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="text-brand-muted">{new Date(h.date).toLocaleString("id-ID")}</span>
                              <span className="font-semibold text-brand-navy">{statusConfig[h.status]?.label || h.status}</span>
                              {h.note && <span className="text-brand-muted">- {h.note}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {nexts.length > 0 && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-brand-border">
                        {nexts.map((ns) => (
                          <button
                            key={ns.status}
                            onClick={() => handleStatusUpdate(order.id, ns.status)}
                            disabled={isUpdating}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                              ns.status === "cancelled"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-brand text-white hover:bg-brand-dark"
                            } disabled:opacity-50`}
                          >
                            {isUpdating && <Loader2 size={14} className="animate-spin" />}
                            {ns.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
