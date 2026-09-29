"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Client, CompanyInfo } from "@/types";

interface HappyClientsProps {
  clients: Client[];
  companyInfo: CompanyInfo;
}

export default function HappyClients({
  clients,
  companyInfo,
}: HappyClientsProps) {
  const clientsWithLogos = clients.filter((c) => c.logo?.url);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: companyInfo.clientCarouselSpeedMs || 2500,
        stopOnInteraction: false,
      }),
    ]
  );

  if (clientsWithLogos.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/60 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Our Happy Clients
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Supplying premier builders, EPC contractors, infrastructure projects, and OEMs across India
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {clientsWithLogos.map((client, index) => {
              const logoUrl = client.logo?.url?.startsWith("http")
                ? client.logo.url
                : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${client.logo?.url || ""}`;

              return (
                <div
                  key={`client-${client.id || index}`}
                  className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_16.66%] px-2.5"
                >
                  <div className="flex items-center justify-center p-4 h-28 sm:h-32 rounded-2xl bg-white border border-gray-200/80 hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-300 group">
                    <div className="relative w-full h-full">
                      <Image
                        src={logoUrl}
                        alt={client.name || "Client Logo"}
                        fill
                        className="object-contain hover:scale-105 transition-all duration-300"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
