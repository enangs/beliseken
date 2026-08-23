"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Save, ArrowLeft } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id"> & { id?: string }) => void;
  submitLabel: string;
}

const badgeOptions: Product["badge"][] = ["HOT DEAL", "BEST SELLER", "NEW"];
const conditionOptions = ["Like New", "Grade A", "Grade B+", "Grade B", "Grade C"];
const subcategoryOptions = [
  "Laptop",
  "Laptop Gaming",
  "Smartphone",
  "Tablet",
  "Monitor",
  "Mouse",
  "Keyboard",
  "Router",
  "Switch",
  "Access Point",
  "Printer",
  "Speaker",
  "Headphone",
  "Kamera",
  "Lainnya",
];

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [imageBase64, setImageBase64] = useState(initialData?.imageBase64 || "");
  const [imagePreview, setImagePreview] = useState(initialData?.imageBase64 || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  };

  // Auto-calculate discount
  const handlePriceChange = (val: string) => {
    setPrice(val);
    if (originalPrice && val) {
      const p = parseInt(val);
      const op = parseInt(originalPrice);
      if (op > 0) {
        setDiscount(String(Math.round(((op - p) / op) * 100)));
      }
    }
  };

  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    if (price && val) {
      const p = parseInt(price);
      const op = parseInt(val);
      if (op > 0) {
        setDiscount(String(Math.round(((op - p) / op) * 100)));
      }
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Ukuran foto maks 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
      setErrors((prev) => ({ ...prev, photo: "" }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setImageBase64("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      name: name.trim(),
      slug: slug.trim(),
      category: "Elektronik Bekas",
      subcategory,
      brand: brand.trim(),
      price: parseInt(price),
      originalPrice: parseInt(originalPrice),
      discount: parseInt(discount || "0"),
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount || "0"),
      condition,
      badge,
      image: initialData?.image || "/products/placeholder.jpg",
      imageBase64: imageBase64 || undefined,
      description: description.trim(),
      specs: specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
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
      {/* Photo Upload */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📷 Foto Produk</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Preview */}
          <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagePreview ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-brand-muted hover:text-brand transition-colors"
              >
                <Upload size={28} />
                <span className="text-xs font-medium">Upload Foto</span>
              </button>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand font-semibold text-sm rounded-lg transition-colors"
            >
              📁 Pilih Foto dari Komputer
            </button>
            <p className="text-xs text-brand-muted mt-2">
              Format: JPG, PNG, WebP. Maks 5MB. Foto produk akan ditampilkan di halaman katalog dan detail.
            </p>
            {errors.photo && (
              <p className="text-xs text-red-500 mt-1">{errors.photo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📝 Informasi Dasar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: MacBook Air M1 2020"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="macbook-air-m1-2020"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono"
            />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Brand *
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Apple, Dell, Lenovo..."
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Subkategori
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
            >
              {subcategoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Kondisi
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
            >
              {conditionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">💰 Harga</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Harga Asli (Rp) *
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => handleOriginalPriceChange(e.target.value)}
              placeholder="Contoh: 12999000"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {errors.originalPrice && <p className="text-xs text-red-500 mt-1">{errors.originalPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Harga Jual (Rp) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="Contoh: 6500000"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Diskon (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Auto"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Weight & Dimensions */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📦 Berat & Dimensi (untuk Pengiriman)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Berat (gram)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 1290 (untuk MacBook Air)"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <p className="text-xs text-brand-muted mt-1">Digunakan untuk menghitung ongkos kirim</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Dimensi (PxLxT)
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="Contoh: 30.41 x 21.24 x 1.61 cm"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <p className="text-xs text-brand-muted mt-1">Panjang x Lebar x Tinggi dalam cm</p>
          </div>
        </div>
      </div>

      {/* Stock & Supplier */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">📦 Inventori & Supplier</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Stok (Unit) *
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Jumlah stok"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <p className="text-xs text-brand-muted mt-1">Set 0 untuk SOLD OUT</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Supplier
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Nama supplier / penjual"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
            >
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
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Jumlah Review
            </label>
            <input
              type="number"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Badge
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setBadge(badge === undefined ? undefined : undefined)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  !badge ? "bg-brand-navy text-white border-brand-navy" : "border-brand-border hover:bg-brand-gray"
                }`}
              >
                Tanpa Badge
              </button>
              {badgeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBadge(opt)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    badge === opt ? "bg-brand text-white border-brand" : "border-brand-border hover:bg-brand-gray"
                  }`}
                >
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
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Deskripsi Produk
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat tentang produk..."
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">
              Spesifikasi (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="8GB RAM, 256GB SSD, M1 Chip, 13.3 inch"
              className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            {specs && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {specs
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2.5 border border-brand-border text-brand-navy hover:bg-brand-gray font-semibold rounded-xl text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Save size={16} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
