"use client";

import { Star, CheckCircle } from "lucide-react";
import { testimonials, storeInfo } from "@/data/products";

export default function Testimoni() {
  return (
    <section className="py-16 md:py-20 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Kata Mereka Tentang BeliSeken.com
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-white/80 text-lg ml-2">
              <span className="font-extrabold text-brand text-4xl">
                {storeInfo.stats.rating}
              </span>
              <span className="text-white/60 ml-1">/5</span>
              <span className="text-white/60 ml-2">
                dari {storeInfo.stats.reviewCount} ulasan di Google
              </span>
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-brand/30 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 leading-relaxed mb-6 italic text-[15px]">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
                {testimonial.verified && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs">
                    <CheckCircle size={14} />
                    <span>Terverifikasi</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Platforms */}
        <div className="mt-12 flex items-center justify-center gap-8 text-white/40">
          <span className="text-xs uppercase tracking-wider">Review Platform:</span>
          {["Google Reviews", "Tokopedia", "Shopee"].map((platform) => (
            <span
              key={platform}
              className="text-sm font-semibold hover:text-white/70 transition-colors cursor-pointer"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
