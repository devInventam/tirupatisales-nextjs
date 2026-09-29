import { Metadata } from "next";
import { careerService } from "@/services/api/career.service";
import { CareerClientView } from "@/components/career/CareerClientView";
import { Job } from "@/types";
import { Briefcase, Building, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers & Open Vacancies | Tirupati Sales Corporation",
  description:
    "Explore job opportunities in sales, electrical engineering, logistics, and office management across Gujarat at Tirupati Sales Corporation.",
  keywords: [
    "tirupati sales careers",
    "electrical jobs gujarat",
    "surat electrical company jobs",
    "switchgear jobs india",
  ],
  openGraph: {
    title: "Careers at Tirupati Sales Corporation",
    description:
      "Join Gujarat's leading electrical and switchgear distribution powerhouse.",
    type: "website",
  },
};

const fallbackJobs: Job[] = [
  {
    id: 1,
    documentId: "1",
    type: "Full Time",
    title: "Sales Executive",
    blurb:
      "Build and maintain relationships with clients, drive product sales, and support business growth across industrial regions.",
    department: "Sales",
    location: "Ahmedabad",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 2,
    documentId: "2",
    type: "Full Time",
    title: "Electrical Service Engineer",
    blurb:
      "Provide on-site installation, troubleshooting, and maintenance support for electrical equipment and systems.",
    department: "Electrical Service",
    location: "Vadodara",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 3,
    documentId: "3",
    type: "Full Time",
    title: "Logistics Coordinator",
    blurb:
      "Manage supply chain operations, ensure timely dispatches, and coordinate with vendors and transport teams.",
    department: "Dispatch / Logistics",
    location: "Surat",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 4,
    documentId: "4",
    type: "Full Time",
    title: "Billing Executive",
    blurb:
      "Handle billing, vendor payments, and daily accounting tasks while ensuring compliance with company policies.",
    department: "Finance & Accounts",
    location: "Vadodara",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
  {
    id: 5,
    documentId: "5",
    type: "Full Time",
    title: "Technical Sales Engineer (Switchgear)",
    blurb:
      "Technical consultation and sizing for industrial switchgear, control panels, and automation solutions.",
    department: "Technical Sales Engineer (Switchgear/Panels)",
    location: "Surat",
    isActive: true,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  },
];

export const revalidate = 60;

export default async function CareerPage() {
  const jobsData = await careerService.getJobs();
  const jobs = jobsData.length > 0 ? jobsData : fallbackJobs;

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Join Our Growing Team!
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Empowering industries across India with premium electrical
              solutions. We offer exciting career opportunities, hands-on
              growth, and a dynamic culture.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <Building className="h-4 w-4 text-orange-400" />
                <span>Head Office: Surat, Gujarat</span>
              </div>
              {/* <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>Branches in Ahmedabad, Vadodara, Delhi & more</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Career Portal Content */}
      <CareerClientView initialJobs={jobs} />
    </main>
  );
}
