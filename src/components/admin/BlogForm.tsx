"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Save, ArrowLeft, Star, Loader2 } from "lucide-react";
import type { BlogPost } from "@/data/products";
import { uploadToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "./RichTextEditor";

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: Omit<BlogPost, "id"> & { id?: string }) => void;
  submitLabel: string;
}

const categoryOptions = ["Tips & Panduan", "Review", "Networking", "Laptop", "Smartphone", "Monitor", "Promo", "Berita"];

export default function BlogForm({ initialData, onSubmit, submitLabel }: BlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "Tips & Panduan");
  const [readTime, setReadTime] = useState(initialData?.readTime || "5 menit");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [imageBase64, setImageBase64] = useState(initialData?.imageBase64 || "");
  const [imagePreview, setImagePreview] = useState(initialData?.imageBase64 || "");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim());
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Ukuran foto maks 5MB" }));
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "beliseken/blog");
      if (result) {
        setImageBase64(result.url);
        setImagePreview(result.url);
        setErrors((prev) => ({ ...prev, photo: "" }));
      } else {
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (ev) => {
          const base64 = ev.target?.result as string;
          setImageBase64(base64);
          setImagePreview(base64);
          setErrors((prev) => ({ ...prev, photo: "" }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, photo: "Gagal upload gambar" }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = () => {
    setImageBase64("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Judul wajib diisi";
    if (!slug.trim()) errs.slug = "Slug wajib diisi";
    if (!excerpt.trim()) errs.excerpt = "Excerpt wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const data: Omit<BlogPost, "id"> & { id?: string } = {
      ...(initialData ? { id: initialData.id } : {}),
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      date: initialData?.date || `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
      readTime,
      image: initialData?.image || "/blog/default.jpg",
      imageBase64: imageBase64 || undefined,
      featured,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">Gambar Sampul</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64 h-36 bg-gray-100 rounded-xl border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagePreview ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removePhoto} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                  <X size={12} />
                </button>
              </div>
            ) : uploading ? (
              <div className="flex flex-col items-center gap-2 text-brand">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs">Mengupload...</span>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-brand-muted hover:text-brand transition-colors">
                <Upload size={24} />
                <span className="text-xs font-medium">Upload Gambar</span>
              </button>
            )}
          </div>
          <div className="flex-1">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Pilih dari Komputer
            </button>
            <p className="text-xs text-brand-muted mt-2">Format: JPG, PNG, WebP. Maks 5MB. Tersimpan di Cloudinary.</p>
            {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h2 className="font-bold text-brand-navy mb-4">Informasi Artikel</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Judul Artikel *</label>
            <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Judul yang menarik..." className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="judul-artikel" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all font-mono" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-1">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand bg-white">
                {categoryOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-1">Waktu Baca</label>
              <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="5 menit" className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Ringkasan (Excerpt) *</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Ringkasan singkat artikel..." className="w-full px-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand resize-none" />
            {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-1">Konten Artikel</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Tulis konten artikel di sini... Gunakan toolbar untuk format teks, heading, list, link, gambar."
              minHeight={300}
            />
            <p className="text-xs text-brand-muted mt-2">
              💡 Gunakan toolbar untuk format: <strong>Bold</strong>, <em>Italic</em>, Heading, List, Link, Gambar. 
              Paste dari Word/Google Docs juga didukung.
            </p>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-brand-border" />
              <Star size={14} className="text-amber-400" />
              <span className="text-sm font-semibold text-brand-navy">Jadikan Artikel Unggulan (Featured)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 border border-brand-border text-brand-navy hover:bg-brand-gray font-semibold rounded-xl text-sm transition-colors">
          <ArrowLeft size={16} />
          Batal
        </button>
        <button type="submit" disabled={uploading} className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
