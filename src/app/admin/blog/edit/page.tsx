"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBlogPostById, updateBlogPost } from "@/data/products";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/data/products";

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const p = getBlogPostById(id);
    if (p) setPost(p);
    else setNotFound(true);
  }, [id]);

  const handleSubmit = (data: Omit<BlogPost, "id"> & { id?: string }) => {
    if (data.id) updateBlogPost(data.id, data);
    router.push("/admin/blog");
  };

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-brand-navy font-semibold text-lg">Artikel tidak ditemukan</p>
        <button onClick={() => router.push("/admin/blog")} className="mt-4 text-brand hover:text-brand-dark font-medium text-sm">
          ← Kembali ke daftar artikel
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Edit Artikel</h1>
        <p className="text-brand-muted text-sm mt-1">
          Mengedit: <span className="font-semibold text-brand-navy">{post.title}</span>
        </p>
      </div>
      <BlogForm initialData={post} onSubmit={handleSubmit} submitLabel="Simpan Perubahan" />
    </div>
  );
}

export default function EditBlogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto" /></div>}>
      <EditBlogContent />
    </Suspense>
  );
}
