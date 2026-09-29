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
      {/* 70vh Carousel Section */}
      <div className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
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
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:hover:bg-accent/50 size-9 absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="lucide lucide-chevron-left w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              data-slot="button"
              onClick={scrollNext}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:hover:bg-accent/50 size-9 absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="lucide lucide-chevron-right w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`h-2 sm:h-3 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                    index === selectedIndex
                      ? "bg-white w-6 sm:w-8"
                      : "bg-white/50 hover:bg-white/70 w-2 sm:w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Corporate Highlight Strip */}
      <div className="min-h-[25vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-6 border-y border-white/5 shadow-inner">
        <div className="text-center max-w-5xl mx-auto space-y-2 md:space-y-3">
          <h1 className="text-lg sm:text-xl md:text-xl lg:text-xl font-black text-white tracking-tight">
            {companyInfo.companyName ? companyInfo.companyName.toUpperCase() : "TIRUPATI SALES CORPORATION"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-bold">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Since {companyInfo.yearEstablished || 1993}
            </span>{" "}
            {companyInfo.heroTagline || "India's One of the Biggest & Trusted Distributor & Service Company"}
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-semibold">
            With Annual Group Turnover of{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-bold">
              {companyInfo.annualTurnover ? `${companyInfo.annualTurnover * 10} Million INR` : "6500 Million INR"}
            </span>{" "}
            &amp;{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-bold">
              {companyInfo.employeeCount || 200}+ Manpower
            </span>
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-semibold">
            Serving Product Segments:{" "}
            <span>
              <span className="text-white font-bold">Electrical</span>,{" "}
            </span>
            <span>
              <span className="text-white font-bold">
                ELV &amp; Industrial MRO sectors through Distribution
              </span>
              ,{" "}
            </span>
            <span>
              <span className="text-white font-bold">Manufacturing</span> &amp;{" "}
            </span>
            <span>
              <span className="text-white font-bold">
                Sourcing Services &amp; Integrated Solutions.
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
