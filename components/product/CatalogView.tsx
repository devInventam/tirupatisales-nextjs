"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Filter, ChevronDown, PackageOpen } from "lucide-react";
import CatalogSidebar from "./CatalogSidebar";
import ProductCard from "./ProductCard";
import ProductDetailsModal from "./ProductDetailsModal";
import { NavParentCategory, ProductItem, ProductSubcategory } from "@/types";

interface CatalogViewProps {
  initialProducts: ProductItem[];
  subcategories: ProductSubcategory[];
  navData: NavParentCategory[];
  parentCatId: string;
  categoryId?: string;
}

export default function CatalogView({
  initialProducts,
  subcategories,
  navData,
  parentCatId,
  categoryId,
}: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrand = searchParams.get("brand") || "All";
  const productQuery = searchParams.get("product") || "";

  const [clickedProduct, setClickedProduct] = useState<ProductItem | null>(null);
  const [modalDismissed, setModalDismissed] = useState(false);

  // Derive matched product from URL query if not dismissed
  const urlProduct = useMemo(() => {
    if (!productQuery || initialProducts.length === 0) return null;
    const q = productQuery.toLowerCase();
    return (
      initialProducts.find(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase() === q
      ) || null
    );
  }, [productQuery, initialProducts]);

  const activeProduct = clickedProduct || (!modalDismissed ? urlProduct : null);
  const isModalOpen = Boolean(activeProduct);

  const handleCloseModal = () => {
    setClickedProduct(null);
    setModalDismissed(true);
    if (productQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("product");
      const query = params.toString() ? `?${params.toString()}` : "";
      const basePath = categoryId
        ? `/category/${parentCatId}/${categoryId}`
        : `/category/${parentCatId}`;
      router.replace(`${basePath}${query}`);
    }
  };

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialProducts) {
      if (p.brand?.trim()) {
        set.add(p.brand.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialProducts]);

  // Calculate brand counts
  const brandCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of initialProducts) {
      const b = p.brand?.trim() || "Unbranded";
      map.set(b, (map.get(b) || 0) + 1);
    }
    return map;
  }, [initialProducts]);

  // Filter products by selected brand
  const filteredProducts = useMemo(() => {
    if (selectedBrand === "All") return initialProducts;
    const target = selectedBrand.toLowerCase();
    return initialProducts.filter(
      (p) => (p.brand || "").trim().toLowerCase() === target
    );
  }, [initialProducts, selectedBrand]);

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brand === "All") {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const basePath = categoryId
      ? `/category/${parentCatId}/${categoryId}`
      : `/category/${parentCatId}`;
    router.push(`${basePath}${query}`);
  };

  const handleOpenDetails = (product: ProductItem) => {
    setModalDismissed(false);
    setClickedProduct(product);
  };

  const currentParent = navData.find((p) => p.id === parentCatId);
  const currentSub = subcategories.find((s) => s.slug === categoryId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Product Details Dialog */}
      <ProductDetailsModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Breadcrumb Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              href={`/category/${parentCatId}`}
              className={`transition-colors ${
                !categoryId ? "text-red-600 font-bold" : "text-gray-500 hover:text-red-600"
              }`}
            >
              {currentParent?.name || parentCatId}
            </Link>
            {currentSub && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-red-600 font-bold">
                  {currentSub.name}
                </span>
              </>
            )}
          </nav>

          {/* Filter Dropdowns: Category & Brand */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Category / Subcategory Filter Dropdown */}
            {subcategories.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
                  Category:
                </span>
                <div className="relative">
                  <select
                    value={categoryId || "all"}
                    onChange={(e) => {
                      const val = e.target.value;
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      const query = params.toString()
                        ? `?${params.toString()}`
                        : "";
                      if (val === "all") {
                        router.push(`/category/${parentCatId}${query}`);
                      } else {
                        router.push(`/category/${parentCatId}/${val}${query}`);
                      }
                    }}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs"
                  >
                    <option value="all">All Subcategories</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Brand Filter Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
                Brand:
              </span>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs"
                >
                  <option value="All">All Brands ({initialProducts.length})</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b} ({brandCounts.get(b) || 0})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <CatalogSidebar
          navData={navData}
          currentParentId={parentCatId}
          currentCategoryId={categoryId}
        />

        {/* Product Grid Area */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {currentSub?.name || currentParent?.name || "Product Catalog"}
            </h1>
            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
              {filteredProducts.length} Product{filteredProducts.length === 1 ? "" : "s"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-8">
              <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">
                No products found
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No products match the selected brand or subcategory filter. Try choosing a different filter.
              </p>
              {selectedBrand !== "All" && (
                <button
                  type="button"
                  onClick={() => handleBrandChange("All")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Reset Brand Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
