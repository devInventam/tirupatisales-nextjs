import Image from "next/image";
import { Brand } from "@/types";

interface PartnerLogosProps {
  brands: Brand[];
}

export default function PartnerLogos({ brands }: PartnerLogosProps) {
  const brandsWithLogos = brands.filter((b) => b.logo?.url);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm text-red-600 font-bold uppercase tracking-wider mb-2">
            Authorized Channel Partner
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Authorized Partner of {brands.length > 0 ? `${brands.length}+` : "36+"} Global Brands
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            As authorized channel partners and stockists of leading global brands including Siemens, Schneider Electric, Havells, ABB, and Polycab, we guarantee 100% genuine products with complete manufacturer warranty and engineering support.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {brandsWithLogos.map((brand) => {
            const logoUrl = brand.logo?.url?.startsWith("http")
              ? brand.logo.url
              : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${brand.logo?.url || ""}`;

            return (
              <div
                key={brand.id}
                className="flex items-center justify-center p-3 h-20 rounded-xl border border-gray-200 bg-white hover:border-red-300 hover:shadow-md transition-all duration-300 group"
                title={brand.name}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
