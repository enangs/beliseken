"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart";
import BottomNav from "./BottomNav";
import PWAInstall from "./PWAInstall";
import ServiceWorker from "./ServiceWorker";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ServiceWorker />
        {children}
        <BottomNav />
        <PWAInstall />
      </CartProvider>
    </SessionProvider>
  );
}
