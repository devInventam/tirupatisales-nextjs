import Image from "next/image";
import { Brand } from "@/types";
import { getStrapiMediaUrl } from "@/lib/media";

interface PartnerLogosProps {
  brands: Brand[];
}

export default function PartnerLogos({ brands }: PartnerLogosProps) {
  const brandsWithLogos = brands.filter((b) => b.logo?.url);

  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2 sm:mb-4">
            Authorized Partner of{" "}
            {brands.length > 0 ? `${brands.length}+` : "36+"} Global Brands
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            As authorized channel partners and stockists of leading global
            brands including Siemens, Schneider Electric, Havells, ABB, and
            Polycab, we guarantee 100% genuine products with complete
            manufacturer warranty and engineering support.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {brandsWithLogos.map((brand) => {
            const logoUrl = getStrapiMediaUrl(brand.logo);

            return (
              <div
                key={brand.id}
                className="flex items-center justify-center p-2.5 sm:p-3 h-16 sm:h-20 rounded-xl border border-gray-200 bg-white hover:border-red-300 hover:shadow-md transition-all duration-300 group"
                title={brand.name}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain transition-all duration-300 group-hover:scale-105"
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
