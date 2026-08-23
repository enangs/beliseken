"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Check } from "lucide-react";
import { type ProductResponse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart, type CartItem } from "@/lib/cart";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const badgeColors: Record<string, string> = {
    "HOT DEAL": "bg-brand text-white",
    "BEST SELLER": "bg-amber-500 text-white",
    NEW: "bg-emerald-500 text-white",
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Adapt ProductResponse to CartItem shape
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category?.name || "",
      subcategory: product.subcategory?.name || "",
      brand: product.brand?.name || "",
      price: product.sellingPrice,
      originalPrice: product.sellingPrice,
      discount: product.discount,
      rating: product.avgRating,
      reviewCount: product.reviewCount,
      condition: "Grade A",
      badge: product.badge as "HOT DEAL" | "BEST SELLER" | "NEW" | undefined,
      image: "",
      specs: [],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const originalPrice = product.discount > 0
    ? Math.round(product.sellingPrice / (1 - product.discount / 100))
    : product.sellingPrice;

  return (
    <div className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 w-full">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand-dark/10" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
            📦
          </div>

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-md ${badgeColors[product.badge] || "bg-gray-500 text-white"}`}
            >
              {product.badge}
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
                  i < Math.floor(product.avgRating)
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
            {formatPrice(product.sellingPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-brand-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Discount */}
        {product.discount > 0 && (
          <span className="text-xs font-bold text-brand mb-3 block">
            -{product.discount}% OFF
          </span>
        )}

        {/* Add to Cart Button */}
        {product.stock === 0 ? (
          <div className="w-full py-2.5 bg-red-100 text-red-600 text-sm font-bold rounded-lg text-center">
            SOLD OUT
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
