import StaticPage from "@/components/StaticPage";

export default function HowToSellPage() {
  return (
    <StaticPage title="Cara Jual" icon="💰">
      <div className="prose max-w-none space-y-8 text-brand-muted">
        <p className="text-lg">Ingin menjual barang elektronik bekas Anda? Ikuti langkah mudah ini:</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "📸", title: "Foto Barang", desc: "Ambil foto barang dari berbagai sudut (depan, sisi, belakang, detail)" },
            { step: "2", icon: "💬", title: "Hubungi Kami", desc: "Kirim foto via WhatsApp ke 0851-0125-6123 beserta spesifikasi barang" },
            { step: "3", icon: "💵", title: "Terima Pembayaran", desc: "Setelah deal harga, kami jemput barang dan bayar langsung atau transfer" },
          ].map((item) => (
            <div key={item.step} className="text-center p-6 bg-white rounded-xl border border-brand-border">
              <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">{item.step}</div>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </StaticPage>
  );
}
