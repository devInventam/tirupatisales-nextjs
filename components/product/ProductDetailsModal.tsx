"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  X,
  FileDown,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductItem } from "@/types";

interface ProductDetailsModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  const images = product?.images?.length ? product.images : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!isOpen || !product) return null;

  const safeName = product.name?.replace(/<br\s*\/?>/gi, " ") || "Product Details";
  const whatsappUrl = `https://wa.me/919227915114?text=Hello,%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
    safeName
  )}`;

  const technicalDataEntries = Object.entries(product.technicalData || {});

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="min-w-0 pr-4">
            {product.brand && (
              <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-red-600 uppercase bg-red-50 rounded-md border border-red-200 mb-1.5">
                {product.brand}
              </span>
            )}
            <h2 className="text-base sm:text-2xl font-bold text-gray-900 line-clamp-2">
              {safeName}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {product.pdfLinks && product.pdfLinks.length > 0 && (
              <a
                href={product.pdfLinks[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>Datasheet</span>
              </a>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquiry</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Carousel Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-4">
                {images.length > 0 ? (
                  <div ref={emblaRef} className="w-full h-full overflow-hidden">
                    <div className="flex h-full">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="flex-[0_0_100%] min-w-0 relative h-full flex items-center justify-center"
                        >
                          <Image
                            src={img}
                            alt={`${safeName} image ${idx + 1}`}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">No Image Available</div>
                )}

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => emblaApi?.scrollPrev()}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => emblaApi?.scrollNext()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-700 hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(idx)}
                      className={`relative w-12 h-12 rounded-lg border overflow-hidden shrink-0 transition-all ${
                        idx === selectedIndex
                          ? "border-red-600 ring-2 ring-red-100"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="thumbnail"
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Details Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Key Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                    {product.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specifications Table */}
              {technicalDataEntries.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" /> Technical Specifications
                  </h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3">Parameter</th>
                          <th className="py-2.5 px-3">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {technicalDataEntries.map(([key, val], idx) => (
                          <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-2 px-3 font-medium text-gray-600 bg-gray-50/40 w-1/3">
                              {key}
                            </td>
                            <td className="py-2 px-3 text-gray-800 font-semibold">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Applications & Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.application && product.application.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-500" /> Applications
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {product.application.map((app, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.properties && product.properties.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Properties
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {product.properties.map((prop, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          <span>{prop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
