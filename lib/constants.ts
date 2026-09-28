import { CompanyInfo, FooterData } from "@/types";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  "https://admin.tirupatisales.com";

export const defaultCompanyInfo: CompanyInfo = {
  id: 0,
  documentId: "",
  companyName: "Tirupati Sales Corporation",
  yearEstablished: 1993,
  heroTagline: "India's One of the Biggest & Trusted Distributor & Service Company",
  marqueeText: "India's Biggest & Trusted Distributor & Servicing Company",
  productSegments: "Electrical, ELV & Industrial MRO",
  employeeCount: 200,
  employeeCountDescription: "Staff with deep technical know-how and support beyond sales.",
  brandsCount: 36,
  brandsCountDescription: "Working with 36+ global electrical brands.",
  yearsExperience: 30,
  yearsExperienceDescription: "Supplying to infrastructure, industries, and government projects.",
  annualTurnover: 600,
  annualTurnoverDescription: "Trusted by leading builders, infrastructure firms, and top corporates.",
  trustFactorsHeading: "Powering Businesses with Trusted Electrical Solutions",
  trustFactorsSubheading: "Our legacy, scale, and service make us a dependable partner across industries.",
  happyClientsCount: 500,
  happyClientsCountDescription: "Businesses that trust us for reliable electrical supply.",
  heroCarouselSpeedMs: 4000,
  clientCarouselSpeedMs: 2000,
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
};

export const defaultFooterData: FooterData = {
  tagline: "Empowering industries with reliable electrical solutions.",
  address:
    "Plot No. 52-53, Soma Kanji ni Wadi,\nUdhna-Citylight BRTS Canal Road,\nSurat-395002, Gujarat, India.",
  phone1Label: "Phone",
  phone1: "+91 92279 15114",
  phone2Label: "Mobile",
  phone2: "+91 98251 48878",
  landlineLabel: "Landline",
  landline: "0261 270 4000",
  email: "sales@tirupatisales.com",
  facebookUrl: "https://www.facebook.com/TirupatiSalesCorporation",
  instagramUrl: "https://www.instagram.com/tirupati_sales?igsh=N3Vnd29raWRuMXRv",
  linkedinUrl: "https://in.linkedin.com/company/tirupatisales",
  copyrightText: "© 2026 Tirupati Sales Corporation. All Rights Reserved.",
};
