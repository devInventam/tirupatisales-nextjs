"use client";

import Image from "next/image";
import { ArrowUpRight, Send } from "lucide-react";
import { ProductItem } from "@/types";

interface ProductCardProps {
  product: ProductItem;
  onOpenDetails: (product: ProductItem) => void;
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9CA3AF' font-size='12'>No image</text></svg>`,
  );

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const coverImage = product.images?.[0] || PLACEHOLDER_SVG;
  const safeName = product.name?.replace(/<br\s*\/?>/gi, " ") || "Product";

  const whatsappUrl = `https://wa.me/919227915114?text=Hello,%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
    safeName,
  )}`;

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-red-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 active:scale-[0.99]">
      {/* Top Brand Chip */}
      {product.brand && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <span className="inline-block px-1.5 sm:  px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-red-600 uppercase bg-white/95 backdrop-blur-xs rounded-md border border-red-200/80 shadow-xs">
            {product.brand}
          </span>
        </div>
      )}

      {/* Image Box */}
      <div
        onClick={() => onOpenDetails(product)}
        className="w-full aspect-square bg-gray-50/60 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center relative cursor-pointer group-hover:bg-white transition-colors"
      >
        <Image
          src={coverImage}
          alt={safeName}
          fill
          className="object-contain p-2 sm:p-3.5 transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 pt-2 sm:pt-3 pb-0.5">
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          title={safeName}
        >
          {safeName}
        </h3>

        {product.description && (
          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5 sm:mt-1">
            {product.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-2.5 sm:pt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="w-full py-2 sm:py-2 px-1.5 sm:px-2 text-[10px] sm:text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 sm:py-2 px-1.5 sm:px-2 text-[10px] sm:text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
            aria-label={`Enquire about ${safeName}`}
          >
            <span>Enquire</span>
            <Send className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
