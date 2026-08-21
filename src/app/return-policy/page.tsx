import StaticPage from "@/components/StaticPage";

export default function ReturnPolicyPage() {
  return (
    <StaticPage title="Return Policy" icon="🔄">
      <div className="prose max-w-none space-y-6 text-brand-muted text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-brand-navy">Kebijakan Pengembalian Barang</h2>
        <p>Kepuasan Anda adalah prioritas kami. Berikut kebijakan pengembalian barang:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Batas Waktu:</strong> 7 hari sejak barang diterima</li>
          <li><strong>Kondisi:</strong> Barang harus dalam kondisi seperti saat diterima</li>
          <li><strong>Proses:</strong> Hubungi WhatsApp kami dengan nomor pesanan dan foto barang</li>
          <li><strong>Refund:</strong> Diproses dalam 1-3 hari kerja ke rekening/e-wetail asal</li>
        </ul>
      </div>
    </StaticPage>
  );
}
