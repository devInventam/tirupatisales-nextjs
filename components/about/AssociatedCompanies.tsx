import React from "react";
import { GroupCompany } from "@/types";
import { getStrapiMediaUrl } from "@/lib/media";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, ExternalLink, Building } from "lucide-react";

interface AssociatedCompaniesProps {
  companies: GroupCompany[];
  showHeader?: boolean;
}

const FALLBACK_COMPANIES: GroupCompany[] = [
  {
    id: 1,
    documentId: "1",
    name: "Tirupati Switchgear & Controls",
    category: "Switchgear & Panel Fabrication",
    address: "Plot 52-53, Soma Kanji ni Wadi, Khatodra Wadi, Surat - 395002, Gujarat",
    phone: ["+91 92279 15114"],
    email: ["sales@tirupatisales.com"],
    website: "https://www.tirupatisales.com",
    since: "1993",
    displayOrder: 1,
  },
  {
    id: 2,
    documentId: "2",
    name: "Tirupati Illuminations & Industrial Lighting",
    category: "Commercial & Industrial Lighting Solutions",
    address: "Mondeal Heights, B Wing, SG Highway, Ahmedabad - 380015, Gujarat",
    phone: ["+91 78618 16105"],
    email: ["ahd@tirupatisales.com"],
    website: "https://www.tirupatisales.com",
    since: "2008",
    displayOrder: 2,
  },
  {
    id: 3,
    documentId: "3",
    name: "Tirupati Electrical Projects NCR",
    category: "North India Industrial Distribution",
    address: "Plot 76-D, Phase IV, Udyog Vihar, Sector 18, Gurugram - 122001, Haryana",
    phone: ["+91 95127 40077"],
    email: ["northsales@tirupatisales.com"],
    website: "https://www.tirupatisales.com",
    since: "2015",
    displayOrder: 3,
  },
];

export function AssociatedCompanies({
  companies,
  showHeader = true,
}: AssociatedCompaniesProps) {
  const displayCompanies = companies.length > 0 ? companies : FALLBACK_COMPANIES;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-800">
              Our Network
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Associated & Group Companies
            </h2>
            <p className="mt-3 text-base text-slate-600">
              A diversified network of engineering and distribution companies serving
              specialized industrial electrical requirements.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayCompanies.map((company) => {
            const imageUrl = company.image ? getStrapiMediaUrl(company.image) : null;
            return (
              <div
                key={company.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl"
              >
                <div>
                  {/* Image header if present */}
                  {imageUrl ? (
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={company.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-orange-400">
                      <Building className="h-12 w-12 opacity-80" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {company.name}
                        </h3>
                        {company.category && (
                          <p className="mt-1 text-xs font-semibold text-orange-600">
                            {company.category}
                          </p>
                        )}
                      </div>
                      {company.since && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                          Since {company.since}
                        </span>
                      )}
                    </div>

                    {/* Address & Contacts */}
                    <div className="mt-6 space-y-2.5 text-xs text-slate-600">
                      {company.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <span className="leading-relaxed">{company.address}</span>
                        </div>
                      )}

                      {company.phone && company.phone.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <div className="flex flex-wrap gap-2">
                            {company.phone.map((p, idx) => (
                              <a
                                key={idx}
                                href={`tel:${p.replace(/\s/g, "")}`}
                                className="font-semibold text-slate-800 hover:text-orange-600 hover:underline"
                              >
                                {p}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {company.email && company.email.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <div className="flex flex-wrap gap-2">
                            {company.email.map((e, idx) => (
                              <a
                                key={idx}
                                href={`mailto:${e}`}
                                className="font-medium text-slate-700 hover:text-orange-600 hover:underline truncate"
                              >
                                {e}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {company.website && (
                        <div className="flex items-center gap-2 pt-1">
                          <Globe className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-orange-600 hover:underline"
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 text-[11px] font-medium text-slate-500">
                  Authorized Part of Tirupati Group Network
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
