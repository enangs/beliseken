import StaticPage from "@/components/StaticPage";

const faqs = [
  { q: "Apakah barang bekas di BeliSeken.com bergaransi?", a: "Ya! Setiap produk mendapat garansi toko selama 30 hari sejak barang diterima. Jika ada masalah, kami siap membantu." },
  { q: "Bagaimana cara membeli barang?", a: "Pilih produk yang diinginkan, hubungi kami via WhatsApp untuk ketersediaan, lalu lakukan pembayaran. Barang akan dikirim atau bisa diambil langsung di toko." },
  { q: "Apakah bisa cod (cash on delivery)?", a: "Untuk wilayah Bekasi, kami menyediakan layanan jemput barang dan COD. Untuk luar Bekasi, pembayaran via transfer bank atau e-wallet." },
  { q: "Bagaimana kondisi barang yang dijual?", a: "Setiap barang melalui inspeksi 15 titik pengecekan. Kami menampilkan foto real kondisi barang dan menyertakan detail flaw jika ada." },
  { q: "Bisa tukar tambah barang?", a: "Ya, kami menerima tukar tambah. Hubungi WhatsApp kami untuk mendapatkan penawaran harga tukar tambah." },
  { q: "Metode pembayaran apa saja yang diterima?", a: "Kami menerima transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA), QRIS, dan cicilan 0%." },
];

export default function FAQPage() {
  return (
    <StaticPage title="FAQ" icon="❓">
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-xl border border-brand-border overflow-hidden group">
            <summary className="px-6 py-5 cursor-pointer font-semibold text-brand-navy hover:text-brand transition-colors list-none flex items-center justify-between">
              {faq.q}
              <span className="text-brand-muted group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-6 pb-5 text-sm text-brand-muted leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </StaticPage>
  );
}
