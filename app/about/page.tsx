import { Metadata } from "next";
import { companyService } from "@/services/api/company.service";
import { technicalGuideService } from "@/services/api/technicalGuide.service";
import { CompanyValues } from "@/components/about/CompanyValues";
import { Infrastructure } from "@/components/about/Infrastructure";
import { AssociatedCompanies } from "@/components/about/AssociatedCompanies";
import { Building2, Award, Users, CheckCircle2, Sparkles } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Us | Tirupati Sales Corporation",
  description:
    "Discover Tirupati Sales Corporation's journey as India's premier industrial electrical and switchgear distribution powerhouse with 30+ years of trust.",
  keywords: [
    "about tirupati sales",
    "electrical distributor india",
    "surat switchgear dealer",
    "electrical company gujarat",
  ],
  openGraph: {
    title: "About Tirupati Sales Corporation",
    description:
      "Powering industrial progress for over 30 years with genuine switchgear and electrical products.",
    type: "website",
  },
};

export default async function AboutPage() {
  const [companyInfo, values, infrastructure, groupCompanies] = await Promise.all([
    companyService.getCompanyInfo(),
    companyService.getCompanyValues(),
    companyService.getInfrastructureItems(),
    technicalGuideService.getGroupCompanies(),
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Established 1993
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Powering India&apos;s Industrial Progress
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              For over {companyInfo.yearsExperience || 30} years, Tirupati Sales Corporation
              has stood at the forefront of industrial electrical trading, authorized switchgear
              distribution, and integrated project engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Story & Mission Intro */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-800">
                Our Heritage
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A Legacy of Trust, Technical Depth, & Speedy Delivery
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Founded with a vision to streamline industrial procurement, Tirupati Sales
                Corporation has grown from a local supplier into one of Western India’s
                largest stocking distributors of low-voltage and medium-voltage switchgear,
                cables, industrial lighting, and customized control panels.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                Operating with a 1,00,000 sq. ft. central logistics center in Hazira, Surat,
                we maintain high inventory volumes across world-renowned brands like Schneider
                Electric, L&T, Siemens, Polycab, Legrand, and Philips to guarantee prompt,
                accurate execution for EPC contractors, panel builders, OEMs, and industrial plants.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                  <span>100% Genuine Certified Stock</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                  <span>Fast Same-Day Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                  <span>Technical Sizing Support</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                  <span>Pan-India Logistics</span>
                </div>
              </div>
            </div>

            {/* Visual Stat Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-orange-50 to-amber-50/50 p-6 sm:p-8">
                <Building2 className="h-8 w-8 text-orange-600" />
                <div className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                  {companyInfo.yearsExperience || "30+"}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Years of Leadership
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Serving India’s key infrastructure and industrial hubs since 1993.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white">
                <Award className="h-8 w-8 text-orange-400" />
                <div className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  5,000+
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active B2B Clients
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Trusted by top chemical, textile, steel, and EPC enterprises.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white">
                <Users className="h-8 w-8 text-orange-400" />
                <div className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  100+
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Expert Engineers & Staff
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Dedicated technical engineers for design, quotation, and testing.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-orange-50 to-amber-50/50 p-6 sm:p-8">
                <Sparkles className="h-8 w-8 text-orange-600" />
                <div className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                  1,00,000
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sq. Ft. Central Hub
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Hazira warehouse ready with heavy switchgear stock for prompt delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <CompanyValues values={values} />

      {/* Infrastructure */}
      <Infrastructure items={infrastructure} />

      {/* Associated Companies */}
      <AssociatedCompanies companies={groupCompanies} />
    </main>
  );
}
