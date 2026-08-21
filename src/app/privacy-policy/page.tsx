import StaticPage from "@/components/StaticPage";

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Kebijakan Privasi" icon="🔒">
      <div className="prose max-w-none space-y-6 text-brand-muted text-sm leading-relaxed">
        <p>Terakhir diperbarui: Agustus 2026</p>
        <h2 className="text-xl font-bold text-brand-navy">1. Informasi yang Kami Kumpulkan</h2>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar, termasuk nama, email, nomor WhatsApp, dan alamat.</p>
        <h2 className="text-xl font-bold text-brand-navy">2. Penggunaan Informasi</h2>
        <p>Informasi digunakan untuk memproses pesanan, mengirimkan notifikasi status pesanan, dan meningkatkan layanan kami.</p>
        <h2 className="text-xl font-bold text-brand-navy">3. Keamanan Data</h2>
        <p>Kami menggunakan enkripsi SSL 256-bit dan tidak pernah menyimpan data kartu kredit secara langsung.</p>
        <h2 className="text-xl font-bold text-brand-navy">4. Hubungi Kami</h2>
        <p>Jika ada pertanyaan tentang kebijakan privasi, hubungi kami di hello@beliseken.com.</p>
      </div>
    </StaticPage>
  );
}
