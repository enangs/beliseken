"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Phone } from "lucide-react";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";
import { loginUser } from "@/lib/auth-api";

type LoginMode = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const isFormValid = useMemo(() => {
    return identifier.trim() && password;
  }, [identifier, password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError(mode === "phone" ? "No HP dan password wajib diisi!" : "Email dan password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      if (mode === "phone") {
        // Phone login via API
        const response = await fetch("/api/auth/login-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: identifier, password }),
        });
        const result = await response.json();

        if (result.success && result.data) {
          localStorage.setItem("beliseken_user_session", JSON.stringify(result.data));
          router.push("/dashboard");
        } else {
          setError(result.error || "No HP atau password salah!");
        }
      } else {
        // Email login
        const result = await loginUser(identifier, password);
        if (result.success) {
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
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [identifier, password, isFormValid, mode, router]);

  const handleSocialLogin = useCallback(async (provider: "google" | "facebook") => {
    setError("");
    setSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      setError(`Gagal login dengan ${provider === "google" ? "Google" : "Facebook"}.`);
      setSocialLoading(null);
    }
  }, []);

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
                            body: JSON.stringify({ email: identifier }),
                          });
                          router.push(`/verify-email?email=${encodeURIComponent(identifier)}`);
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

            {/* ═══ Login Mode Tabs ═══ */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode("email"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === "email"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-brand-muted hover:text-brand-navy"
                }`}
              >
                <Mail size={16} />
                Email
              </button>
              <button
                onClick={() => { setMode("phone"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === "phone"
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-brand-muted hover:text-brand-navy"
                }`}
              >
                <Phone size={16} />
                No. HP
              </button>
            </div>

            {/* ═══ Login Form ═══ */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier field */}
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">
                  {mode === "phone" ? "No. WhatsApp" : "Email"} *
                </label>
                <input
                  type={mode === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={mode === "phone" ? "08XXXXXXXXXX" : "email@contoh.com"}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                  required
                />
              </div>

              {/* Password field */}
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

            {/* ═══ Divider ═══ */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-brand-muted">atau masuk dengan</span>
              </div>
            </div>

            {/* ═══ Social Login Buttons ═══ */}
            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-brand-navy font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <Loader2 size={20} className="animate-spin text-brand" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {socialLoading === "google" ? "Menghubungkan..." : "Google"}
              </button>
            </div>

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
