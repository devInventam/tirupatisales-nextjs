import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustFactors from "@/components/home/TrustFactors";
import ProductBentoGrid from "@/components/home/ProductBentoGrid";
import PartnerLogos from "@/components/home/PartnerLogos";
import HappyClients from "@/components/home/HappyClients";
import NotificationPopup from "@/components/home/NotificationPopup";
import {
  companyService,
  productService,
  notificationService,
} from "@/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const companyInfo = await companyService.getCompanyInfo();
  return {
    title: "Home",
    description: `Tirupati Sales Corporation supplies trusted electrical, lighting, switchgear, cable and industrial automation solutions across India since ${companyInfo.yearEstablished}.`,
    keywords: companyInfo.seoKeywords
      ? companyInfo.seoKeywords.split(",").map((k) => k.trim())
      : [
          "electrical products distributor",
          "Tirupati Sales Corporation Surat",
          "industrial electrical supplier India",
          "Siemens switchgear distributor",
        ],
  };
}

export default async function HomePage() {
  // Fetch all homepage data concurrently on the server
  const [
    companyInfo,
    slides,
    categories,
    brands,
    clients,
    notifications,
  ] = await Promise.all([
    companyService.getCompanyInfo(),
    companyService.getSlides(),
    productService.getCategories(),
    productService.getBrands(),
    productService.getClients(),
    notificationService.getNotifications(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Floating updates modal */}
      <NotificationPopup notifications={notifications} />

      {/* Hero Banner Carousel */}
      <HeroCarousel slides={slides} companyInfo={companyInfo} />

      {/* Trust Factors & Company Metrics */}
      <TrustFactors companyInfo={companyInfo} />

      {/* Product Categories Bento Grid */}
      <ProductBentoGrid categories={categories} />

      {/* Authorized Channel Brand Partners */}
      <PartnerLogos brands={brands} />

      {/* Happy Client Logos Carousel */}
      <HappyClients clients={clients} companyInfo={companyInfo} />
    </div>
  );
}
