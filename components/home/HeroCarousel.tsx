"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CompanyInfo, Slide } from "@/types";

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
        delay: 200000,
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
      {/* Responsive Carousel Section */}
      <div className="relative w-full h-[32vh] min-h-[220px] xs:h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[750px] overflow-hidden bg-gray-900">
        <div
          className="relative w-full h-full"
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
        >
          <div
            ref={emblaRef}
            className="overflow-hidden h-full"
            data-slot="carousel-content"
          >
            <div className="flex -ml-0 h-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  data-slot="carousel-item"
                  className="min-w-0 shrink-0 grow-0 basis-full pl-0 h-full"
                >
                  <div
                    className="relative w-full h-full cursor-pointer bg-gray-900"
                    onClick={() => onScrollToProducts?.()}
                  >
                    <Image
                      src={slide.image}
                      alt={`Hero Slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              data-slot="button"
              onClick={scrollPrev}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none size-8 sm:size-10 md:size-12 absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              data-slot="button"
              onClick={scrollNext}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none size-8 sm:size-10 md:size-12 absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                    index === selectedIndex
                      ? "bg-white w-5 sm:w-8"
                      : "bg-white/50 hover:bg-white/75 w-1.5 sm:w-2.5"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Corporate Highlight Strip */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-6 sm:py-8 border-y border-white/10 shadow-inner">
        <div className="text-center max-w-5xl mx-auto space-y-2 sm:space-y-3">
          <h1 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight">
            {companyInfo.companyName ? companyInfo.companyName.toUpperCase() : "TIRUPATI SALES CORPORATION"}
          </h1>
          <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white font-bold leading-snug">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Since {companyInfo.yearEstablished || 1993}
            </span>{" "}
            {companyInfo.heroTagline || "India's One of the Biggest & Trusted Distributor & Service Company"}
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-semibold">
            With Annual Group Turnover of{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold">
              {companyInfo.annualTurnover ? `${companyInfo.annualTurnover * 10} Million INR` : "6500 Million INR"}
            </span>{" "}
            &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-bold">
              {companyInfo.employeeCount || 200}+ Manpower
            </span>
          </p>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 font-medium sm:font-semibold leading-relaxed">
            Serving Product Segments:{" "}
            <span className="text-white font-bold">Electrical</span>,{" "}
            <span className="text-white font-bold">
              ELV &amp; Industrial MRO sectors through Distribution
            </span>
            ,{" "}
            <span className="text-white font-bold">Manufacturing</span> &amp;{" "}
            <span className="text-white font-bold">
              Sourcing Services &amp; Integrated Solutions.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
