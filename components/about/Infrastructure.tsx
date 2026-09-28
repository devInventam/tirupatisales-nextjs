import React from "react";
import { InfrastructureItem } from "@/types";
import { getStrapiMediaUrl } from "@/lib/media";
import Image from "next/image";
import { Building2, Warehouse, Truck, Cpu, CheckCircle2 } from "lucide-react";

interface InfrastructureProps {
  items: InfrastructureItem[];
}

const FALLBACK_POINTS = [
  {
    icon: Building2,
    title: "Smart Office Infrastructure",
    description:
      "We operate from a well-structured and technologically advanced office environment designed to enhance productivity and efficiency with secure IT backup systems, ERP integration, and seamless project coordination.",
  },
  {
    icon: Warehouse,
    title: "1,00,000 sq. ft. High-Tech Logistics in Hazira",
    description:
      "We operate one of Western India's largest dedicated electrical warehouses equipped with heavy overhead cranes, computerized inventory management, and round-the-clock dispatches.",
  },
  {
    icon: Truck,
    title: "Fast Turnaround, Every Time",
    description:
      "By consolidating warehousing, packing, and dispatch directly from our central hub, we minimize transit lag times and guarantee same-day / next-day delivery for emergency project needs.",
  },
  {
    icon: Cpu,
    title: "Integrated Engineering Solutions",
    description:
      "End-to-end capabilities spanning switchgear distribution, customized panel fabrication, cable tray supply, BMS integration, industrial illumination design, and dedicated post-sales technical support.",
  },
];

export function Infrastructure({ items }: InfrastructureProps) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-800">
            Scale & Capability
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            State-of-the-Art Infrastructure
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Built to fulfill large-scale industrial projects with precision, rapid delivery,
            and complete quality assurance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.length > 0
            ? items.map((item) => {
                const iconUrl = item.icon ? getStrapiMediaUrl(item.icon) : null;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-orange-300 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      {iconUrl ? (
                        <div className="relative h-8 w-8">
                          <Image
                            src={iconUrl}
                            alt={item.title}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <Warehouse className="h-7 w-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            : FALLBACK_POINTS.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-orange-300 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {pt.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {pt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Highlights banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 p-8 text-white shadow-xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-black sm:text-4xl">1,00,000+</div>
              <div className="mt-1 text-xs font-medium text-orange-100 uppercase tracking-wider">
                Sq. Ft. Warehousing
              </div>
            </div>
            <div>
              <div className="text-3xl font-black sm:text-4xl">30+</div>
              <div className="mt-1 text-xs font-medium text-orange-100 uppercase tracking-wider">
                Years Industry Trust
              </div>
            </div>
            <div>
              <div className="text-3xl font-black sm:text-4xl">5,000+</div>
              <div className="mt-1 text-xs font-medium text-orange-100 uppercase tracking-wider">
                Industrial Clients
              </div>
            </div>
            <div>
              <div className="text-3xl font-black sm:text-4xl">100%</div>
              <div className="mt-1 text-xs font-medium text-orange-100 uppercase tracking-wider">
                Genuine OEM Brands
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
