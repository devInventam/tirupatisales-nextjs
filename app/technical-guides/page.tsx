import { Metadata } from "next";
import { technicalGuideService } from "@/services/api/technicalGuide.service";
import { TechnicalGuidesView } from "@/components/technical-guides/TechnicalGuidesView";
import { FileCode, Sparkles } from "lucide-react";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Technical Guides & Parameter Sheets | Tirupati Sales Corporation",
  description:
    "Download official technical parameter guides, cable sizing charts, conduit specifications, and APFC power factor tables from Tirupati Sales Corporation.",
  keywords: [
    "technical guides electrical products",
    "cable technical parameters",
    "power factor technical guide",
    "switchgear parameter charts",
  ],
  openGraph: {
    title: "Technical Guides - Tirupati Sales Corporation",
    description:
      "Engineering data sheets, wiring capacities, and technical parameters for industrial electrical projects.",
    type: "website",
  },
};

export default async function TechnicalGuidesPage() {
  const guides = await technicalGuideService.getTechnicalGuides();

  const guidesJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Technical Guides & Data Sheets",
    description:
      "Technical parameter guides for cables, lights, conduits, switchgear and power factor products.",
    url: "/technical-guides",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DigitalDocument",
          name: guide.name,
          description: guide.description,
          url: guide.pdfFile?.url || guide.path,
        },
      })),
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 backdrop-blur-sm">
              <FileCode className="h-3.5 w-3.5" />
              Engineering Resources
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Technical Guides & Parameters
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Access verified engineering data, cable derating formulas, lighting lux
              parameters, and switchgear dimension catalogs directly from our technical team.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Guides List */}
      <TechnicalGuidesView guides={guides} />
    </main>
  );
}
