"use client";

import { useState, useRef } from "react";
import { Camera, CheckCircle, Upload, ArrowRight, ArrowLeft, Loader2, MessageCircle, X, ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth-api";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";

const steps = ["Info Dasar", "Foto Produk", "Kondisi Barang", "Harga & Kontak"];

const categories = [
  "Laptop & Notebook",
  "Smartphone & Tablet",
  "Monitor & TV",
  "Networking & IT",
  "Peripheral & Aksesoris",
  "Lainnya",
];

const conditions = ["Seperti Baru", "Bagus (Grade A)", "Biasa (Grade B)", "Rusak Ringan"];

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Upload photo to Cloudinary
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - formData.photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    setUploadProgress(`Mengupload 0/${filesToProcess.length} foto...`);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      setUploadProgress(`Mengupload ${i + 1}/${filesToProcess.length} foto...`);
      
      const file = filesToProcess[i];
      
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", compressedFile);
        formDataUpload.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
        formDataUpload.append("folder", "beliseken/sell-requests");
        formDataUpload.append("resource_type", "image");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...uploadedUrls],
    }));

    setUploading(false);
    setUploadProgress("");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Compress image before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (file.size < 200 * 1024) {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const maxSize = 1200;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user = getCurrentUser();
      const response = await fetch("/api/sell-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          askingPrice: formData.askingPrice ? parseInt(formData.askingPrice) : null,
          userId: user?.id || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setWhatsappLink(result.data.whatsappLink);
      } else {
        alert(result.error || "Gagal mengirim data. Silakan coba lagi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success page
  if (isSuccess) {
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
            <div className="bg-white rounded-2xl border border-brand-border p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy mb-3">Berhasil Dikirim!</h2>
              <p className="text-brand-muted mb-6">
                Data barang Anda sudah kami terima. Tim kami akan menghubungi Anda dalam <strong>1 jam</strong> via WhatsApp.
              </p>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-lg mb-4"
              >
                <MessageCircle size={24} />
                Hubungi Kami via WhatsApp
              </a>

              <p className="text-sm text-brand-muted mt-4">
                Atau chat langsung ke <strong>0851-0125-6123</strong>
              </p>

              {/* Summary */}
              <div className="mt-8 text-left bg-brand-gray rounded-xl p-6">
                <h3 className="font-bold text-brand-navy mb-3">Ringkasan:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-muted">Barang:</span>
                    <span className="ml-2 font-semibold">{formData.brand} {formData.model}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Kategori:</span>
                    <span className="ml-2 font-semibold">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Kondisi:</span>
                    <span className="ml-2 font-semibold">{formData.condition}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Harga:</span>
                    <span className="ml-2 font-semibold">
                      {formData.wantOffer ? "Minta Penawaran" : `Rp ${parseInt(formData.askingPrice || "0").toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-brand-muted">Foto:</span>
                    <span className="ml-2 font-semibold">{formData.photos.length} foto</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(0);
                  setFormData({
                    category: "",
                    subcategory: "",
                    brand: "",
                    model: "",
                    photos: [],
                    condition: "",
                    functionalCondition: "Semua Berfungsi",
                    damageDescription: "",
                    askingPrice: "",
                    wantOffer: false,
                    whatsapp: "",
                    location: "",
                  });
                }}
                className="mt-6 text-brand font-semibold hover:underline"
              >
                Jual Barang Lainnya →
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

            {/* Step 2: Photos - NOW WITH WORKING UPLOAD */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-brand-navy mb-4">LANGKAH 2/4: FOTO PRODUK</h2>
                
                {/* Upload Area */}
                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${
                    uploading 
                      ? "border-brand bg-brand/5" 
                      : "border-brand-border hover:border-brand hover:bg-brand/5"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={48} className="animate-spin text-brand mb-4" />
                      <p className="font-semibold text-brand-navy">{uploadProgress}</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="mx-auto text-brand-muted mb-4" />
                      <p className="font-semibold text-brand-navy mb-1">Klik atau seret foto ke sini</p>
                      <p className="text-sm text-brand-muted">
                        Minimal 3 foto, maksimal 10. Format: JPG/PNG/WebP (max 5MB per foto)
                      </p>
                    </>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* Uploaded Photos Preview */}
                {formData.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-brand-navy mb-3">
                      Foto yang diupload ({formData.photos.length}/10)
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={photo}
                            alt={`Foto ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-xl border border-brand-border"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(idx);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full">
                              Utama
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Tips */}
                <div className="bg-brand-gray rounded-xl p-4">
                  <p className="text-sm font-semibold text-brand-navy mb-2">Tips Foto:</p>
                  <ul className="text-xs text-brand-muted space-y-1">
                    <li>• Foto dari depan, sisi, belakang, dan detail kondisi barang</li>
                    <li>• Pastikan foto jelas dan tidak buram</li>
                    <li>• Tunjukkan bagian yang rusak/lecet jika ada</li>
                    <li>• Foto pertama akan menjadi foto utama</li>
                  </ul>
                </div>
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
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Kirim Barang
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
