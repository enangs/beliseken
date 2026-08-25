"use client";

import { storeInfo } from "@/data/products";

const instagramPosts = [
  { id: 1, icon: "/icons/laptop.svg", color: "from-blue-400/20 to-purple-400/20" },
  { id: 2, icon: "/icons/device-mobile.svg", color: "from-green-400/20 to-emerald-400/20" },
  { id: 3, icon: "/icons/monitor.svg", color: "from-purple-400/20 to-pink-400/20" },
  { id: 4, icon: "/icons/network.svg", color: "from-yellow-400/20 to-orange-400/20" },
  { id: 5, icon: "/icons/circuitry.svg", color: "from-red-400/20 to-rose-400/20" },
  { id: 6, icon: "/icons/lightbulb.svg", color: "from-indigo-400/20 to-blue-400/20" },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 md:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-2">
            Follow Kami di Instagram
          </h2>
          <p className="text-brand-muted text-lg">
            <span className="font-semibold text-brand">@beliseken.com</span> — 12.5K Followers
          </p>
        </div>

        {/* Instagram Grid - dengan icon SVG */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={storeInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square rounded-xl bg-gradient-to-br ${post.color} overflow-hidden border border-brand-border hover:shadow-lg transition-all duration-300`}
            >
              <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.icon} alt="" className="w-12 h-12 opacity-60 group-hover:opacity-100" aria-hidden="true" />
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white mx-auto mb-1">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-white text-xs font-semibold">View Post</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-8">
          <a href={storeInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @beliseken.com
          </a>
        </div>
      </div>
    </section>
  );
}
