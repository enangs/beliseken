import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { storeInfo } from "@/data/products";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <div className="bg-brand-navy py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4">Tentang BeliSeken.com</h1>
            <p className="text-white/70 text-lg">Mitra terpercaya untuk elektronik bekas berkualitas di Indonesia</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          {/* Story */}
          <section>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Cerita Kami</h2>
            <p className="text-brand-muted leading-relaxed mb-4">
              BeliSeken.com lahir dari sebuah visi sederhana: membuat elektronik berkualitas dapat diakses oleh semua orang.
              Didirikan di Bekasi, kami bermula dari sebuah toko kecil di Griyaasri 2 Blok H6 No 30, Tambun Selatan,
              dan kini telah melayani lebih dari {storeInfo.stats.customers} pelanggan di seluruh Indonesia.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Kami percaya bahwa barang bekas tidak harus berarti kualitas rendah. Setiap produk yang kami jual melalui
              proses inspeksi 15 titik pengecekan yang ketat, memastikan Anda mendapatkan perangkat elektronik terbaik
              dengan harga yang jauh lebih terjangkau.
            </p>
          </section>

          {/* Mission */}
          <section className="bg-brand-gray rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Misi Kami</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🎯", title: "Kualitas Terjamin", desc: "Setiap produk melalui inspeksi ketat sebelum sampai di tangan Anda." },
                { icon: "💚", title: "Ramah Lingkungan", desc: "Mengurangi e-waste dengan memberikan kehidupan kedua pada elektronik." },
                { icon: "🤝", title: "Harga Jujur", desc: "Transparansi kondisi barang dan harga yang fair untuk semua." },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: storeInfo.stats.customers, label: "Pelanggan Puas" },
              { number: "5,000+", label: "Produk Terjual" },
              { number: "30", label: "Hari Garansi" },
              { number: storeInfo.stats.rating, label: "Rating Google" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl border border-brand-border">
                <div className="text-3xl font-extrabold text-brand mb-1">{stat.number}</div>
                <div className="text-sm text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
