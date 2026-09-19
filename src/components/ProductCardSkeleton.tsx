"use client";

import { memo } from "react";

interface ProductCardSkeletonProps {
  count?: number;
}

const ProductCardSkeleton = memo(function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-brand-border overflow-hidden animate-pulse"
        >
          {/* Image placeholder */}
          <div className="relative aspect-square sm:aspect-[4/3] bg-gray-200" />

          {/* Content placeholder */}
          <div className="p-2.5 sm:p-4">
            {/* SKU placeholder */}
            <div className="h-3 bg-gray-200 rounded w-16 mb-2" />

            {/* Title placeholder */}
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

            {/* Rating placeholder */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-3 h-3 bg-gray-200 rounded" />
              ))}
              <div className="h-3 bg-gray-200 rounded w-8 ml-1" />
            </div>

            {/* Price placeholder */}
            <div className="h-5 bg-gray-200 rounded w-24 mb-3" />

            {/* Button placeholder */}
            <div className="h-9 bg-gray-200 rounded-lg w-full" />
          </div>
        </div>
      ))}
    </>
  );
});

export default ProductCardSkeleton;
