"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Check } from "lucide-react";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const badgeColors = {
    "HOT DEAL": "bg-brand text-white",
    "BEST SELLER": "bg-amber-500 text-white",
    NEW: "bg-emerald-500 text-white",
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 w-full">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {product.imageBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageBase64}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand-dark/10" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                📦
              </div>
            </>
          )}

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-md ${badgeColors[product.badge]}`}
            >
              {product.badge}
            </span>
          )}

          {/* Time Added (for new arrivals) */}
          {product.timeAdded && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              🕐 {product.timeAdded}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-brand-navy text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-xs text-brand-muted ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-brand">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-brand-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Discount */}
        <span className="text-xs font-bold text-brand mb-3 block">
          -{product.discount}% OFF
        </span>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors duration-200 ${
            added
              ? "bg-emerald-500"
              : "bg-brand-navy hover:bg-brand"
          }`}
        >
          {added ? (
            <>
              <Check size={15} />
              Ditambahkan!
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Keranjang
            </>
          )}
        </button>
      </div>
    </div>
  );
}
