"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { getAllCustomers } from "@/lib/auth-api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data || []);
    } catch (e) { 
      console.error(e); 
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c: any) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
          <Users size={24} className="text-brand" />
          Pelanggan
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Kelola data pelanggan yang sudah terdaftar
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <p className="text-sm text-brand-muted">Total Pelanggan</p>
          <p className="text-2xl font-bold text-brand-navy">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <p className="text-sm text-brand-muted">Dengan Alamat</p>
          <p className="text-2xl font-bold text-emerald-500">
            {customers.filter((c) => c.addresses && c.addresses.length > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <p className="text-sm text-brand-muted">Bulan Ini</p>
          <p className="text-2xl font-bold text-blue-500">
            {
              customers.filter((c) => {
                const d = new Date(c.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4">
          <p className="text-sm text-brand-muted">Bekasi</p>
          <p className="text-2xl font-bold text-amber-500">
            {customers.filter((c) => c.city?.toLowerCase().includes("bekasi")).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-brand-border mb-6">
        <div className="p-4 flex items-center gap-3">
          <Search size={18} className="text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau nomor HP..."
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
          <Loader2 size={48} className="mx-auto text-brand-muted mb-4 animate-spin" />
          <p className="text-brand-muted">Memuat data pelanggan...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-border p-12 text-center">
                <div className="text-4xl mb-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-brand-muted"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <p className="text-brand-muted">
                  {search ? "Tidak ada pelanggan yang cocok" : "Belum ada pelanggan terdaftar"}
                </p>
                <p className="text-xs text-brand-muted mt-2">
                  Pelanggan akan muncul di sini setelah mereka mendaftar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((customer) => (
                  <div
                    key={customer.id}
                    className={`bg-white rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-all ${
                      selectedCustomer?.id === customer.id
                        ? "border-brand ring-2 ring-brand/20"
                        : "border-brand-border hover:border-brand/50"
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {customer.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-navy text-sm truncate">
                        {customer.name}
                      </p>
                      <p className="text-xs text-brand-muted truncate">{customer.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {customer.phone && (
                          <span className="text-xs text-brand-muted flex items-center gap-1">
                            <Phone size={10} /> {customer.phone}
                          </span>
                        )}
                        {customer.city && (
                          <span className="text-xs text-brand-muted flex items-center gap-1">
                            <MapPin size={10} /> {customer.city}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address count */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-semibold">
                        {customer.addresses?.length || 0} alamat
                      </span>
                      <p className="text-[10px] text-brand-muted mt-1">
                        {new Date(customer.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Detail */}
          <div className="lg:col-span-1">
            {selectedCustomer ? (
              <div className="bg-white rounded-xl border border-brand-border p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-brand-navy">Detail Pelanggan</h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Avatar & Name */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                    {selectedCustomer.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <p className="font-bold text-brand-navy">{selectedCustomer.name}</p>
                  <p className="text-sm text-brand-muted">{selectedCustomer.email}</p>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-brand-gray rounded-lg">
                    <Phone size={16} className="text-brand" />
                    <div>
                      <p className="text-xs text-brand-muted">Telepon</p>
                      <p className="text-sm font-semibold">{selectedCustomer.phone || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-brand-gray rounded-lg">
                    <MapPin size={16} className="text-brand" />
                    <div>
                      <p className="text-xs text-brand-muted">Kota</p>
                      <p className="text-sm font-semibold">{selectedCustomer.city || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-brand-gray rounded-lg">
                    <Calendar size={16} className="text-brand" />
                    <div>
                      <p className="text-xs text-brand-muted">Terdaftar</p>
                      <p className="text-sm font-semibold">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h4 className="font-semibold text-brand-navy text-sm mb-2">
                    Alamat Tersimpan ({selectedCustomer.addresses?.length || 0})
                  </h4>
                  {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCustomer.addresses.map((addr: any) => (
                        <div
                          key={addr.id}
                          className="p-3 bg-brand-gray rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-brand-navy">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-brand-muted text-xs">{addr.name} | {addr.phone}</p>
                          <p className="text-brand-muted text-xs">{addr.address}</p>
                          <p className="text-brand-muted text-xs">
                            {addr.city}, {addr.province} {addr.postcode}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-brand-muted p-3 bg-brand-gray rounded-lg">
                      Belum ada alamat tersimpan
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-brand-border p-8 text-center sticky top-24">
                <div className="text-4xl mb-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-brand-muted"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></div>
                <p className="text-sm text-brand-muted">
                  Klik pelanggan untuk melihat detail
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
