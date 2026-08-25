"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Search,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MapPin,
  Tag,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface SellRequest {
  id: string;
  category: string;
  subcategory?: string;
  brand: string;
  model: string;
  photos: string[];
  condition: string;
  functional_condition: string;
  damage_description?: string;
  asking_price?: number;
  want_offer: boolean;
  offered_price?: number;
  whatsapp: string;
  location: string;
  user_id?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  CONTACTED: { label: "Dihubungi", color: "bg-blue-100 text-blue-700", icon: Phone },
  NEGOTIATION: { label: "Negosiasi", color: "bg-purple-100 text-purple-700", icon: MessageCircle },
  ACCEPTED: { label: "Diterima", color: "bg-green-100 text-green-700", icon: CheckCircle },
  REJECTED: { label: "Ditolak", color: "bg-red-100 text-red-700", icon: XCircle },
  COMPLETED: { label: "Selesai", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/sell-requests");
      const result = await response.json();
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    try {
      const response = await fetch("/api/sell-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
        );
        if (selectedRequest?.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (error) {
      alert("Gagal update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchSearch =
      req.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.whatsapp.includes(searchQuery) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    contacted: requests.filter((r) => r.status === "CONTACTED").length,
    negotiation: requests.filter((r) => r.status === "NEGOTIATION").length,
    accepted: requests.filter((r) => r.status === "ACCEPTED").length,
  };

  const generateWhatsAppLink = (req: SellRequest) => {
    const adminWhatsapp = "6285101256123";
    const message = encodeURIComponent(
      `Halo, kami dari BeliSeken tertarik dengan ${req.brand} ${req.model} Anda. ` +
      (req.want_offer
        ? "Kami ingin memberikan penawaran harga."
        : `Apakah masih tersedia dengan harga Rp ${req.asking_price?.toLocaleString("id-ID")}?`)
    );
    return `https://wa.me/${req.whatsapp.replace(/^0/, "62")}?text=${message}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <div className="bg-white border-b border-brand-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                  <Package size={24} className="text-brand" />
                  Jual Barang (Sell Requests)
                </h1>
                <p className="text-sm text-brand-muted">
                  Kelola permintaan jual barang dari pelanggan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-brand-navy" },
            { label: "Menunggu", value: stats.pending, color: "text-yellow-600" },
            { label: "Dihubungi", value: stats.contacted, color: "text-blue-600" },
            { label: "Negosiasi", value: stats.negotiation, color: "text-purple-600" },
            { label: "Diterima", value: stats.accepted, color: "text-green-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-brand-border p-4"
            >
              <p className="text-sm text-brand-muted">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-brand-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder="Cari brand, model, WhatsApp, lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-xl outline-none focus:border-brand text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["ALL", "PENDING", "CONTACTED", "NEGOTIATION", "ACCEPTED", "REJECTED"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                    }`}
                  >
                    {status === "ALL" ? "Semua" : statusConfig[status]?.label || status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted">Belum ada permintaan jual barang</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-gray">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Barang
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Kondisi
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Harga
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Kontak
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredRequests.map((req) => {
                    const status = statusConfig[req.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;
                    return (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-brand-navy text-sm">
                              {req.brand} {req.model}
                            </p>
                            <p className="text-xs text-brand-muted flex items-center gap-1">
                              <Tag size={10} />
                              {req.category}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{req.condition}</span>
                        </td>
                        <td className="px-4 py-3">
                          {req.want_offer ? (
                            <span className="text-sm text-brand font-medium">Minta Penawaran</span>
                          ) : (
                            <span className="text-sm font-semibold">
                              Rp {req.asking_price?.toLocaleString("id-ID")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="flex items-center gap-1">
                              <Phone size={12} />
                              {req.whatsapp}
                            </p>
                            <p className="text-xs text-brand-muted flex items-center gap-1">
                              <MapPin size={10} />
                              {req.location}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Detail"
                            >
                              <Eye size={16} className="text-brand-muted" />
                            </button>
                            <a
                              href={generateWhatsAppLink(req)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Chat WhatsApp"
                            >
                              <MessageCircle size={16} className="text-emerald-600" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-navy">Detail Permintaan</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle size={20} className="text-brand-muted" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedRequest.id, key)}
                      disabled={updatingStatus === selectedRequest.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedRequest.status === key
                          ? `${config.color} ring-2 ring-offset-2 ring-current`
                          : "bg-gray-100 text-brand-muted hover:bg-gray-200"
                      }`}
                    >
                      {updatingStatus === selectedRequest.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Icon size={14} />
                      )}
                      {config.label}
                    </button>
                  );
                })}
              </div>

              {/* Product Info */}
              <div className="bg-brand-gray rounded-xl p-4">
                <h3 className="font-bold text-brand-navy mb-3">📦 Informasi Barang</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-muted">Brand:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.brand}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Model:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.model}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Kategori:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.category}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Sub-Kategori:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.subcategory || "-"}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Kondisi Fisik:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.condition}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Kondisi Fungsional:</span>
                    <span className="ml-2 font-semibold">{selectedRequest.functional_condition}</span>
                  </div>
                </div>
                {selectedRequest.damage_description && (
                  <div className="mt-3">
                    <span className="text-brand-muted text-sm">Deskripsi Kerusakan:</span>
                    <p className="text-sm mt-1">{selectedRequest.damage_description}</p>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-brand-gray rounded-xl p-4">
                <h3 className="font-bold text-brand-navy mb-3">💰 Harga</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-muted">Harga Minta:</span>
                    <span className="ml-2 font-semibold">
                      {selectedRequest.want_offer
                        ? "Minta Penawaran"
                        : `Rp ${selectedRequest.asking_price?.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  {selectedRequest.offered_price && (
                    <div>
                      <span className="text-brand-muted">Harga Tawar:</span>
                      <span className="ml-2 font-semibold text-brand">
                        Rp {selectedRequest.offered_price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-brand-gray rounded-xl p-4">
                <h3 className="font-bold text-brand-navy mb-3">📱 Kontak</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-brand-muted" />
                    <span className="font-semibold">{selectedRequest.whatsapp}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-muted" />
                    <span>{selectedRequest.location}</span>
                  </p>
                </div>
                <a
                  href={generateWhatsAppLink(selectedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle size={18} />
                  Chat via WhatsApp
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Photos */}
              {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                <div>
                  <h3 className="font-bold text-brand-navy mb-3">📸 Foto</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedRequest.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Foto ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-xl border border-brand-border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <h3 className="font-bold text-brand-navy mb-3">📝 Catatan Admin</h3>
                <textarea
                  placeholder="Tambahkan catatan..."
                  value={selectedRequest.admin_notes || ""}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, admin_notes: e.target.value } : null
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand text-sm resize-none"
                />
                <button
                  onClick={() => {
                    if (selectedRequest) {
                      fetch("/api/sell-requests", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          id: selectedRequest.id,
                          adminNotes: selectedRequest.admin_notes,
                        }),
                      });
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors"
                >
                  Simpan Catatan
                </button>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-brand-muted border-t border-brand-border pt-4">
                <p>Dibuat: {new Date(selectedRequest.created_at).toLocaleString("id-ID")}</p>
                <p>Update: {new Date(selectedRequest.updated_at).toLocaleString("id-ID")}</p>
                <p className="mt-1">ID: {selectedRequest.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
