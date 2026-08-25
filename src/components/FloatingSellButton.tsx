"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function FloatingSellButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (about 600px)
      setIsVisible(window.scrollY > 600);
    };

    // Show immediately on mobile
    if (window.innerWidth < 768) {
      setIsVisible(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="/sell"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 bg-brand text-white px-4 py-3 rounded-full shadow-lg hover:bg-brand-dark transition-all hover:scale-105 flex items-center gap-2 font-semibold text-sm md:text-base"
      aria-label="Jual Barang"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span className="hidden sm:inline">Jual Barang</span>
    </Link>
  );
}
