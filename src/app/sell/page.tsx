"use client";

import { useState } from "react";
import { Camera, CheckCircle, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { storeInfo } from "@/data/products";

const steps = ["Info Dasar", "Foto Produk", "Kondisi Barang", "Harga & Kontak"];

const categories = [
  "Laptop & Notebook",
  "Smartphone & Tablet",
  "Monitor & TV",
  "Networking & IT",
  "Peripheral & Aksesoris",
  "Power Supply",
  "Lainnya",
];

const conditions = ["Seperti Baru", "Bagus (Grade A)", "Biasa (Grade B)", "Rusak Ringan"];

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    photos: [] as string[],
    condition: "",
    functionalCondition: "Semua Berfungsi",
    damageDescription: "",
    askingPrice: "",
    wantOffer: false,
    whatsapp: "",
    location: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert("Barang Anda berhasil dikirim! Tim kami akan menghubungi Anda dalam 1 jam via WhatsApp.");
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-gradient-to-r from-brand to-brand-dark py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Jual Barang Bekasmu</h1>
            <p className="text-white/80 text-lg">Isi data barangmu, kami akan kasih penawaran terbaik!</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                  i <= currentStep
                    ? "bg-brand text-white"
                    : "bg-gray-200 text-brand-muted"
                }`}>
                  {i < currentStep ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span className={`hidden sm:block ml-2 text-sm font-medium ${
                  i <= currentStep ? "text-brand-navy" : "text-brand-muted"
                }`}>
                  {step}
                </span>
                {i < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 h-0.5 mx-3 ${
                    i < currentStep ? "bg-brand" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 min-h-[400px]">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-brand-navy mb-4">LANGKAH 1/4: INFO DASAR</h2>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">Sub-Kategori</label>
                  <input
                    type="text"
                    placeholder="Contoh: Laptop Gaming, Router, dll"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Merek *</label>
                    <input
                      type="text"
                      placeholder="Contoh: Apple, Lenovo, Asus"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Model *</label>
                    <input
                      type="text"
                      placeholder="Contoh: MacBook Air M1"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-brand-navy mb-4">LANGKAH 2/4: FOTO PRODUK</h2>
                <div className="border-2 border-dashed border-brand-border rounded-2xl p-10 text-center hover:border-brand transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-brand-muted mb-4" />
                  <p className="font-semibold text-brand-navy mb-1">Klik atau seret foto ke sini</p>
                  <p className="text-sm text-brand-muted">Minimal 3 foto, maksimal 10. Format: JPG/PNG/WebP (max 2MB per foto)</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-brand-gray rounded-xl flex items-center justify-center border border-brand-border">
                      <Camera size={24} className="text-brand-muted/40" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-brand-muted">💡 Tips: Foto dari depan, sisi, belakang, dan detail kondisi barang</p>
              </div>
            )}

            {/* Step 3: Condition */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-brand-navy mb-4">LANGKAH 3/4: KONDISI BARANG</h2>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-3">Kondisi Fisik *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setFormData({ ...formData, condition: cond })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.condition === cond
                            ? "border-brand bg-brand/5"
                            : "border-brand-border hover:border-brand/50"
                        }`}
                      >
                        <span className="font-semibold text-sm text-brand-navy">{cond}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-3">Kondisi Fungsional *</label>
                  <div className="flex gap-3">
                    {["Semua Berfungsi", "Ada Masalah"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFormData({ ...formData, functionalCondition: opt })}
                        className={`px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          formData.functionalCondition === opt
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-brand-border text-brand-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">Deskripsi Kerusakan (jika ada)</label>
                  <textarea
                    placeholder="Jelaskan kondisi barang secara detail..."
                    value={formData.damageDescription}
                    onChange={(e) => setFormData({ ...formData, damageDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Price & Contact */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-brand-navy mb-4">LANGKAH 4/4: HARGA & KONTAK</h2>
                <div className="flex gap-4">
                  <label className="flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all border-brand bg-brand/5">
                    <input
                      type="radio"
                      name="priceType"
                      checked={!formData.wantOffer}
                      onChange={() => setFormData({ ...formData, wantOffer: false })}
                      className="hidden"
                    />
                    <span className="font-semibold text-sm text-brand">Tentukan Harga Sendiri</span>
                  </label>
                  <label className="flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all border-brand-border">
                    <input
                      type="radio"
                      name="priceType"
                      checked={formData.wantOffer}
                      onChange={() => setFormData({ ...formData, wantOffer: true })}
                      className="hidden"
                    />
                    <span className="font-semibold text-sm text-brand-navy">Minta Penawaran dari BeliSeken</span>
                  </label>
                </div>
                {!formData.wantOffer && (
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Harga yang Diinginkan *</label>
                    <div className="flex items-center bg-gray-100 rounded-xl">
                      <span className="pl-4 text-brand-muted font-semibold">Rp</span>
                      <input
                        type="number"
                        placeholder="Contoh: 6500000"
                        value={formData.askingPrice}
                        onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                        className="w-full bg-transparent px-3 py-3 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">No. WhatsApp *</label>
                  <input
                    type="tel"
                    placeholder="08XXXXXXXXXX"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">Lokasi *</label>
                  <input
                    type="text"
                    placeholder="Kota/Kabupaten"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                currentStep === 0
                  ? "text-brand-muted cursor-not-allowed"
                  : "text-brand-navy hover:bg-gray-100"
              }`}
            >
              <ArrowLeft size={16} />
              Sebelumnya
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors"
              >
                Selanjutnya
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
              >
                <CheckCircle size={16} />
                Kirim Barang
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
