import StaticPage from "@/components/StaticPage";

export default function CareersPage() {
  return (
    <StaticPage title="Karir" icon="💼">
      <div className="prose max-w-none space-y-6 text-brand-muted">
        <p className="text-lg">Bergabunglah dengan tim BeliSeken.com! Kami selalu mencari talenta terbaik.</p>
        <div className="p-8 bg-brand-gray rounded-xl text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Lowongan Saat Ini</h3>
          <p className="text-sm">Kirim CV Anda ke <strong>hello@beliseken.com</strong> dan kami akan menghubungi jika ada posisi yang cocok.</p>
        </div>
      </div>
    </StaticPage>
  );
}
