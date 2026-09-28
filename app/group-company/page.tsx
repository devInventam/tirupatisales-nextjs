import { Metadata } from "next";
import { technicalGuideService } from "@/services/api/technicalGuide.service";
import { AssociatedCompanies } from "@/components/about/AssociatedCompanies";
import { Network, Sparkles } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Group Companies & Sister Concerns | Tirupati Sales Corporation",
  description:
    "Explore the Tirupati Sales Corporation group network specializing in switchgear fabrication, industrial lighting, and project supply across India.",
  keywords: [
    "tirupati group companies",
    "electrical group company india",
    "switchgear manufacturers surat",
    "industrial lighting solutions",
  ],
  openGraph: {
    title: "Tirupati Group of Companies",
    description:
      "A trusted network delivering excellence across electrical distribution, panel manufacturing, and illumination design.",
    type: "website",
  },
};

export default async function GroupCompanyPage() {
  const companies = await technicalGuideService.getGroupCompanies();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 backdrop-blur-sm">
              <Network className="h-3.5 w-3.5" />
              Corporate Network
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Our Group of Companies
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              A synergistic network of specialized engineering divisions and distribution
              enterprises delivering high-reliability electrical solutions across India.
            </p>
          </div>
        </div>
      </section>

      {/* Associated Companies List */}
      <div className="py-8">
        <AssociatedCompanies companies={companies} showHeader={false} />
      </div>
    </main>
  );
}
