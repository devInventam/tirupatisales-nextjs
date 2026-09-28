"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CompanyInfo, Slide } from "@/types";
import { Button } from "@/components/ui/button";

const fallbackSlides = [
  { id: 1, image: "/assets/slide/11-1.webp" },
  { id: 2, image: "/assets/slide/all_types_of_wire_and_cable.webp" },
  { id: 3, image: "/assets/slide/ELV1.webp" },
  { id: 4, image: "/assets/slide/fan11.webp" },
  { id: 5, image: "/assets/slide/MECO_instrument.webp" },
  { id: 6, image: "/assets/slide/Motors.webp" },
  { id: 7, image: "/assets/slide/Untitled_design_11zon.webp" },
];

interface HeroCarouselProps {
  slides: Slide[];
  companyInfo: CompanyInfo;
  onScrollToProducts?: () => void;
}

export default function HeroCarousel({
  slides: initialSlides,
  companyInfo,
  onScrollToProducts,
}: HeroCarouselProps) {
  const slides =
    initialSlides.length > 0
      ? initialSlides.map((s) => ({
          id: s.id,
          image: s.image?.url?.startsWith("http")
            ? s.image.url
            : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${s.image?.url || ""}`,
        }))
      : fallbackSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: companyInfo.heroCarouselSpeedMs || 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="w-full flex flex-col">
      {/* 70vh Carousel Section */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[72vh] overflow-hidden bg-gray-900">
        <div ref={emblaRef} className="w-full h-full overflow-hidden">
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="flex-[0_0_100%] min-w-0 relative h-full cursor-pointer bg-gray-950"
                onClick={() => onScrollToProducts?.()}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={`Hero Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === selectedIndex
                      ? "bg-white w-7 sm:w-9"
                      : "bg-white/40 hover:bg-white/70 w-2 sm:w-2.5"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Corporate Highlight Strip */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-8 border-y border-white/5 shadow-inner">
        <div className="text-center max-w-5xl mx-auto space-y-2 sm:space-y-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
            {companyInfo.companyName.toUpperCase()}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white font-bold">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Since {companyInfo.yearEstablished}
            </span>{" "}
            — {companyInfo.heroTagline}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white font-semibold">
            Annual Group Turnover:{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">
              ₹{companyInfo.annualTurnover} Cr
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              {companyInfo.employeeCount}+ Professional Team
            </span>
          </p>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Core Segments:{" "}
            <span className="text-white font-semibold">
              {companyInfo.productSegments}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
