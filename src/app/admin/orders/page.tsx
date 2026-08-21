"use client";

import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Menunggu", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  waiting_payment: { label: "Bayar Pending", color: "text-amber-600", bg: "bg-amber-50", icon: CreditCard },
  paid: { label: "Dibayar", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle },
  processing: { label: "Diproses", color: "text-blue-600", bg: "bg-blue-50", icon: Package },
  shipping: { label: "Dikirim", color: "text-purple-600", bg: "bg-purple-50", icon: Truck },
  delivered: { label: "Diterima", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  completed: { label: "Selesai", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

const nextStatuses: Partial<Record<OrderStatus, OrderStatus[]>> = {
  waiting_payment: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipping", "cancelled"],
  shipping: ["delivered"],
  delivered: ["completed"],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const loadOrders = () => setOrders(getOrders());
  useEffect(() => { loadOrders(); }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Pesanan</h1>
        <p className="text-brand-muted text-sm mt-1">{orders.length} pesanan total</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === "all" ? "bg-brand text-white" : "bg-white border border-brand-border text-brand-muted hover:bg-brand-gray"}`}>
          Semua ({orders.length})
        </button>
        {(["waiting_payment", "paid", "processing", "shipping", "delivered", "completed", "cancelled"] as OrderStatus[]).map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          if (count === 0) return null;
          const sc = statusConfig[s];
          return (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${filter === s ? "bg-brand text-white" : "bg-white border border-brand-border text-brand-muted hover:bg-brand-gray"}`}>
              {sc.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const sc = statusConfig[order.status];
          const StatusIcon = sc.icon;
          const isExpanded = expandedOrder === order.id;
          const nextOptions = nextStatuses[order.status] || [];

          return (
            <div key={order.id} className="bg-white rounded-xl border border-brand-border overflow-hidden">
              {/* Order Row */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-brand-navy text-sm">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")} · {order.items.length} item · {order.shipping.courier} {order.shipping.service}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand">{formatPrice(order.total)}</span>
                  {nextOptions.length > 0 && (
                    <div className="flex gap-1">
                      {nextOptions.map((ns) => {
                        const nsc = statusConfig[ns];
                        return (
                          <button
                            key={ns}
                            onClick={() => handleStatusUpdate(order.id, ns)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                              ns === "cancelled" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-brand/10 text-brand hover:bg-brand/20"
                            }`}
                          >
                            {ns === "cancelled" ? "✕ Batal" : `→ ${nsc.label}`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="p-2 hover:bg-brand-gray rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t p-4 sm:p-5 bg-brand-gray/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-brand-navy text-sm mb-2">Item</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-brand-muted">{item.productName} × {item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address & Shipping */}
                    <div>
                      <h4 className="font-semibold text-brand-navy text-sm mb-2">Pengiriman</h4>
                      <p className="text-sm text-brand-muted">{order.address.name} · {order.address.phone}</p>
                      <p className="text-sm text-brand-muted">{order.address.address}</p>
                      <p className="text-sm text-brand-muted">{order.address.city}</p>
                      <p className="text-sm text-brand-muted mt-2">{order.shipping.courier} {order.shipping.service} — {order.shipping.etd}</p>
                      <p className="text-sm text-brand font-semibold mt-1">Ongkir: {formatPrice(order.shippingCost)}</p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-brand-navy text-sm mb-2">Riwayat Status</h4>
                    <div className="space-y-2">
                      {[...order.statusHistory].reverse().map((h, i) => {
                        const hc = statusConfig[h.status];
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${hc.bg} ${hc.color}`}>{hc.label}</span>
                            <span className="text-brand-muted">{new Date(h.date).toLocaleString("id-ID")}</span>
                            <span className="text-brand-muted">— {h.note}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-brand-muted">Belum ada pesanan</p>
          </div>
        )}
      </div>
    </div>
  );
}
