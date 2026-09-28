"use client";

import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ProductItem } from "@/types";

interface ProductCardProps {
  product: ProductItem;
  onOpenDetails: (product: ProductItem) => void;
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9CA3AF' font-size='12'>No image</text></svg>`
  );

export function ProductCard({
  product,
  onOpenDetails,
}: ProductCardProps) {
  const coverImage = product.images?.[0] || PLACEHOLDER_SVG;
  const safeName = product.name?.replace(/<br\s*\/?>/gi, " ") || "Product";

  const whatsappUrl = `https://wa.me/919227915114?text=Hello,%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
    safeName
  )}`;

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-3 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Top Brand Chip */}
      {product.brand && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase bg-red-50/90 rounded-md border border-red-200/60 shadow-xs">
            {product.brand}
          </span>
        </div>
      )}

      {/* Image Box */}
      <div
        onClick={() => onOpenDetails(product)}
        className="w-full aspect-square bg-gray-50/60 rounded-xl overflow-hidden flex items-center justify-center relative cursor-pointer group-hover:bg-white transition-colors"
      >
        <Image
          src={coverImage}
          alt={safeName}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 pt-3 pb-1">
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          title={safeName}
        >
          {safeName}
        </h3>

        {product.description && (
          <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
            {product.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="w-full py-1.5 px-2 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 text-gray-500" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-2 text-[11px] font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
            aria-label={`WhatsApp inquiry for ${safeName}`}
          >
            <span>WhatsApp</span>
            <MessageCircle className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
