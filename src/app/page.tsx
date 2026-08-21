import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriPopuler from "@/components/KategoriPopuler";
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
      <Header />
      <main className="flex-1">
        <Hero />
        <KategoriPopuler />
        <FlashSale />
        <BestDeals />
        <PromoBanner />
        <ValueProposition />
        <ProdukTerbaru />
        <Testimoni />
        <BlogPreview />
        <CTAJualBarang />
        <InstagramFeed />
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
