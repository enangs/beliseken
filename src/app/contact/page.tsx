"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { storeInfo } from "@/data/products";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-brand-navy py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3">Hubungi Kami</h1>
            <p className="text-white/70 text-lg">Ada pertanyaan? Kami siap membantu Anda.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-6">Informasi Kontak</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Alamat", value: storeInfo.address, color: "#e94560" },
                  { icon: Phone, label: "Telepon/WhatsApp", value: storeInfo.phoneFormatted, color: "#25D366", link: storeInfo.whatsappLink },
                  { icon: Mail, label: "Email", value: storeInfo.email, color: "#3b82f6", link: `mailto:${storeInfo.email}` },
                  { icon: Clock, label: "Jam Operasional", value: storeInfo.operatingHours, color: "#f59e0b" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                      <item.icon size={20} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand text-sm">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-brand-muted text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href={storeInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat via WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-brand-navy mb-6">Kirim Pesan</h2>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy">Pesan Terkirim!</h3>
                  <p className="text-brand-muted text-sm mt-1">Kami akan membalas dalam 1x24 jam.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                      placeholder="email@contoh.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Subjek</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm"
                      placeholder="Perihal pesan Anda"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-navy block mb-1.5">Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm resize-none"
                      placeholder="Tulis pesan Anda..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors"
                  >
                    <Send size={16} />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
