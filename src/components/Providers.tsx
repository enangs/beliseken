"use client";

import { CartProvider } from "@/lib/cart";
import BottomNav from "./BottomNav";
import PWAInstall from "./PWAInstall";
import ServiceWorker from "./ServiceWorker";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ServiceWorker />
      {children}
      <BottomNav />
      <PWAInstall />
    </CartProvider>
  );
}
