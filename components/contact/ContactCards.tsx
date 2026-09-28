import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export interface ContactOffice {
  id: string;
  label: string;
  address: string;
  phones: string[];
  email: string;
  timing?: string;
}

export const DEFAULT_OFFICES: ContactOffice[] = [
  {
    id: "head-office",
    label: "Head Office - Surat",
    address:
      "Plot no. 52-53, Soma Kanji ni Wadi, Nr Savera Complex, Udhna-City BRTS, Vesu Canal Rd, Khatodra Wadi, Surat, Gujarat, India 395002",
    phones: ["+91 92279 15114", "+91 98251 48878"],
    email: "sales@tirupatisales.com",
    timing: "09:00 AM To 06:30 PM (Mon - Sat)",
  },
  {
    id: "delhi-office",
    label: "Delhi NCR Office",
    address:
      "Fume Co-working, Plot 76-D, Phase IV, Udyog Vihar, Sector 18, Gurugram, Haryana, India 122001",
    phones: ["+91 95127 40077"],
    email: "northsales@tirupatisales.com",
    timing: "09:30 AM To 06:30 PM (Mon - Sat)",
  },
  {
    id: "warehouse",
    label: "Central Warehouse - Hazira",
    address:
      "Plot no 195, Ichhapore GIDC, Bhatpore, Limla, Surat-394510, Gujarat, India",
    phones: ["+91 92279 15116"],
    email: "hazira@tirupatisales.com",
    timing: "09:00 AM To 07:00 PM (Mon - Sat)",
  },
  {
    id: "ahmedabad-office",
    label: "Ahmedabad Branch Office",
    address:
      "Mondeal Heights, B Wing, 6th Floor, SG Highway, near Novotel Hotel, Ahmedabad, Gujarat, India 380015",
    phones: ["+91 78618 16105"],
    email: "ahd@tirupatisales.com",
    timing: "09:30 AM To 06:30 PM (Mon - Sat)",
  },
];

const buildMapHref = (address: string) =>
  `https://maps.google.com/?q=${encodeURIComponent(address)}`;

export function ContactCards({ offices = DEFAULT_OFFICES }: { offices?: ContactOffice[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {offices.map((office) => (
        <div
          key={office.id}
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
        >
          <div>
            {/* Header / Icon */}
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <MapPin className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              {office.label}
            </h3>

            {/* Address */}
            <a
              href={buildMapHref(office.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 block text-xs leading-relaxed text-slate-600 hover:text-orange-600 hover:underline"
              title="Click to view on Google Maps"
            >
              {office.address}
            </a>
          </div>

          {/* Contact Details */}
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-xs">
            {/* Phone */}
            <div className="space-y-1.5">
              {office.phones.map((phone, idx) => {
                const digits = phone.replace(/[^+\d]/g, "");
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Phone className="h-3.5 w-3.5 text-orange-500" />
                      {phone}
                    </span>
                    <a
                      href={`tel:${digits}`}
                      className="rounded-full border border-orange-200 bg-orange-50/50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white"
                    >
                      Call
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Email */}
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <a
                href={`mailto:${office.email}`}
                className="font-medium text-slate-700 hover:text-orange-600 hover:underline truncate"
              >
                {office.email}
              </a>
            </div>

            {/* Timings */}
            {office.timing && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span>{office.timing}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
