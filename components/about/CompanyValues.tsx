import React from "react";
import { CompanyValue } from "@/types";
import { Target, Eye, ShieldCheck, HeartHandshake, Award, Sparkles } from "lucide-react";

interface CompanyValuesProps {
  values: CompanyValue[];
}

const FALLBACK_VALUES: CompanyValue[] = [
  {
    id: 1,
    documentId: "1",
    title: "Mission",
    description:
      "To be the premier distributor and manufacturer of high-reliability electrical solutions, delivering safety, unmatched efficiency, and genuine innovation to every industrial client.",
    displayOrder: 1,
  },
  {
    id: 2,
    documentId: "2",
    title: "Vision",
    description:
      "To empower nation-building through integrated electrical infrastructure, sustainable switchgear distribution, and seamless engineering services across all sectors.",
    displayOrder: 2,
  },
  {
    id: 3,
    documentId: "3",
    title: "Trust & Reliability",
    description:
      "Upholding transparent business ethics, guaranteed product authenticity, prompt order fulfillment, and lifelong technical partnership with all our clients.",
    displayOrder: 3,
  },
];

const ICONS = [Target, Eye, ShieldCheck, HeartHandshake, Award, Sparkles];

export function CompanyValues({ values }: CompanyValuesProps) {
  const displayValues = values.length > 0 ? values : FALLBACK_VALUES;

  return (
    <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
            Our Foundation
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Core Values & Principles
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Guided by three decades of unwavering commitment to technical excellence, customer
            trust, and superior electrical engineering standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayValues.map((val, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={val.id}
                className="group relative rounded-3xl border border-slate-800 bg-slate-800/60 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:bg-slate-800 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7" />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  Our Pillar
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                  {val.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
