import Link from "next/link";
import { storeInfo } from "@/data/products";

export default function CTAJualBarang() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand via-[#e94560] to-[#ff6b6b]">
          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-[10%] w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute top-8 right-[15%] w-10 h-10 bg-yellow-300/20 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-6 left-[25%] w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 right-[8%] w-20 h-20 bg-white/5 rounded-full" />
            <div className="absolute -bottom-4 right-[30%] w-14 h-14 bg-yellow-300/10 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center p-8 md:p-12 lg:p-14">
            {/* Left: Content (3 cols) */}
            <div className="lg:col-span-3">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                <span className="text-yellow-300">💰</span> Harga Terbaik!
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                Punya Elektronik Bekas?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl">
                Kami beli dengan harga terbaik! Kirim foto barang Anda dan
                dapatkan penawaran dalam <span className="font-bold text-yellow-300">1 jam</span>.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { icon: "⚡", text: "Penawaran dalam 1 jam" },
                  { icon: "💸", text: "Bayar langsung / transfer" },
                  { icon: "🚚", text: "Gratis jemput Bekasi" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm">{b.icon}</span>
                    <span className="text-white font-medium text-sm">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="px-7 py-3.5 bg-white text-brand font-bold rounded-xl hover:bg-gray-100 transition-all text-sm shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Kirim Foto Sekarang
                </Link>
                <a
                  href={`${storeInfo.whatsappLink}?text=Halo, saya ingin menjual barang bekas. Mohon info lebih lanjut.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all text-sm shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Stats / Highlights (2 cols) */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {[
                { number: "500+", label: "Barang Terjual", color: "bg-white/15" },
                { number: "1 Jam", label: "Respon Cepat", color: "bg-yellow-400/20" },
                { number: "100%", label: "Bayar Lunas", color: "bg-green-400/20" },
                { number: "4.9⭐", label: "Rating Seller", color: "bg-white/15" },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10 hover:scale-105 transition-transform`}>
                  <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.number}</div>
                  <div className="text-xs text-white/70 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
