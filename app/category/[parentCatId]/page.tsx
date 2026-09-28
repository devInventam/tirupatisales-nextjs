import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView from "@/components/product/CatalogView";
import Loading from "@/components/shared/Loading";
import { productService } from "@/services/api";

interface PageProps {
  params: Promise<{
    parentCatId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { parentCatId } = await params;
  const navData = await productService.getNavMenuData();
  const parent = navData.find((p) => p.id === parentCatId);
  const title = parent?.name || parentCatId;

  return {
    title: `${title} Catalog`,
    description: `Explore the complete catalog of ${title} products from Tirupati Sales Corporation. Authorized distributor for Siemens, Schneider, Havells, ABB, and top global brands.`,
    keywords: [
      title,
      `${title} distributor`,
      "electrical switchgear India",
      "industrial automation supplies",
    ],
  };
}

export default async function ParentCategoryPage({ params }: PageProps) {
  const { parentCatId } = await params;

  // Fetch initial products, subcategories, and nav menu in parallel on server
  const [products, subcategories, navData] = await Promise.all([
    productService.getProductsByCategory(parentCatId),
    productService.getSubcategories(parentCatId),
    productService.getNavMenuData(),
  ]);

  if (!products && !subcategories.length) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loading text="Loading catalog..." />
        </div>
      }
    >
      <CatalogView
        initialProducts={products}
        subcategories={subcategories}
        navData={navData}
        parentCatId={parentCatId}
      />
    </Suspense>
  );
}
