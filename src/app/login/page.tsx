"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import { loginUser } from "@/lib/user-auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const result = loginUser(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Gagal masuk!");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen flex items-center justify-center bg-brand-gray px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-navy">Masuk ke Akun Anda</h1>
              <p className="text-sm text-brand-muted mt-1">Belum punya akun? <Link href="/register" className="text-brand font-semibold hover:underline">Daftar sekarang</Link></p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Masuk..." : "Masuk"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-brand-muted">atau masuk dengan</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="py-2.5 border border-brand-border rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Google</button>
                <a
                  href="https://wa.me/6285101256123?text=Halo, saya butuh bantuan login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 border border-brand-border rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
