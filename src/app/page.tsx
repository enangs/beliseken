import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriPopuler from "@/components/KategoriPopuler";
import LazySection from "@/components/LazySection";

// Below-fold components loaded lazily for better mobile performance
import FlashSale from "@/components/FlashSale";
import BestDeals from "@/components/BestDeals";
import PromoBanner from "@/components/PromoBanner";
import ValueProposition from "@/components/ValueProposition";
import ProdukTerbaru from "@/components/ProdukTerbaru";
import Testimoni from "@/components/Testimoni";
import BlogPreview from "@/components/BlogPreview";
import CTAJualBarang from "@/components/CTAJualBarang";
import InstagramFeed from "@/components/InstagramFeed";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Above-fold: loads immediately */}
      <Header />
      <main className="flex-1">
        <Hero />
        <KategoriPopuler />

        {/* Below-fold: lazy loaded on scroll */}
        <LazySection>
          <FlashSale />
        </LazySection>

        <LazySection>
          <BestDeals />
        </LazySection>

        <LazySection>
          <PromoBanner />
        </LazySection>

        <LazySection>
          <ValueProposition />
        </LazySection>

        <LazySection>
          <ProdukTerbaru />
        </LazySection>

        <LazySection>
          <Testimoni />
        </LazySection>

        <LazySection>
          <BlogPreview />
        </LazySection>

        <LazySection>
          <CTAJualBarang />
        </LazySection>

        <LazySection>
          <InstagramFeed />
        </LazySection>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
