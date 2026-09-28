import Link from "next/link";
import Image from "next/image";
import { ProductCategory } from "@/types";

interface ProductBentoGridProps {
  categories: ProductCategory[];
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9CA3AF' font-size='14'>Product Category</text></svg>`
  );

export default function ProductBentoGrid({
  categories,
}: ProductBentoGridProps) {
  return (
    <section
      id="product-categories"
      className="w-full py-16 bg-[#F9FAFB] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-50 px-3.5 py-1 rounded-full border border-red-200 mb-2 inline-block">
            Industrial Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D425C] tracking-tight">
            Product Categories
          </h2>
          <p className="text-[#4B5563] mt-2 text-sm md:text-base">
            Powering industries with certified, high-performance electrical solutions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => {
            const imageUrl = category.image?.url
              ? category.image.url.startsWith("http")
                ? category.image.url
                : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${category.image.url}`
              : PLACEHOLDER_SVG;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group block h-full"
              >
                <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-gray-100 hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image container */}
                  <div className="relative w-full aspect-square p-4 flex items-center justify-center bg-gray-50/50 group-hover:bg-white transition-colors">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  {/* Title */}
                  <div className="p-4 bg-white flex flex-col items-center justify-center text-center flex-1 border-t border-gray-50">
                    <h3 className="text-sm sm:text-base font-bold text-[#2D425C] group-hover:text-red-600 transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="h-1 w-28 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mx-auto mt-16" />
      </div>
    </section>
  );
}
