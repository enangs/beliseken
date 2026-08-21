import StaticPage from "@/components/StaticPage";

export default function CookiePolicyPage() {
  return (
    <StaticPage title="Kebijakan Cookie" icon="🍪">
      <div className="prose max-w-none space-y-6 text-brand-muted text-sm leading-relaxed">
        <p>Cookie adalah file kecil yang disimpan di perangkat Anda saat mengunjungi website kami.</p>
        <h2 className="text-xl font-bold text-brand-navy">Cookie yang Kami Gunakan</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi dasar website (login, keranjang)</li>
          <li><strong>Analytics Cookies:</strong> Membantu kami memahami penggunaan website</li>
          <li><strong>Preference Cookies:</strong> Menyimpan preferensi Anda (bahasa, tema)</li>
        </ul>
        <h2 className="text-xl font-bold text-brand-navy">Mengelola Cookie</h2>
        <p>Anda dapat mengatur cookie melalui browser Anda. Nonaktifkan cookie dapat mempengaruhi fungsi website.</p>
      </div>
    </StaticPage>
  );
}
