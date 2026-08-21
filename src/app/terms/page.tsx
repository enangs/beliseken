import StaticPage from "@/components/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage title="Syarat & Ketentuan" icon="📜">
      <div className="prose max-w-none space-y-6 text-brand-muted text-sm leading-relaxed">
        <p>Berlaku efektif sejak Agustus 2026</p>
        <h2 className="text-xl font-bold text-brand-navy">1. Penerimaan Syarat</h2>
        <p>Dengan menggunakan BeliSeken.com, Anda menyetujui syarat dan ketentuan yang berlaku.</p>
        <h2 className="text-xl font-bold text-brand-navy">2. Produk</h2>
        <p>Semua produk yang dijual adalah barang bekas/second yang telah melalui inspeksi. Kondisi barang dijelaskan secara transparan di halaman produk.</p>
        <h2 className="text-xl font-bold text-brand-navy">3. Pembayaran</h2>
        <p>Pembayaran harus dilakukan dalam 24 jam setelah pemesanan. Pesanan akan dibatalkan otomatis jika pembayaran tidak diterima.</p>
        <h2 className="text-xl font-bold text-brand-navy">4. Garansi</h2>
        <p>Garansi toko 30 hari berlaku untuk kerusakan fungsional yang tidak diungkapkan saat penjualan.</p>
      </div>
    </StaticPage>
  );
}
