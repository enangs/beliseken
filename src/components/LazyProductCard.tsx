"use client";

import dynamic from "next/dynamic";
import { type ProductResponse } from "@/lib/api";

// Dynamic import for ProductCard
const ProductCard = dynamic(
  () => import("./ProductCard"),
  {
    loading: () => (
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mb-4" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

interface LazyProductCardProps {
  product: ProductResponse;
}

export default function LazyProductCard({ product }: LazyProductCardProps) {
  return <ProductCard product={product} />;
}
