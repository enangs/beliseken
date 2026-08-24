"use client";

import { useState, useCallback, useMemo } from "react";
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

  // Memoized form field handler
  const handleChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  }, [error]);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.password &&
      form.password.length >= 6 &&
      form.phone.trim() &&
      form.city.trim()
    );
  }, [form]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Semua field wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(form);
      if (result.success) {
        // Redirect to verification page
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.name)}`);
      } else {
        setError(result.error || "Gagal mendaftar!");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [form, isFormValid, router]);

  // Memoized form fields
  const formFields = useMemo(() => [
    { field: "name", label: "Nama Lengkap", type: "text", placeholder: "Nama Anda", required: true },
    { field: "email", label: "Email", type: "email", placeholder: "email@contoh.com", required: true },
    { field: "phone", label: "No. WhatsApp", type: "tel", placeholder: "08XXXXXXXXXX", required: true },
    { field: "city", label: "Kota/Kabupaten", type: "text", placeholder: "Kota Anda", required: true },
  ], []);

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 min-h-screen flex items-center justify-center bg-brand-gray px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-navy">Buat Akun Baru</h1>
              <p className="text-sm text-brand-muted mt-1">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-brand font-semibold hover:underline">
                  Masuk
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Render text fields */}
              {formFields.map(({ field, label, type, placeholder, required }) => (
                <div key={field}>
                  <label className="text-sm font-semibold text-brand-navy block mb-1.5">
                    {label} {required && "*"}
                  </label>
                  <input
                    type={type}
                    value={(form as any)[field]}
                    onChange={handleChange(field)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                    required={required}
                  />
                </div>
              ))}

              {/* Password field with show/hide toggle */}
              <div>
                <label className="text-sm font-semibold text-brand-navy block mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Min 6 karakter"
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

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 text-xs text-brand-muted">
                <input type="checkbox" className="mt-0.5 rounded border-brand-border" required />
                Saya setuju dengan{" "}
                <Link href="/terms" className="text-brand font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy-policy" className="text-brand font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
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
