import StaticPage from "@/components/StaticPage";

export default function HowToBuyPage() {
  return (
    <StaticPage title="Cara Beli" icon="🛒">
      <div className="prose max-w-none space-y-8 text-brand-muted">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", icon: "🔍", title: "Pilih Produk", desc: "Jelajahi katalog kami dan pilih produk yang diinginkan" },
            { step: "2", icon: "💬", title: "Hubungi Kami", desc: "Chat via WhatsApp untuk konfirmasi ketersediaan dan harga" },
            { step: "3", icon: "💳", title: "Bayar", desc: "Lakukan pembayaran via transfer bank, e-wallet, atau QRIS" },
            { step: "4", icon: "📦", title: "Terima Barang", desc: "Barang dikirim atau diambil langsung di toko kami" },
          ].map((item) => (
            <div key={item.step} className="text-center p-6 bg-white rounded-xl border border-brand-border">
              <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">{item.step}</div>
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-brand-navy">{item.title}</h3>
              <p className="text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </StaticPage>
  );
}
