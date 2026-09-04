"use client";

import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriPopuler from "@/components/KategoriPopuler";
import MerkFavorit from "@/components/MerkFavorit";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

// Lazy load below-fold components for code splitting
const FlashSale = lazy(() => import("@/components/FlashSale"));
const BestDeals = lazy(() => import("@/components/BestDeals"));
const PromoBanner = lazy(() => import("@/components/PromoBanner"));
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const ProdukTerbaru = lazy(() => import("@/components/ProdukTerbaru"));
const Testimoni = lazy(() => import("@/components/Testimoni"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const CTAJualBarang = lazy(() => import("@/components/CTAJualBarang"));
const InstagramFeed = lazy(() => import("@/components/InstagramFeed"));

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
          <FlashSale />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BestDeals />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PromoBanner />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ValueProposition />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProdukTerbaru />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimoni />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <BlogPreview />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTAJualBarang />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <InstagramFeed />
        </Suspense>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
