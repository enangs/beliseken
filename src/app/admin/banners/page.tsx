"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus, Trash2, Upload, X, Eye, EyeOff, Loader2,
} from "lucide-react";
import {
  getBanners, saveBanners, addBanner, updateBanner, deleteBanner,
  getPromoCards, savePromoCards, addPromoCard, updatePromoCard, deletePromoCard,
  getHorizontalPromos, saveHorizontalPromos, addHorizontalPromo, updateHorizontalPromo, deleteHorizontalPromo,
  type Banner, type PromoCard, type HorizontalPromo,
} from "@/lib/banners";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

const horizontalGradients = [
  { value: "from-blue-500 to-blue-700", label: "Biru", color: "from-blue-500 to-blue-700" },
  { value: "from-emerald-500 to-emerald-700", label: "Hijau", color: "from-emerald-500 to-emerald-700" },
  { value: "from-purple-500 to-purple-700", label: "Ungu", color: "from-purple-500 to-purple-700" },
  { value: "from-orange-500 to-orange-700", label: "Orange", color: "from-orange-500 to-orange-700" },
  { value: "from-rose-500 to-rose-700", label: "Merah", color: "from-rose-500 to-rose-700" },
  { value: "from-cyan-500 to-cyan-700", label: "Cyan", color: "from-cyan-500 to-cyan-700" },
  { value: "from-gray-700 to-gray-900", label: "Gelap", color: "from-gray-700 to-gray-900" },
];

type Tab = "banners" | "promo" | "horizontal";

export default function BannersPage() {
  const [tab, setTab] = useState<Tab>("banners");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);
  const [horizontalPromos, setHorizontalPromos] = useState<HorizontalPromo[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoCard | null>(null);
  const [editingHorizontal, setEditingHorizontal] = useState<HorizontalPromo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBanners().then(setBanners).catch(() => {});
    getPromoCards().then(setPromoCards).catch(() => {});
    getHorizontalPromos().then(setHorizontalPromos).catch(() => {});
  }, []);

  const handleSaveBanners = async () => {
    await saveBanners(banners);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePromoCards = async () => {
    await savePromoCards(promoCards);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reloadAll = async () => {
    const b = await getBanners();
    setBanners(b);
    const p = await getPromoCards();
    setPromoCards(p);
    const h = await getHorizontalPromos();
    setHorizontalPromos(h);
  };

  const handleAddBanner = async () => {
    const newBanner = await addBanner({
      title: "Banner Baru", subtitle: "Subtitle", highlight: "Highlight",
      description: "Deskripsi banner", cta: "Lihat Sekarang", href: "/products",
      bg: "from-brand to-brand-dark", active: true,
    });
    await reloadAll();
    setEditingBanner(newBanner);
    setShowForm(true);
  };

  const handleAddPromo = async () => {
    const newPromo = await addPromoCard({
      title: "Kategori Baru", subtitle: "Mulai Rp100rb", price: "Mulai Rp100rb",
      description: "Deskripsi promo", href: "/products",
      bg: "from-blue-500 to-blue-600", active: true,
    });
    await reloadAll();
    setEditingPromo(newPromo);
    setShowForm(true);
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("Yakin ingin menghapus banner ini?")) {
      try {
        await deleteBanner(id);
        await reloadAll();
        if (editingBanner?.id === id) { setEditingBanner(null); setShowForm(false); }
      } catch (e: any) { alert("Gagal menghapus: " + e.message); }
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (confirm("Yakin ingin menghapus kartu promo ini?")) {
      try {
        await deletePromoCard(id);
        await reloadAll();
        if (editingPromo?.id === id) { setEditingPromo(null); setShowForm(false); }
      } catch (e: any) { alert("Gagal menghapus: " + e.message); }
    }
  };

  const handleAddHorizontal = async () => {
    const newPromo = await addHorizontalPromo({
      title: "Promo Baru", desc: "Deskripsi promo", bg: "from-blue-500 to-blue-700",
      href: "/products", active: true, sortOrder: horizontalPromos.length,
    });
    await reloadAll();
    setEditingHorizontal(newPromo);
    setShowForm(true);
  };

  const handleDeleteHorizontal = async (id: string) => {
    if (confirm("Yakin ingin menghapus promo ini?")) {
      try {
        await deleteHorizontalPromo(id);
        await reloadAll();
        if (editingHorizontal?.id === id) { setEditingHorizontal(null); setShowForm(false); }
      } catch (e: any) { alert("Gagal menghapus: " + e.message); }
    }
  };

  const handleToggleHorizontal = async (id: string) => {
    const promo = horizontalPromos.find((p) => p.id === id);
    if (promo) { await updateHorizontalPromo(id, { active: !promo.active }); await reloadAll(); }
  };

  const handleToggleBanner = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) { await updateBanner(id, { active: !banner.active }); await reloadAll(); }
  };

  const handleTogglePromo = async (id: string) => {
    const promo = promoCards.find((c) => c.id === id);
    if (promo) { await updatePromoCard(id, { active: !promo.active }); await reloadAll(); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Kelola Banner & Promo</h1>
          <p className="text-brand-muted text-sm mt-1">Atur banner hero dan kartu promo di halaman depan</p>
        </div>
        {saved && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold animate-pulse">
            ✓ Tersimpan!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setTab("banners"); setShowForm(false); setEditingBanner(null); setEditingPromo(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "banners" ? "bg-brand text-white" : "bg-white text-brand-navy border border-brand-border hover:bg-brand/5"}`}>
          Banner Hero ({banners.length})
        </button>
        <button onClick={() => { setTab("promo"); setShowForm(false); setEditingBanner(null); setEditingPromo(null); setEditingHorizontal(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "promo" ? "bg-brand text-white" : "bg-white text-brand-navy border border-brand-border hover:bg-brand/5"}`}>
          Kartu Promo ({promoCards.length})
        </button>
        <button onClick={() => { setTab("horizontal"); setShowForm(false); setEditingBanner(null); setEditingPromo(null); setEditingHorizontal(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "horizontal" ? "bg-brand text-white" : "bg-white text-brand-navy border border-brand-border hover:bg-brand/5"}`}>
          Promo Horizontal ({horizontalPromos.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {tab === "banners" ? (
            <div className="space-y-3">
              {banners.map((banner, i) => (
                <div key={banner.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${editingBanner?.id === banner.id ? "border-brand ring-2 ring-brand/20" : "border-brand-border hover:border-brand/50"}`}>
                  <span className="text-brand-muted font-bold text-sm w-6">{i + 1}</span>
                  <div className={`w-32 h-16 bg-gradient-to-r ${banner.bg} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {banner.imageBase64 ? (
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
                    <button onClick={() => handleToggleBanner(banner.id)}
                      className={`p-2 rounded-lg transition-colors ${banner.active ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-gray-100"}`}>
                      {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setEditingBanner(banner); setShowForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10 rounded-lg">Edit</button>
                    <button onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button onClick={handleAddBanner}
                className="w-full p-4 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /><span className="text-sm font-semibold">Tambah Banner Baru</span>
              </button>
            </div>
          ) : tab === "promo" ? (
            <div className="space-y-3">
              {promoCards.map((promo, i) => (
                <div key={promo.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${editingPromo?.id === promo.id ? "border-brand ring-2 ring-brand/20" : "border-brand-border hover:border-brand/50"}`}>
                  <span className="text-brand-muted font-bold text-sm w-6">{i + 1}</span>
                  <div className={`w-24 h-16 bg-gradient-to-br ${promo.bg} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    {promo.imageBase64 ? (
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
                    <button onClick={() => handleTogglePromo(promo.id)}
                      className={`p-2 rounded-lg transition-colors ${promo.active ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-gray-100"}`}>
                      {promo.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setEditingPromo(promo); setShowForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10 rounded-lg">Edit</button>
                    <button onClick={() => handleDeletePromo(promo.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button onClick={handleAddPromo}
                className="w-full p-4 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /><span className="text-sm font-semibold">Tambah Kartu Promo Baru</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {horizontalPromos.map((promo, i) => (
                <div key={promo.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${editingHorizontal?.id === promo.id ? "border-brand ring-2 ring-brand/20" : "border-brand-border hover:border-brand/50"}`}>
                  <span className="text-brand-muted font-bold text-sm w-6">{i + 1}</span>
                  <div className="w-32 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {promo.imageBase64 ? (
                      <img src={promo.imageBase64} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-r ${promo.bg} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold px-2 text-center leading-tight">{promo.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-navy text-sm truncate">{promo.title}</p>
                    <p className="text-xs text-brand-muted truncate">{promo.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleHorizontal(promo.id)}
                      className={`p-2 rounded-lg transition-colors ${promo.active ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-gray-100"}`}>
                      {promo.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setEditingHorizontal(promo); setShowForm(true); }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10 rounded-lg">Edit</button>
                    <button onClick={() => handleDeleteHorizontal(promo.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button onClick={handleAddHorizontal}
                className="w-full p-4 border-2 border-dashed border-brand-border rounded-xl text-brand-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /><span className="text-sm font-semibold">Tambah Promo Horizontal Baru</span>
              </button>
            </div>
          )}
        </div>

        {showForm && tab === "banners" && editingBanner && (
          <BannerForm banner={editingBanner}
            onSave={async (updates) => {
              try {
                await updateBanner(editingBanner.id, updates);
                await reloadAll();
                setEditingBanner({ ...editingBanner, ...updates });
              } catch (e: any) { alert("Gagal menyimpan: " + e.message); }
            }}
            onClose={() => { setShowForm(false); setEditingBanner(null); }} />
        )}
        {showForm && tab === "promo" && editingPromo && (
          <PromoForm promo={editingPromo}
            onSave={async (updates) => {
              try {
                await updatePromoCard(editingPromo.id, updates);
                await reloadAll();
                setEditingPromo({ ...editingPromo, ...updates });
              } catch (e: any) { alert("Gagal menyimpan: " + e.message); }
            }}
            onClose={() => { setShowForm(false); setEditingPromo(null); }} />
        )}
        {showForm && tab === "horizontal" && editingHorizontal && (
          <HorizontalPromoForm promo={editingHorizontal}
            onSave={async (updates) => {
              try {
                await updateHorizontalPromo(editingHorizontal.id, updates);
                await reloadAll();
                setEditingHorizontal({ ...editingHorizontal, ...updates });
              } catch (e: any) { alert("Gagal menyimpan: " + e.message); }
            }}
            onClose={() => { setShowForm(false); setEditingHorizontal(null); }} />
        )}
      </div>
    </div>
  );
}

// ── Banner Form with Cloudinary ──
function BannerForm({ banner, onSave, onClose }: { banner: Banner; onSave: (updates: Partial<Banner>) => void; onClose: () => void; }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(banner);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ukuran foto maks 5MB"); return; }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "beliseken/banners");
      if (result) {
        setForm({ ...form, imageBase64: result.url });
        onSave({ imageBase64: result.url });
      } else {
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target?.result as string;
          setForm({ ...form, imageBase64: base64 });
          onSave({ imageBase64: base64 });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert("Gagal upload gambar");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy">Edit Banner</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Gambar Banner</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
            {form.imageBase64 ? (
              <div className="relative w-full h-full">
                <img src={form.imageBase64} alt="Banner" className="w-full h-full object-cover" />
                <button onClick={() => { setForm({ ...form, imageBase64: undefined }); onSave({ imageBase64: undefined }); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">✕</button>
              </div>
            ) : uploading ? (
              <div className="flex items-center gap-2 text-brand"><Loader2 size={20} className="animate-spin" /> <span className="text-sm">Mengupload...</span></div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand">
                <Upload size={24} /><span className="text-xs">Upload Gambar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-brand-muted mt-1">Rekomendasi: 1200x400px, maks 5MB. Tersimpan di Cloudinary.</p>
        </div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Judul</label>
          <input type="text" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); onSave({ title: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Subtitle</label>
          <input type="text" value={form.subtitle} onChange={(e) => { setForm({ ...form, subtitle: e.target.value }); onSave({ subtitle: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Highlight (Teks Besar)</label>
          <input type="text" value={form.highlight} onChange={(e) => { setForm({ ...form, highlight: e.target.value }); onSave({ highlight: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi</label>
          <textarea value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }); onSave({ description: e.target.value }); }}
            rows={2} className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand resize-none" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Tombol CTA</label>
          <input type="text" value={form.cta} onChange={(e) => { setForm({ ...form, cta: e.target.value }); onSave({ cta: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Link Tujuan</label>
          <input type="text" value={form.href} onChange={(e) => { setForm({ ...form, href: e.target.value }); onSave({ href: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand font-mono" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-2">Warna Background</label>
          <div className="grid grid-cols-4 gap-2">
            {gradientOptions.map((opt) => (
              <button key={opt.value} onClick={() => { setForm({ ...form, bg: opt.value }); onSave({ bg: opt.value }); }}
                className={`h-8 rounded-lg bg-gradient-to-r ${opt.color} transition-all ${form.bg === opt.value ? "ring-2 ring-brand ring-offset-2" : "hover:scale-105"}`}
                title={opt.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Promo Form with Cloudinary ──
function PromoForm({ promo, onSave, onClose }: { promo: PromoCard; onSave: (updates: Partial<PromoCard>) => void; onClose: () => void; }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(promo);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Ukuran foto maks 3MB"); return; }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "beliseken/promos");
      if (result) {
        setForm({ ...form, imageBase64: result.url });
        onSave({ imageBase64: result.url });
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target?.result as string;
          setForm({ ...form, imageBase64: base64 });
          onSave({ imageBase64: base64 });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert("Gagal upload gambar");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy">Edit Kartu Promo</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Gambar</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="w-full h-24 bg-gray-100 rounded-lg border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
            {form.imageBase64 ? (
              <div className="relative w-full h-full">
                <img src={form.imageBase64} alt="Promo" className="w-full h-full object-cover" />
                <button onClick={() => { setForm({ ...form, imageBase64: undefined }); onSave({ imageBase64: undefined }); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">✕</button>
              </div>
            ) : uploading ? (
              <div className="flex items-center gap-2 text-brand"><Loader2 size={18} className="animate-spin" /> <span className="text-sm">Mengupload...</span></div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand">
                <Upload size={20} /><span className="text-xs">Upload Gambar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-brand-muted mt-1">Rekomendasi: 400x200px. Tersimpan di Cloudinary.</p>
        </div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Judul</label>
          <input type="text" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); onSave({ title: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Harga / Teks Utama</label>
          <input type="text" value={form.price} onChange={(e) => { setForm({ ...form, price: e.target.value }); onSave({ price: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi</label>
          <input type="text" value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }); onSave({ description: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Link Tujuan</label>
          <input type="text" value={form.href} onChange={(e) => { setForm({ ...form, href: e.target.value }); onSave({ href: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand font-mono" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-2">Warna Background</label>
          <div className="grid grid-cols-3 gap-2">
            {promoGradients.map((opt) => (
              <button key={opt.value} onClick={() => { setForm({ ...form, bg: opt.value }); onSave({ bg: opt.value }); }}
                className={`h-8 rounded-lg bg-gradient-to-r ${opt.color} transition-all ${form.bg === opt.value ? "ring-2 ring-brand ring-offset-2" : "hover:scale-105"}`}
                title={opt.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Horizontal Promo Form with Image Upload ──
function HorizontalPromoForm({ promo, onSave, onClose }: { promo: HorizontalPromo; onSave: (updates: Partial<HorizontalPromo>) => void; onClose: () => void; }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(promo);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Ukuran foto maks 3MB"); return; }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "beliseken/horizontal-promos");
      if (result) {
        setForm({ ...form, imageBase64: result.url });
        onSave({ imageBase64: result.url });
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target?.result as string;
          setForm({ ...form, imageBase64: base64 });
          onSave({ imageBase64: base64 });
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert("Gagal upload gambar");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-navy">Edit Promo Horizontal</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">Gambar Background</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="w-full h-28 bg-gray-100 rounded-lg border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden">
            {form.imageBase64 ? (
              <div className="relative w-full h-full">
                <img src={form.imageBase64} alt="Promo" className="w-full h-full object-cover" />
                <button onClick={() => { setForm({ ...form, imageBase64: undefined }); onSave({ imageBase64: undefined }); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">✕</button>
              </div>
            ) : uploading ? (
              <div className="flex items-center gap-2 text-brand"><Loader2 size={18} className="animate-spin" /> <span className="text-sm">Mengupload...</span></div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand">
                <Upload size={20} /><span className="text-xs">Upload Gambar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-brand-muted mt-1">Rekomendasi: 400x200px. Gambar akan jadi background kartu promo. Tersimpan di Cloudinary.</p>
        </div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Judul</label>
          <input type="text" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); onSave({ title: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi</label>
          <input type="text" value={form.desc} onChange={(e) => { setForm({ ...form, desc: e.target.value }); onSave({ desc: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-1">Link Tujuan</label>
          <input type="text" value={form.href} onChange={(e) => { setForm({ ...form, href: e.target.value }); onSave({ href: e.target.value }); }}
            className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm outline-none focus:border-brand font-mono" /></div>
        <div><label className="block text-sm font-semibold text-brand-navy mb-2">Warna Background (tanpa gambar)</label>
          <div className="grid grid-cols-4 gap-2">
            {horizontalGradients.map((opt) => (
              <button key={opt.value} onClick={() => { setForm({ ...form, bg: opt.value }); onSave({ bg: opt.value }); }}
                className={`h-8 rounded-lg bg-gradient-to-r ${opt.color} transition-all ${form.bg === opt.value ? "ring-2 ring-brand ring-offset-2" : "hover:scale-105"}`}
                title={opt.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
