import StaticPage from "@/components/StaticPage";

export default function ShippingReturnsPage() {
  return (
    <StaticPage title="Pengiriman & Pengembalian" icon="🚚">
      <div className="prose max-w-none space-y-6 text-brand-muted">
        <h2 className="text-xl font-bold text-brand-navy">Pengiriman</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Bekasi (Same-day):</strong> Gratis jemput & antar untuk pembelian di atas Rp 1 juta</li>
          <li><strong>Jabodetabek:</strong> 1-2 hari kerja via JNE/J&T/GoSend</li>
          <li><strong>Luar Jabodetabek:</strong> 2-5 hari kerja via JNE/J&T/POS</li>
          <li>Packing bubble wrap + box tebal untuk keamanan maksimal</li>
        </ul>
        <h2 className="text-xl font-bold text-brand-navy">Pengembalian</h2>
        <p>Pengembalian dapat dilakukan dalam 7 hari sejak barang diterima dengan syarat:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Barang masih dalam kondisi seperti saat diterima</li>
          <li>Kerusakan tidak disebabkan oleh pembeli</li>
          <li>Segel/hologram masih utuh</li>
        </ul>
      </div>
    </StaticPage>
  );
}
