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
                  💬 Chat via WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-brand-navy mb-6">Kirim Pesan</h2>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">✅</div>
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
