"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Save, ArrowLeft, Plus, Loader2 } from "lucide-react";
import type { Product } from "@/data/products";
import { uploadToCloudinary, CLOUDINARY_CONFIG } from "@/lib/cloudinary";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id"> & { id?: string }) => void;
  submitLabel: string;
}

const badgeOptions: Product["badge"][] = ["HOT DEAL", "BEST SELLER", "NEW"];
const conditionOptions = ["Like New", "Grade A", "Grade B+", "Grade B", "Grade C"];
const subcategoryOptions = [
  "Laptop", "Laptop Gaming", "Smartphone", "Tablet", "Monitor",
  "Mouse", "Keyboard", "Router", "Switch", "Access Point",
  "Printer", "Speaker", "Headphone", "Kamera", "Lainnya",
];

const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 5;

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo state - store Cloudinary URLs or base64
  const [photos, setPhotos] = useState<string[]>(initialData?.images || (initialData?.imageBase64 ? [initialData.imageBase64] : []));
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const [sku, setSku] = useState(initialData?.sku || "");
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "Laptop");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice?.toString() || "");
  const [discount, setDiscount] = useState(initialData?.discount?.toString() || "");
  const [condition, setCondition] = useState(initialData?.condition || "Grade A");
  const [badge, setBadge] = useState<Product["badge"]>(initialData?.badge || undefined);
  const [rating, setRating] = useState(initialData?.rating?.toString() || "4.5");
  const [reviewCount, setReviewCount] = useState(initialData?.reviewCount?.toString() || "0");
  const [description, setDescription] = useState(initialData?.description || "");
  const [specs, setSpecs] = useState(initialData?.specs?.join(", ") || "");
  const [weight, setWeight] = useState(initialData?.weight?.toString() || "");
  const [dimensions, setDimensions] = useState(initialData?.dimensions || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "1");
  const [supplier, setSupplier] = useState(initialData?.supplier || "");
  const [status, setStatus] = useState<Product["status"]>(initialData?.status || "ACTIVE");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim());
    }
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    if (originalPrice && val) {
      const p = parseInt(val);
      const op = parseInt(originalPrice);
      if (op > 0) setDiscount(String(Math.round(((op - p) / op) * 100)));
    }
  };

  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    if (price && val) {
      const p = parseInt(price);
      const op = parseInt(val);
      if (op > 0) setDiscount(String(Math.round(((op - p) / op) * 100)));
    }
  };

  // Compress image client-side before upload
  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      // Skip if already small
      if (file.size < 200 * 1024) { resolve(file); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', quality);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload photo to Cloudinary — PARALLEL + compressed
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    if (filesToProcess.length < files.length) {
      setErrors((prev) => ({ ...prev, photo: `Maks ${MAX_PHOTOS} foto. Hanya ${filesToProcess.length} yang ditambahkan.` }));
    }

    // Validate sizes
    const validFiles = filesToProcess.filter((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: `${file.name} terlalu besar (maks ${MAX_SIZE_MB}MB)` }));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(`Mengupload ${validFiles.length} foto...`);

    try {
      // Compress all files in parallel
      const compressedFiles = await Promise.all(validFiles.map(f => compressImage(f)));
      
      // Upload ALL to Cloudinary in parallel (not sequential)
      const uploadResults = await Promise.all(
        compressedFiles.map((file) => uploadToCloudinary(file, "beliseken/products"))
      );

      const uploadedUrls: string[] = [];
      for (let i = 0; i < uploadResults.length; i++) {
        if (uploadResults[i]) {
          uploadedUrls.push(uploadResults[i]!.url);
        } else {
          // Fallback to base64 only if Cloudinary fails
          const base64 = await fileToBase64(validFiles[i]);
          uploadedUrls.push(base64);
        }
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
      setUploadProgress("");
      setErrors((prev) => ({ ...prev, photo: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, photo: "Gagal upload foto. Coba lagi." }));
    }

    setUploading(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Convert file to base64 as fallback
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (mainPhotoIndex >= photos.length - 1) {
      setMainPhotoIndex(Math.max(0, photos.length - 2));
    }
  };

  const setAsMain = (index: number) => {
    setMainPhotoIndex(index);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nama produk wajib diisi";
    if (!slug.trim()) errs.slug = "Slug wajib diisi";
    if (!brand.trim()) errs.brand = "Brand wajib diisi";
    if (!price || parseInt(price) <= 0) errs.price = "Harga harus lebih dari 0";
    if (!originalPrice || parseInt(originalPrice) <= 0) errs.originalPrice = "Harga asli wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: Omit<Product, "id"> & { id?: string } = {
      ...(initialData ? { id: initialData.id } : {}),
      sku: sku.trim() || `BS-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim(),
      category: initialData?.category || "Elektronik Bekas",
      subcategory,
      brand: brand.trim(),
      price: parseInt(price),
      originalPrice: parseInt(originalPrice),
      discount: parseInt(discount || "0"),
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount || "0"),
      condition,
      badge,
      image: photos[mainPhotoIndex] || initialData?.image || "/products/placeholder.jpg",
      imageBase64: photos[mainPhotoIndex] || undefined,
      images: photos.length > 0 ? photos : undefined,
      description: description.trim(),
      specs: specs.split(",").map((s) => s.trim()).filter(Boolean),
      weight: weight ? parseInt(weight) : undefined,
      dimensions: dimensions.trim() || undefined,
      stock: stock ? parseInt(stock) : 1,
      supplier: supplier.trim(),
      status: status || "ACTIVE",
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload - Multiple */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-brand-navy">📷 Foto Produk ({photos.length}/{MAX_PHOTOS})</h2>
          <span className="text-xs text-brand-muted">Foto pertama = foto utama</span>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative aspect-square bg-gray-100 rounded-xl border-2 overflow-hidden group ${
                index === mainPhotoIndex
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-brand-border hover:border-brand/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />

              {index === mainPhotoIndex && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand text-white text-[9px] font-bold rounded">
                  UTAMA
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {index !== mainPhotoIndex && (
                  <button
                    type="button"
                    onClick={() => setAsMain(index)}
                    className="px-2 py-1 bg-white/90 text-brand-navy text-[10px] font-semibold rounded hover:bg-white transition-colors"
                  >
                    Jadikan Utama
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          {photos.length < MAX_PHOTOS && !uploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-brand-border flex flex-col items-center justify-center gap-2 text-brand-muted hover:text-brand hover:border-brand/50 transition-all"
            >
              <Plus size={24} />
              <span className="text-[10px] font-medium">Tambah Foto</span>
            </button>
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

        {/* Upload Progress */}
        {uploading && (
          <div className="flex items-center gap-3 p-3 bg-brand/5 rounded-lg mb-3">
            <Loader2 size={18} className="animate-spin text-brand" />
            <span className="text-sm text-brand font-medium">{uploadProgress}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photos.length >= MAX_PHOTOS || uploading}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 ${
              photos.length >= MAX_PHOTOS || uploading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-brand/10 hover:bg-brand/20 text-brand"
            }`}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : "📁"}
            Pilih Foto ({MAX_PHOTOS - photos.length} slot tersisa)
          </button>
          {errors.photo && <p className="text-xs text-red-500">{errors.photo}</p>}
        </div>
        <p className="text-xs text-brand-muted mt-2">
          Format: JPG, PNG, WebP. Maks {MAX_SIZE_MB}MB per foto. Max {MAX_PHOTOS} foto per produk.
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📝 Informasi Dasar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">SKU *</label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="BS-LP-001" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono" />
            <p className="text-xs text-brand-muted mt-1">Kode unik produk (BS-LP-001, BS-SP-002, dst)</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="macbook-air-m1-2020" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Brand *</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Apple, Dell, Lenovo..." className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Subkategori</label>
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white">
              {subcategoryOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Kondisi</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white">
              {conditionOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">💰 Harga</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Harga Asli (Rp) *</label>
            <input type="number" value={originalPrice} onChange={(e) => handleOriginalPriceChange(e.target.value)} placeholder="Contoh: 12999000" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            {errors.originalPrice && <p className="text-xs text-red-500 mt-1">{errors.originalPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Harga Jual (Rp) *</label>
            <input type="number" value={price} onChange={(e) => handlePriceChange(e.target.value)} placeholder="Contoh: 6500000" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Diskon (%)</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Auto" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-gray-50" readOnly />
          </div>
        </div>
      </div>

      {/* Weight & Dimensions */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">Berat & Dimensi (untuk Pengiriman)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Berat (gram)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Contoh: 1290" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            <p className="text-xs text-brand-muted mt-1">Untuk menghitung ongkos kirim</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Dimensi (PxLxT)</label>
            <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Contoh: 30.41 x 21.24 x 1.61 cm" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>
        </div>
      </div>

      {/* Stock & Supplier */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">Inventori & Supplier</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Stok (Unit) *</label>
            <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Jumlah stok" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            <p className="text-xs text-brand-muted mt-1">Set 0 untuk SOLD OUT</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Supplier</label>
            <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Nama supplier / penjual" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white">
              <option value="ACTIVE">Aktif (Tersedia)</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="RESERVED">Reserved (Ditahan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating & Badge */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">⭐ Rating & Badge</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Rating</label>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Jumlah Review</label>
            <input type="number" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Badge</label>
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={() => setBadge(undefined)} className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${!badge ? "bg-brand-navy text-white border-brand-navy" : "border-brand-border hover:bg-brand-gray"}`}>
                Tanpa Badge
              </button>
              {badgeOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => setBadge(opt)} className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${badge === opt ? "bg-brand text-white border-brand" : "border-brand-border hover:bg-brand-gray"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📋 Deskripsi & Spesifikasi</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Deskripsi Produk</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Deskripsi singkat tentang produk..." className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Spesifikasi (pisahkan dengan koma)</label>
            <input type="text" value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder="8GB RAM, 256GB SSD, M1 Chip, 13.3 inch" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            {specs && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {specs.split(",").map((s) => s.trim()).filter(Boolean).map((spec, i) => (
                  <span key={i} className="px-2.5 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full">{spec}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 border border-brand-border text-brand-navy hover:bg-brand-gray font-semibold rounded-xl text-sm transition-colors">
          <ArrowLeft size={16} /> Batal
        </button>
        <button type="submit" disabled={uploading} className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
