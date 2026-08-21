import StaticPage from "@/components/StaticPage";

export default function WarrantyPage() {
  return (
    <StaticPage title="Garansi 30 Hari" icon="🛡️">
      <div className="prose max-w-none space-y-6 text-brand-muted">
        <p className="text-lg leading-relaxed">Kami menjamin kualitas setiap produk yang kami jual dengan garansi toko selama 30 hari.</p>
        <h2 className="text-xl font-bold text-brand-navy">Yang Dicakup Garansi</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Kerusakan fungsional yang tidak disebutkan saat penjualan</li>
          <li>Baterai yang tidak berfungsi dengan normal</li>
          <li>Keyboard/touchscreen yang tidak responsif</li>
          <li>Layar yang mengalami dead pixel lebih dari 3 titik</li>
        </ul>
        <h2 className="text-xl font-bold text-brand-navy">Proses Klaim</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Hubungi kami via WhatsApp dengan menyertakan nomor pesanan</li>
          <li>Sertakan foto/video kerusakan</li>
          <li>Kirim barang ke toko kami atau jemput oleh kurir</li>
          <li>Klaim diproses dalam 1-3 hari kerja</li>
        </ol>
      </div>
    </StaticPage>
  );
}
