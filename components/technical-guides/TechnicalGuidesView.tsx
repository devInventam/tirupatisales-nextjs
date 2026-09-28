"use client";

import React, { useState, useMemo } from "react";
import { TechnicalGuide } from "@/types";
import { getStrapiMediaUrl } from "@/lib/media";
import Image from "next/image";
import {
  FileText,
  Download,
  Eye,
  Play,
  ExternalLink,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface TechnicalGuidesViewProps {
  guides: TechnicalGuide[];
}

interface PDFItem {
  id: number;
  name: string;
  path: string;
  category: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const FALLBACK_GUIDES: PDFItem[] = [
  {
    id: 1,
    name: "Industrial Cable Current Rating & Voltage Drop Charts",
    path: "#",
    category: "Cable",
    description:
      "Comprehensive parameter sheets for LT/HT XLPE armoured cables, derating factors, and permissible short circuit ratings.",
  },
  {
    id: 2,
    name: "Commercial & Industrial Lighting Sizing Guide",
    path: "#",
    category: "Lights",
    description:
      "Lux calculation formulas, high-bay LED spacing standards, and flame-proof lighting area classifications.",
  },
  {
    id: 3,
    name: "Rigid & Flexible Conduit Dimension Specifications",
    path: "#",
    category: "Pipe",
    description:
      "Heavy duty PVC, GI, and corrugated conduit wire-capacity tables and installation bend radii.",
  },
  {
    id: 4,
    name: "Power Factor Correction & Capacitor Sizing Tables",
    path: "#",
    category: "Power Factor",
    description:
      "kVAR compensation tables, detuned harmonic filter calculation guidelines, and APFC panel setup.",
  },
];

export function TechnicalGuidesView({ guides }: TechnicalGuidesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const pdfItems: PDFItem[] = useMemo(() => {
    if (guides.length === 0) return FALLBACK_GUIDES;
    return guides.map((g) => {
      const pdfPath = g.pdfFile ? getStrapiMediaUrl(g.pdfFile) : g.path || "";
      const thumb = g.thumbnail ? getStrapiMediaUrl(g.thumbnail) : undefined;
      return {
        id: g.id,
        name: g.name,
        path: pdfPath,
        category: g.category || "General",
        description: g.description,
        videoUrl: g.videoUrl,
        thumbnailUrl: thumb,
      };
    });
  }, [guides]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(pdfItems.map((p) => p.category).filter(Boolean)))];
  }, [pdfItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return pdfItems;
    return pdfItems.filter((p) => p.category === selectedCategory);
  }, [pdfItems, selectedCategory]);

  const groupedItems = useMemo(() => {
    const map = new Map<string, PDFItem[]>();
    filteredItems.forEach((item) => {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category)!.push(item);
    });
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [filteredItems]);

  const handleOpen = (item: PDFItem) => {
    if (item.videoUrl) {
      window.open(item.videoUrl, "_blank", "noopener,noreferrer");
    } else if (item.path && item.path !== "#") {
      window.open(item.path, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = (path: string, name: string) => {
    if (!path || path === "#") return;
    const link = document.createElement("a");
    link.href = path;
    link.download = `${name.replace(/\s+/g, "_")}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
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
            {filteredItems.length} Technical Documents Available
          </span>
        </div>

        {/* Grouped sections */}
        <div className="space-y-12">
          {groupedItems.map((group) => (
            <div key={group.category} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <BookOpen className="h-4 w-4" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {group.category} Documentation
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((item) => {
                  const youtubeThumb = item.videoUrl
                    ? getYoutubeThumbnail(item.videoUrl)
                    : null;
                  const previewImg = item.thumbnailUrl || youtubeThumb;

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                    >
                      <div>
                        {/* Thumbnail / Header */}
                        {previewImg ? (
                          <div
                            onClick={() => handleOpen(item)}
                            className="relative h-44 w-full cursor-pointer overflow-hidden bg-slate-100"
                          >
                            <Image
                              src={previewImg}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                            {item.videoUrl && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-colors group-hover:bg-black/40">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
                                  <Play className="h-5 w-5 fill-slate-900 pl-0.5" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={() => handleOpen(item)}
                            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-orange-400 transition-colors group-hover:from-slate-900 group-hover:to-orange-950"
                          >
                            <FileText className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                            <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                              PDF Specification
                            </span>
                          </div>
                        )}

                        <div className="p-5">
                          <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                            {item.category}
                          </span>
                          <h4 className="mt-2 text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="border-t border-slate-100 p-4 pt-3">
                        <div className="flex items-center gap-2">
                          {item.videoUrl ? (
                            <button
                              onClick={() => handleOpen(item)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2 text-xs font-bold text-white transition hover:bg-orange-700"
                            >
                              <Play className="h-3.5 w-3.5 fill-white" />
                              Watch Video
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpen(item)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-105"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View PDF
                              </button>
                              <button
                                onClick={() => handleDownload(item.path, item.name)}
                                title="Download PDF"
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
