import {
  CheckCircle,
  Search,
  ShieldCheck,
  Truck,
  DollarSign,
  Camera,
  Handshake,
  MapPin,
} from "lucide-react";

const advantages = [
  {
    icon: CheckCircle,
    title: "Quality Inspection",
    description:
      "Setiap produk melalui inspeksi visual & fungsional sebelum dipasarkan",
    color: "#3b82f6",
  },
  {
    icon: Search,
    title: "Multi-Point Testing",
    description:
      "15 titik pengecekan menyeluruh untuk menjamin kualitas setiap perangkat",
    color: "#8b5cf6",
  },
  {
    icon: ShieldCheck,
    title: "Garansi Toko 30 Hari",
    description:
      "Garansi uang kembali jika tidak sesuai harapan — belanja tanpa risiko",
    color: "#10b981",
  },
  {
    icon: Truck,
    title: "Pengiriman Instan Bekasi",
    description:
      "Same-day delivery untuk area Bekasi & Jabodetabek, barang sampai hari ini",
    color: "#f59e0b",
  },
  {
    icon: DollarSign,
    title: "Harga Terbaik",
    description:
      "Hemat 40-70% dari harga baru resmi — kualitas premium dengan harga terjangkau",
    color: "#e94560",
  },
  {
    icon: Camera,
    title: "Transparan & Jujur",
    description:
      "Foto real kondisi barang, termasuk detail flaw (jika ada) — tidak ada yang ditutupi",
    color: "#06b6d4",
  },
  {
    icon: Handshake,
    title: "Jual Barang Bekas Anda",
    description:
      "Kirim barang bekas Anda, dapat cash segera — proses cepat & fair",
    color: "#f97316",
  },
  {
    icon: MapPin,
    title: "Lokasi Offline Store",
    description:
      "Kunjungi toko kami di Bekasi untuk cek langsung sebelum membeli",
    color: "#6366f1",
  },
];

export default function ValueProposition() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-3">
            Mengapa BeliSeken.com?
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Kami bukan sekadar toko barang bekas — kami menjamin kualitas
            setiap perangkat yang kami jual
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 text-center border border-brand-border hover:border-brand hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${adv.color}15` }}
                >
                  <Icon size={28} style={{ color: adv.color }} />
                </div>
                <h3 className="font-bold text-brand-navy text-base mb-2">
                  {adv.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
