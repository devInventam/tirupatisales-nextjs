"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Images,
} from "lucide-react";

export interface GalleryItem {
  id: string | number;
  name: string;
  img: string;
  thumb?: string;
  category: string;
  section?: string;
  subSection?: string;
  year?: string;
}

interface GalleryViewerProps {
  images: GalleryItem[];
}

const FALLBACK_IMAGES: GalleryItem[] = [
  {
    id: 1,
    name: "Surat Head Office Premise",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    category: "Office Premises",
    section: "Office Premises",
  },
  {
    id: 2,
    name: "Executive Conference Room",
    img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80",
    category: "Office Premises",
    section: "Office Premises",
  },
  {
    id: 3,
    name: "Hazira Logistics Center - Heavy Storage Bay",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    category: "Warehouse",
    section: "Warehouse",
  },
  {
    id: 4,
    name: "Switchgear Staging & Inspection Area",
    img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
    category: "Warehouse",
    section: "Warehouse",
  },
  {
    id: 5,
    name: "Engineering Team Technical Sizing Workshop",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    category: "Office Activity",
    section: "Office Activity",
  },
  {
    id: 6,
    name: "Annual Corporate Partners Conclave",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    category: "Customer Activity",
    section: "Customer Activity",
  },
];

export function GalleryViewer({ images }: GalleryViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const rawImages = images.length > 0 ? images : FALLBACK_IMAGES;

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(rawImages.map((img) => img.category).filter(Boolean)))];
  }, [rawImages]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return rawImages;
    return rawImages.filter((img) => img.category === selectedCategory);
  }, [rawImages, selectedCategory]);

  const groupedSections = useMemo(() => {
    const map = new Map<string, GalleryItem[]>();
    filteredImages.forEach((img) => {
      const sectionName = img.section || img.category || "General";
      if (!map.has(sectionName)) {
        map.set(sectionName, []);
      }
      map.get(sectionName)!.push(img);
    });
    return Array.from(map.entries()).map(([section, items]) => ({
      section,
      items,
    }));
  }, [filteredImages]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLightboxOpen(true);
  };

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [filteredImages.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showPrev, showNext]);

  return (
    <div className="bg-slate-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {filteredImages.length} Photographs
          </span>
        </div>

        {/* Grouped Sections */}
        <div className="space-y-12">
          {groupedSections.map((group) => (
            <div key={group.section} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Images className="h-4 w-4" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">{group.section}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((item, localIdx) => {
                  const globalIdx = filteredImages.findIndex((i) => i.id === item.id);
                  const isFirstOffice =
                    group.section === "Office Premises" && localIdx === 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => openLightbox(globalIdx >= 0 ? globalIdx : 0)}
                      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg ${
                        isFirstOffice ? "col-span-2 row-span-2 sm:col-span-2" : ""
                      }`}
                    >
                      <div
                        className={`relative w-full overflow-hidden bg-slate-100 ${
                          isFirstOffice ? "h-72 sm:h-96" : "h-48 sm:h-56"
                        }`}
                      >
                        <Image
                          src={item.thumb || item.img}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

                        {/* Hover zoom icon */}
                        <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <Maximize2 className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="p-3.5">
                        <p className="truncate text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </p>
                        {item.subSection && (
                          <p className="text-[11px] text-slate-400 truncate">
                            {item.subSection}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && filteredImages[currentIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left arrow */}
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Right arrow */}
          <button
            onClick={showNext}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Zoom controls */}
          <div className="absolute top-5 left-5 z-50 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              className="text-white hover:text-orange-400"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="text-white hover:text-orange-400"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Main Image View */}
          <div className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center">
            <div
              className="relative h-[70vh] w-[85vw] max-w-5xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.15s ease-out",
              }}
            >
              <Image
                src={filteredImages[currentIndex].img}
                alt={filteredImages[currentIndex].name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center">
              <h4 className="text-base font-bold text-white">
                {filteredImages[currentIndex].name}
              </h4>
              <p className="text-xs text-slate-400">
                {currentIndex + 1} of {filteredImages.length} &bull;{" "}
                {filteredImages[currentIndex].category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
