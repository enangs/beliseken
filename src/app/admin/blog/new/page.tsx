"use client";

import { useRouter } from "next/navigation";
import { addBlogPost } from "@/data/products";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogPost } from "@/data/products";

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = (data: Omit<BlogPost, "id">) => {
    addBlogPost(data);
    router.push("/admin/blog");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Tulis Artikel Baru</h1>
        <p className="text-brand-muted text-sm mt-1">Buat artikel blog baru untuk website beliseken.com.</p>
      </div>
      <BlogForm onSubmit={handleSubmit} submitLabel="Terbitkan Artikel" />
    </div>
  );
}
