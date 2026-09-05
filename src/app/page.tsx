"use client";

import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriPopuler from "@/components/KategoriPopuler";
import MerkFavorit from "@/components/MerkFavorit";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

// Lazy load below-fold components
const ProdukTerbaru = lazy(() => import("@/components/ProdukTerbaru"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const CTAJualBarang = lazy(() => import("@/components/CTAJualBarang"));

function SectionFallback() {
  return <div className="min-h-[80px]" />;
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <MerkFavorit />
        <KategoriPopuler />
        <Suspense fallback={<SectionFallback />}>
          <ProdukTerbaru />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BlogPreview />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTAJualBarang />
        </Suspense>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
