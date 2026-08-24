"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import Header from "@/components/Header";
import { loginUser } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return email.trim() && password;
  }, [email, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(email, password);
      if (result.success) {
        // Check if admin
        if (result.user?.email === "admin@beliseken.com") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else if (result.needsVerification) {
        setNeedsVerification(true);
        setError(result.error || "Email belum diverifikasi!");
      } else {
        setError(result.error || "Email atau password salah!");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [email, password, isFormValid, router]);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen flex items-center justify-center bg-brand-gray px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-navy">Masuk ke Akun</h1>
              <p className="text-sm text-brand-muted mt-1">
                Belum punya akun?{" "}
                <Link href="/register" className="text-brand font-semibold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            {/* Email Verification Notice */}
            {needsVerification && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 font-medium mb-2">
                      Email belum diverifikasi!
                    </p>
                    <button
                      onClick={async () => {
                        setSendingCode(true);
                        try {
                          await fetch("/api/auth/send-verification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          });
                          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
                        } catch {
                          // ignore
                        } finally {
                          setSendingCode(false);
                        }
                      }}
                      disabled={sendingCode}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline"
                    >
                      {sendingCode ? "Mengirim..." : "Kirim Ulang Kode Verifikasi"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  required
                />
              </div>

              {/* Password field with show/hide toggle */}
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Masukkan password"
                    className="w-full px-4 py-3 pr-12 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Masuk...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Admin login hint */}
            <div className="mt-6 pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted text-center">
                Admin?{" "}
                <Link href="/admin/login" className="text-brand font-semibold hover:underline">
                  Login ke Admin Panel
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
