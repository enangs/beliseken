"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Search } from "lucide-react";
import { getAdminBlogPosts, deleteBlogPost } from "@/lib/blog-api";
import type { BlogPost } from "@/data/products";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const blogPosts = await getAdminBlogPosts();
      setPosts(blogPosts);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (id: string) => {
    await deleteBlogPost(id);
    loadPosts();
    setDeleteConfirm(null);
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Semua Artikel</h1>
          <p className="text-brand-muted text-sm mt-1">{posts.length} artikel total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Plus size={16} />
          Tulis Artikel
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-brand-border p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-lg text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-brand-muted">Memuat artikel...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-muted bg-brand-gray border-b border-brand-border">
                  <th className="px-5 py-3 font-medium">Artikel</th>
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-5 py-3 font-medium">Tanggal</th>
                  <th className="px-5 py-3 font-medium">Featured</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {post.imageBase64 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.imageBase64} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">📄</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-navy line-clamp-1">{post.title}</p>
                          <p className="text-xs text-brand-muted">{post.readTime}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">{post.category}</span>
                    </td>
                    <td className="px-5 py-4 text-brand-muted text-sm">{post.date}</td>
                    <td className="px-5 py-4">
                      {post.featured ? (
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <span className="text-brand-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/edit?id=${post.id}`}
                          className="p-2 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        {deleteConfirm === post.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(post.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                              Ya, Hapus
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(post.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-brand-muted">
                      <p className="text-lg mb-2">📝</p>
                      <p>Belum ada artikel</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
