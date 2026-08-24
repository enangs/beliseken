"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAdminBlogPosts, updateBlogPost } from "@/lib/blog-api";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/data/products";

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) { setNotFound(true); return; }
      
      try {
        const posts = await getAdminBlogPosts();
        const found = posts.find(p => p.id === id);
        if (found) {
          setPost(found);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
        setNotFound(true);
      }
    };
    loadPost();
  }, [id]);

  const handleSubmit = async (data: Omit<BlogPost, "id"> & { id?: string }) => {
    if (data.id) {
      await updateBlogPost(data.id, data);
    }
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
