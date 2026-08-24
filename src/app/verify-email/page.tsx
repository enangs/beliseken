"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Loader2, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-send verification code on mount
  useEffect(() => {
    if (email) {
      handleSendCode();
    }
  }, [email]);

  const handleSendCode = async () => {
    if (!email) return;
    
    setSendingCode(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Gagal mengirim kode");
      } else {
        setResendCooldown(60); // 60 seconds cooldown
      }
    } catch {
      setError("Gagal mengirim kode. Coba lagi.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (verifyCode: string) => {
    if (!email || !verifyCode) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2000);
      } else {
        setError(data.error || "Kode verifikasi salah");
        setCode(["", "", "", "", "", ""]);
        document.getElementById("code-0")?.focus();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Mail size={48} className="mx-auto text-brand mb-4" />
          <h1 className="text-xl font-bold text-brand-navy mb-2">Email Tidak Ditemukan</h1>
          <p className="text-brand-muted mb-6">Silakan daftar terlebih dahulu.</p>
          <Link
            href="/register"
            className="inline-block bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-xl font-bold text-brand-navy mb-2">Email Terverifikasi! 🎉</h1>
          <p className="text-brand-muted mb-6">Anda akan diarahkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-2">Verifikasi Email</h1>
          <p className="text-brand-muted text-sm">
            Masukkan kode 6 digit yang kami kirim ke
          </p>
          <p className="text-brand-navy font-semibold text-sm mt-1">{email}</p>
        </div>

        {/* Code Input */}
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-brand-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-brand mb-4">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Memverifikasi...</span>
          </div>
        )}

        {/* Resend Button */}
        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-brand-muted text-sm">
              Kirim ulang dalam {resendCooldown} detik
            </p>
          ) : (
            <button
              onClick={handleSendCode}
              disabled={sendingCode}
              className="text-brand font-semibold text-sm hover:text-brand-dark transition-colors disabled:opacity-50"
            >
              {sendingCode ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Kirim Ulang Kode
                </span>
              )}
            </button>
          )}
        </div>

        {/* Help */}
        <div className="mt-8 pt-6 border-t border-brand-border text-center">
          <p className="text-brand-muted text-xs">
            Tidak menerima email? Cek folder <strong>Spam</strong> atau <strong>Promotions</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
