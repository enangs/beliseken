"use client";

import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";
import { getAdminOrders, updateOrderStatus as updateOrderStatusAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Menunggu", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  WAITING_PAYMENT: { label: "Bayar Pending", color: "text-amber-600", bg: "bg-amber-50", icon: CreditCard },
  PAID: { label: "Dibayar", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle },
  PROCESSING: { label: "Diproses", color: "text-blue-600", bg: "bg-blue-50", icon: Package },
  SHIPPING: { label: "Dikirim", color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  DELIVERED: { label: "Diterima", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  COMPLETED: { label: "Selesai", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  CANCELLED: { label: "Dibatalkan", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

const nextStatuses: Record<string, string[]> = {
  WAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await getAdminOrders({ status: filter === "all" ? undefined : filter, limit: 100 });
      setOrders(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const filtered = orders;

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      loadOrders();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Pesanan</h1>
        <p className="text-brand-muted text-sm mt-1">{orders.length} pesanan total</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ key: "all", label: "Semua" }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s.key
                ? "bg-brand text-white"
                : "bg-white border border-brand-border text-brand-navy hover:bg-brand-gray"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-muted">Memuat pesanan...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-brand-border">
          <Package size={48} className="mx-auto text-brand-muted mb-4" />
          <p className="text-brand-muted">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order: any) => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const Icon = config.icon;
            const isExpanded = expandedOrder === order.id;
            const nexts = nextStatuses[order.status] || [];

            return (
              <div key={order.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
                {/* Order Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-brand-gray/50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                      <Icon size={20} className={config.color} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {order.user?.name || "Guest"} • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </p>
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

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-brand-border p-4">
                    {/* Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-brand-navy mb-2">Item:</h4>
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-brand-muted">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address */}
                    {order.addressSnapshot && (
                      <div className="mb-4 p-3 bg-brand-gray rounded-lg">
                        <p className="text-xs text-brand-muted mb-1">Alamat Pengiriman:</p>
                        <p className="text-sm">{(() => { try { return JSON.parse(order.addressSnapshot).address; } catch { return "-"; } })()}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {nexts.length > 0 && (
                      <div className="flex gap-2">
                        {nexts.map((ns) => (
                          <button
                            key={ns}
                            onClick={() => handleStatusUpdate(order.id, ns)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              ns === "CANCELLED"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-brand text-white hover:bg-brand-dark"
                            }`}
                          >
                            {statusConfig[ns]?.label || ns}
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
