import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogView from "@/components/product/CatalogView";
import Loading from "@/components/shared/Loading";
import { productService } from "@/services/api";

interface PageProps {
  params: Promise<{
    parentCatId: string;
    categoryId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { parentCatId, categoryId } = await params;
  const [subcategories, navData] = await Promise.all([
    productService.getSubcategories(parentCatId),
    productService.getNavMenuData(),
  ]);

  const sub = subcategories.find((s) => s.slug === categoryId);
  const parent = navData.find((p) => p.id === parentCatId);
  const title = sub?.name || categoryId;
  const parentTitle = parent?.name || parentCatId;

  return {
    title: `${title} - ${parentTitle}`,
    description: `Explore ${title} specifications, technical datasheets, brand options, and lead times from Tirupati Sales Corporation.`,
    keywords: sub?.seoKeywords
      ? sub.seoKeywords.split(",").map((k) => k.trim())
      : [title, parentTitle, "industrial electrical", "authorized distributor"],
  };
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { parentCatId, categoryId } = await params;

  // Fetch initial products for this specific subcategory, subcategories list, and nav menu
  const [products, subcategories, navData] = await Promise.all([
    productService.getProductsByCategory(parentCatId, categoryId),
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
          <Loading text="Loading products..." />
        </div>
      }
    >
      <CatalogView
        initialProducts={products}
        subcategories={subcategories}
        navData={navData}
        parentCatId={parentCatId}
        categoryId={categoryId}
      />
    </Suspense>
  );
}
