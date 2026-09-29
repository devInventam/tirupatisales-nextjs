import React from "react";
import Image from "next/image";
import { CompanyValue } from "@/types";
import {
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Award,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface CompanyValuesProps {
  values: CompanyValue[];
}

const FALLBACK_VALUES: CompanyValue[] = [
  {
    id: 1,
    documentId: "1",
    title: "Mission",
    description:
      "Develop best solutions and services according to customers' needs for a satisfying smile.",
    displayOrder: 1,
  },
  {
    id: 2,
    documentId: "2",
    title: "Vision",
    description:
      "To be the leader in electrical solutions through excellence in customer service and innovation.",
    displayOrder: 2,
  },
  {
    id: 3,
    documentId: "3",
    title: "Commitment",
    description:
      "We deliver quality at a fair price, exceed client expectations, and uphold growth, responsibility, and safety standards.",
    displayOrder: 3,
  },
];

const FALLBACK_LUCIDE_ICONS: LucideIcon[] = [
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Award,
  Sparkles,
];

function getIconForValue(title: string, index: number): string | null {
  const t = title.toLowerCase();
  if (t.includes("mission")) return "/assets/mission.webp";
  if (t.includes("vision")) return "/assets/vision.webp";
  if (t.includes("commit") || t.includes("trust") || t.includes("reliab")) {
    return "/assets/trust.webp";
  }

  const defaultAssets = [
    "/assets/mission.webp",
    "/assets/vision.webp",
    "/assets/trust.webp",
  ];
  return defaultAssets[index % defaultAssets.length] || null;
}

export function CompanyValues({ values }: CompanyValuesProps) {
  const displayValues = values.length > 0 ? values : FALLBACK_VALUES;

  return (
    <section className="bg-gradient-to-r from-[#BCC9D6] via-[#7D94AB] to-[#2D415F] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow mb-3 sm:mb-4">
            Core Values & Principles
          </h2>
          <p className="text-sm sm:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed">
            Guided by three decades of unwavering commitment to technical
            excellence, customer trust, and superior electrical engineering
            standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 items-stretch">
          {displayValues.map((val, idx) => {
            const iconSrc = getIconForValue(val.title, idx);
            const FallbackIcon =
              FALLBACK_LUCIDE_ICONS[idx % FALLBACK_LUCIDE_ICONS.length];
            const cleanTitle = val.title.replace(/^our\s+/i, "");

            return (
              <div
                key={val.id}
                className="group relative rounded-2xl bg-white p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-transparent hover:border-red-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0">
                      {iconSrc ? (
                        <Image
                          src={iconSrc}
                          alt={cleanTitle}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FallbackIcon className="h-10 w-10 text-red-500" />
                      )}
                    </div>
                    <div>
                      <span className="block text-sm sm:text-base font-bold text-[#2D425C]">
                        Our
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D425C] tracking-tight">
                        {cleanTitle}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

