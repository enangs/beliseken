"use client";

import { useEffect } from "react";

export default function PrefetchLinks() {
  useEffect(() => {
    // Prefetch critical pages
    const prefetchPages = ["/products", "/cart", "/checkout"];
    
    prefetchPages.forEach((page) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = page;
      document.head.appendChild(link);
    });

    // Prefetch critical images (hero banner)
    const prefetchImages = ["/icons/gradepermium.svg", "/icons/waranty.svg", "/icons/delivery.svg", "/icons/konsul.svg"];
    
    prefetchImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = src;
      document.head.appendChild(link);
    });

    // Cleanup
    return () => {
      document.querySelectorAll("link[rel='prefetch']").forEach((el) => el.remove());
    };
  }, []);

  return null;
}
