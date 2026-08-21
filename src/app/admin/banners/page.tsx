"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  X,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import {
  getBanners,
  saveBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getPromoCards,
  savePromoCards,
  addPromoCard,
  updatePromoCard,
  deletePromoCard,
  type Banner,
  type PromoCard,
} from "@/lib/banners";

const gradientOptions = [
  { value: "from-brand to-brand-dark", label: "BeliSeken (Default)", color: "from-red-500 to-red-700" },
  { value: "from-rose-600 to-orange-500", label: "Merah-Orange", color: "from-rose-600 to-orange-500" },
  { value: "from-emerald-600 to-teal-500", label: "Hijau", color: "from-emerald-600 to-teal-500" },
  { value: "from-blue-600 to-indigo-500", label: "Biru", color: "from-blue-600 to-indigo-500" },
  { value: "from-purple-600 to-pink-500", label: "Ungu-Pink", color: "from-purple-600 to-pink-500" },
  { value: "from-amber-500 to-orange-500", label: "Kuning-Orange", color: "from-amber-500 to-orange-500" },
  { value: "from-gray-800 to-gray-900", label: "Gelap", color: "from-gray-800 to-gray-900" },
];

const promoGradients = [
  { value: "from-blue-500 to-blue-600", label: "Biru", color: "from-blue-500 to-blue-600" },
  { value: "from-emerald-500 to-emerald-600", label: "Hijau", color: "from-emerald-500 to-emerald-600" },
  { value: "from-amber-500 to-orange-500", label: "Orange", color: "from-amber-500 to-orange-500" },
  { value: "from-purple-500 to-purple-600", label: "Ungu", color: "from-purple-500 to-purple-600" },
  { value: "from-pink-500 to-rose-500", label: "Pink", color: "from-pink-500 to-rose-500" },
  { value: "from-red-500 to-red-600", label: "Merah", color: "from-red-500 to-red-600" },
];

type Tab = "banners" | "promo";

export default function BannersPage() {
  const [tab, setTab] = useState<Tab>("banners");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoCard | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBanners(getBanners());
    setPromoCards(getPromoCards());
  }, []);

  const handleSaveBanners = () => {
    saveBanners(banners);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePromoCards = () => {
    savePromoCards(promoCards);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddBanner = () => {
    const newBanner = addBanner({
      title: "Banner Baru",
      subtitle: "Subtitle",
      highlight: "Highlight",
      description: "Deskripsi banner",
      cta: "Lihat Sekarang",
      href: "/products",
      bg: "from-brand to-brand-dark",
      active: true,
    });
    setBanners(getBanners());
    setEditingBanner(newBanner);
    setShowForm(true);
  };

  const handleAddPromo = () => {
    const newPromo = addPromoCard({
      title: "Kategori Baru",
      subtitle: "Mulai Rp100rb",
      price: "Mulai Rp100rb",
      description: "Deskripsi promo",
      href: "/products",
      bg: "from-blue-500 to-blue-600",
      active: true,
    });
    setPromoCards(getPromoCards());
    setEditingPromo(newPromo);
    setShowForm(true);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Yakin ingin menghapus banner ini?")) {
      deleteBanner(id);
      setBanners(getBanners());
      if (editingBanner?.id === id) {
        setEditingBanner(null);
        setShowForm(false);
      }
    }
  };

  const handleDeletePromo = (id: string) => {
    if (confirm("Yakin ingin menghapus kartu promo ini?")) {
      deletePromoCard(id);
      setPromoCards(getPromoCards());
      if (editingPromo?.id === id) {
        setEditingPromo(null);
        setShowForm(false);
      }
    }
  };

  const handleToggleBanner = (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      updateBanner(id, { active: !banner.active });
      setBanners(getBanners());
    }
  };

  const handleTogglePromo = (id: string) => {
    const promo = promoCards.find((c) => c.id === id);
    if (promo) {
      updatePromoCard(id, { active: !promo.active });
      setPromoCards(getPromoCards());
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Kelola Banner & Promo</h1>
          <p className="text-brand-muted text-sm mt-1">
            Atur banner hero dan kartu promo yang ditampilkan di halaman depan
          </p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold animate-pulse">
            ✓ Tersimpan!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setTab("banners"); setShowForm(false); setEditingBanner(null); setEditingPromo(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "banners"
              ? "bg-brand text-white"
              : "bg-white text-brand-navy border border-brand-border hover:bg-brand/5"
          }`}
        >
          🖼️ Banner Hero ({banners.length})
        </button>
        <button
          onClick={() => { setTab("promo"); setShowForm(false); setEditingBanner(null); setEditingPromo(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "promo"
              ? "bg-brand text-white"
              : "bg-white text-brand-navy border border-brand-border hover:bg-brand/5"
          }`}
        >
          🏷️ Kartu Promo ({promoCards.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          {tab === "banners" ? (
            <div className="space-y-3">
              {banners.map((banner, i) => (
                <div
                  key={banner.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
                    editingBanner?.id === banner.id
                      ? "border-brand ring-2 ring-brand/20"
                      : "border-brand-border hover:border-brand/50"
                  }`}
                >
                  <span className="text-brand-muted font-bold text-sm w-6">{i + 1}</span>

                  {/* Preview */}
                  <div className={`w-32 h-16 bg-gradient-to-r ${banner.bg} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {banner.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={banner.imageBase64} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold px-2 text-center leading-tight">{banner.title}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-navy text-sm truncate">{banner.title}</p>
                    <p className="text-xs text-brand-muted truncate">{banner.subtitle} — {banner.highlight}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBanner(banner.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.active ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-gray-100"
                      }`}
                      title={banner.active ? "Aktif" : "Nonaktif"}
                    >
                      {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => { setEditingBanner(banner); setShowForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddBanner}
                className="w-full p-4 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span className="text-sm font-semibold">Tambah Banner Baru</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {promoCards.map((promo, i) => (
                <div
                  key={promo.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
                    editingPromo?.id === promo.id
                      ? "border-brand ring-2 ring-brand/20"
                      : "border-brand-border hover:border-brand/50"
                  }`}
                >
                  <span className="text-brand-muted font-bold text-sm w-6">{i + 1}</span>

                  {/* Preview */}
                  <div className={`w-24 h-16 bg-gradient-to-br ${promo.bg} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {promo.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={promo.imageBase64} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold px-1 text-center leading-tight">{promo.title.split(" ")[0]}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-navy text-sm truncate">{promo.title}</p>
                    <p className="text-xs text-brand-muted truncate">{promo.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePromo(promo.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        promo.active ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-gray-100"
                      }`}
                    >
                      {promo.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => { setEditingPromo(promo); setShowForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddPromo}
                className="w-full p-4 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span className="text-sm font-semibold">Tambah Kartu Promo Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {showForm && tab === "banners" && editingBanner && (
          <BannerForm
            banner={editingBanner}
            onSave={(updates) => {
              updateBanner(editingBanner.id, updates);
              setBanners(getBanners());
              setEditingBanner({ ...editingBanner, ...updates });
            }}
            onClose={() => { setShowForm(false); setEditingBanner(null); }}
          />
        )}

        {showForm && tab === "promo" && editingPromo && (
          <PromoForm
            promo={editingPromo}
            onSave={(updates) => {
              updatePromoCard(editingPromo.id, updates);
              setPromoCards(getPromoCards());
              setEditingPromo({ ...editingPromo, ...updates });
            }}
            onClose={() => { setShowForm(false); setEditingPromo(null); }}
          />
        )}
      </div>
    </div>
  );
}

// ── Banner Form ──

function BannerForm({
  banner,
  onSave,
  onClose,
}: {
  banner: Banner;
  onSave: (updates: Partial<Banner>) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(banner);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maks 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm({ ...form, imageBase64: result });
      onSave({ imageBase64: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy">Edit Banner</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Gambar Banner</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
            {form.imageBase64 ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageBase64} alt="Banner" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setForm({ ...form, imageBase64: undefined }); onSave({ imageBase64: undefined }); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand"
              >
                <Upload size={24} />
                <span className="text-xs">Upload Gambar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-brand-muted mt-1">Rekomendasi: 1200x400px, maks 5MB</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Judul</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); onSave({ title: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => { setForm({ ...form, subtitle: e.target.value }); onSave({ subtitle: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Highlight (Teks Besar)</label>
          <input
            type="text"
            value={form.highlight}
            onChange={(e) => { setForm({ ...form, highlight: e.target.value }); onSave({ highlight: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) => { setForm({ ...form, description: e.target.value }); onSave({ description: e.target.value }); }}
            rows={2}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Tombol CTA</label>
          <input
            type="text"
            value={form.cta}
            onChange={(e) => { setForm({ ...form, cta: e.target.value }); onSave({ cta: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Link Tujuan</label>
          <input
            type="text"
            value={form.href}
            onChange={(e) => { setForm({ ...form, href: e.target.value }); onSave({ href: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Warna Background</label>
          <div className="grid grid-cols-4 gap-2">
            {gradientOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setForm({ ...form, bg: opt.value }); onSave({ bg: opt.value }); }}
                className={`h-8 rounded-lg bg-gradient-to-r ${opt.color} transition-all ${
                  form.bg === opt.value ? "ring-2 ring-brand ring-offset-2" : "hover:scale-105"
                }`}
                title={opt.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Promo Form ──

function PromoForm({
  promo,
  onSave,
  onClose,
}: {
  promo: PromoCard;
  onSave: (updates: Partial<PromoCard>) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(promo);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran foto maks 3MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setForm({ ...form, imageBase64: result });
      onSave({ imageBase64: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy">Edit Kartu Promo</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Gambar</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="w-full h-24 bg-gray-100 rounded-lg border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
            {form.imageBase64 ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageBase64} alt="Promo" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setForm({ ...form, imageBase64: undefined }); onSave({ imageBase64: undefined }); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand"
              >
                <Upload size={20} />
                <span className="text-xs">Upload Gambar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-brand-muted mt-1">Rekomendasi: 400x200px</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Judul</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); onSave({ title: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Harga / Teks Utama</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => { setForm({ ...form, price: e.target.value }); onSave({ price: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => { setForm({ ...form, description: e.target.value }); onSave({ description: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">Link Tujuan</label>
          <input
            type="text"
            value={form.href}
            onChange={(e) => { setForm({ ...form, href: e.target.value }); onSave({ href: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Warna Background</label>
          <div className="grid grid-cols-3 gap-2">
            {promoGradients.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setForm({ ...form, bg: opt.value }); onSave({ bg: opt.value }); }}
                className={`h-8 rounded-lg bg-gradient-to-r ${opt.color} transition-all ${
                  form.bg === opt.value ? "ring-2 ring-brand ring-offset-2" : "hover:scale-105"
                }`}
                title={opt.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
