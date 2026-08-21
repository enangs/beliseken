import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KategoriPopuler from "@/components/KategoriPopuler";
import BestDeals from "@/components/BestDeals";
import ValueProposition from "@/components/ValueProposition";
import ProdukTerbaru from "@/components/ProdukTerbaru";
import Testimoni from "@/components/Testimoni";
import BlogPreview from "@/components/BlogPreview";
import CTAJualBarang from "@/components/CTAJualBarang";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <KategoriPopuler />
        <BestDeals />
        <ValueProposition />
        <ProdukTerbaru />
        <Testimoni />
        <BlogPreview />
        <CTAJualBarang />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
