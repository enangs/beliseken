"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { registerUser } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.phone.trim() || !form.city.trim()) {
      setError("Semua field wajib diisi!");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    const result = await registerUser(form);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Gagal mendaftar!");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen flex items-center justify-center bg-brand-gray px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-navy">Buat Akun Baru</h1>
              <p className="text-sm text-brand-muted mt-1">Sudah punya akun? <Link href="/login" className="text-brand font-semibold hover:underline">Masuk</Link></p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Nama Lengkap *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 karakter" className="w-full px-4 py-3 pr-12 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">No. WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08XXXXXXXXXX" className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Kota/Kabupaten *</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Kota Anda" className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm" />
              </div>

              <label className="flex items-start gap-2 text-xs text-brand-muted">
                <input type="checkbox" className="mt-0.5 rounded border-brand-border" required />
                Saya setuju dengan <Link href="/terms" className="text-brand font-semibold hover:underline">Syarat & Ketentuan</Link> dan <Link href="/privacy-policy" className="text-brand font-semibold hover:underline">Kebijakan Privasi</Link>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
