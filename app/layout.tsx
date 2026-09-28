import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";
import MainHeader from "@/components/navigation/MainHeader";
import Footer from "@/components/layout/Footer";
import { companyService, productService } from "@/services/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Tirupati Sales Corporation",
    default: "Tirupati Sales Corporation | Industrial Electrical & Automation Distributor",
  },
  description:
    "India's leading authorized distributor and engineering solutions provider for Siemens, Schneider Electric, Havells, ABB, and top global electrical brands. Turnkey panels, switchgear, wires & automation.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tirupatisales.com"
  ),
  keywords: [
    "Tirupati Sales Corporation",
    "Siemens distributor Surat",
    "Schneider Electric distributor Gujarat",
    "Havells industrial switchgear",
    "Electrical distribution India",
    "Control panels",
    "Industrial automation",
  ],
  authors: [{ name: "Tirupati Sales Corporation" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://tirupatisales.com",
    siteName: "Tirupati Sales Corporation",
    title: "Tirupati Sales Corporation | Industrial Electrical & Automation",
    description:
      "Authorized distributor for premier global electrical brands since 1993.",
    images: [
      {
        url: "/assets/company_logo/TSC_LOGO.webp",
        width: 1200,
        height: 630,
        alt: "Tirupati Sales Corporation",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global data on server in parallel with ISR caching
  const [companyInfo, navData, footerData] = await Promise.all([
    companyService.getCompanyInfo(),
    productService.getNavMenuData(),
    companyService.getFooter(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.companyName,
    url: "https://tirupatisales.com",
    logo: "https://tirupatisales.com/assets/company_logo/TSC_LOGO.webp",
    description: companyInfo.heroTagline,
    foundingDate: String(companyInfo.yearEstablished),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 52-53, Soma Kanji ni Wadi, Udhna-Citylight BRTS Canal Road",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395002",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: footerData.phone1,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-red-500 selection:text-white">
        <StoreProvider>
          <MainHeader companyInfo={companyInfo} navData={navData} />
          <main className="flex-1">{children}</main>
          <Footer footerData={footerData} />
        </StoreProvider>
      </body>
    </html>
  );
}
