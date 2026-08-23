"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const isDismissed = localStorage.getItem("pwa_install_dismissed");
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install prompt after 3 seconds
      setTimeout(() => setShowInstall(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showInstall || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 lg:hidden">
      <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-4 shadow-2xl border border-brand/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
        >
          <X size={12} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Install BeliSeken</p>
            <p className="text-white/70 text-xs">Akses lebih cepat seperti aplikasi!</p>
          </div>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-brand font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
