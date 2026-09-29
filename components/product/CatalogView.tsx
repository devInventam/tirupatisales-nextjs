"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Filter,
  ChevronDown,
  PackageOpen,
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    "category" | "subcategory" | "brand" | null
  >(null);

  // Lock body scroll when mobile filter sheet is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  // Derive matched product from URL query if not dismissed
  const urlProduct = useMemo(() => {
    if (!productQuery || initialProducts.length === 0) return null;
    const q = productQuery.toLowerCase();
    return (
      initialProducts.find(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase() === q,
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
      (p) => (p.brand || "").trim().toLowerCase() === target,
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

  const handleCategoryChange = (newParentId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/category/${newParentId}${query}`);
  };

  const handleSubcategoryChange = (newSubSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    if (newSubSlug === "all") {
      router.push(`/category/${parentCatId}${query}`);
    } else {
      router.push(`/category/${parentCatId}/${newSubSlug}${query}`);
    }
  };

  const handleResetFilters = () => {
    router.push(`/category/${parentCatId}`);
  };

  const handleOpenDetails = (product: ProductItem) => {
    setModalDismissed(false);
    setClickedProduct(product);
  };

  const currentParent = navData.find((p) => p.id === parentCatId);
  const currentSub = subcategories.find((s) => s.slug === categoryId);

  // Count active applied filters
  const activeFiltersCount =
    (categoryId ? 1 : 0) + (selectedBrand !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Product Details Dialog */}
      <ProductDetailsModal
        product={activeProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Breadcrumb & Filter Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium min-w-0"
          >
            <Link
              href="/"
              className="text-gray-500 hover:text-red-600 transition-colors shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              href={`/category/${parentCatId}`}
              className={`transition-colors truncate ${
                !categoryId
                  ? "text-red-600 font-bold"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              {currentParent?.name || parentCatId}
            </Link>
            {currentSub && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-red-600 font-bold truncate">
                  {currentSub.name}
                </span>
              </>
            )}
          </nav>

          {/* Desktop Filter Dropdowns */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Category / Subcategory Filter Dropdown */}
            {subcategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">
                  Sub-Category:
                </span>
                <div className="relative">
                  <select
                    value={categoryId || "all"}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Brand:</span>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs"
                >
                  <option value="All">
                    All Brands ({initialProducts.length})
                  </option>
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

          {/* Mobile Single Filter Button */}
          <div className="flex lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              aria-label="Open Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Sidebar */}
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
              {filteredProducts.length} Product
              {filteredProducts.length === 1 ? "" : "s"}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-8">
              <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">
                No products found
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No products match the selected brand or subcategory filter. Try
                choosing a different filter.
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

      {/* Mobile Filter Bottom Sheet Drawer (Dribbble Design) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Top Grab Handle Pill */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.2 bg-gray-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 shrink-0">
              <div className="w-7" />
              <h2 className="text-base font-bold text-gray-900">Filter</h2>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {/* Option 1: Category */}
              <div className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev === "category" ? null : "category",
                    )
                  }
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-100/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Category
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <span className="text-gray-800 font-semibold truncate max-w-[150px]">
                      {currentParent?.name || "Select Category"}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedSection === "category" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedSection === "category" && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100/80 space-y-1.5 animate-in fade-in duration-150">
                    {navData.map((parentCat) => {
                      const isSelected = parentCat.id === parentCatId;
                      return (
                        <button
                          key={parentCat.id}
                          type="button"
                          onClick={() => {
                            handleCategoryChange(parentCat.id);
                            setExpandedSection("subcategory");
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-red-50 text-red-600 font-bold"
                              : "text-gray-700 hover:bg-white"
                          }`}
                        >
                          <span>{parentCat.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-red-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Option 2: Sub-Category */}
              {subcategories.length > 0 && (
                <div className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection((prev) =>
                        prev === "subcategory" ? null : "subcategory",
                      )
                    }
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-100/60 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Sub-Category
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <span className="text-gray-800 font-semibold truncate max-w-[150px]">
                        {currentSub?.name || "All Subcategories"}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          expandedSection === "subcategory" ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {expandedSection === "subcategory" && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100/80 space-y-1.5 animate-in fade-in duration-150">
                      <button
                        type="button"
                        onClick={() => handleSubcategoryChange("all")}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          !categoryId
                            ? "bg-red-50 text-red-600 font-bold"
                            : "text-gray-700 hover:bg-white"
                        }`}
                      >
                        <span>All Subcategories</span>
                        {!categoryId && (
                          <Check className="w-4 h-4 text-red-600" />
                        )}
                      </button>

                      {subcategories.map((sub) => {
                        const isSelected = sub.slug === categoryId;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSubcategoryChange(sub.slug)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-red-50 text-red-600 font-bold"
                                : "text-gray-700 hover:bg-white"
                            }`}
                          >
                            <span>{sub.name}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-red-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Option 3: Brand */}
              <div className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev === "brand" ? null : "brand",
                    )
                  }
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-gray-100/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Brand
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <span className="text-gray-800 font-semibold truncate max-w-[150px]">
                      {selectedBrand === "All" ? "All Brands" : selectedBrand}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedSection === "brand" ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedSection === "brand" && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100/80 space-y-1.5 animate-in fade-in duration-150 max-h-60 overflow-y-auto custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => handleBrandChange("All")}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedBrand === "All"
                          ? "bg-red-50 text-red-600 font-bold"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      <span>All Brands ({initialProducts.length})</span>
                      {selectedBrand === "All" && (
                        <Check className="w-4 h-4 text-red-600" />
                      )}
                    </button>

                    {brands.map((b) => {
                      const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
                      const count = brandCounts.get(b) || 0;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleBrandChange(b)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-red-50 text-red-600 font-bold"
                              : "text-gray-700 hover:bg-white"
                          }`}
                        >
                          <span>
                            {b}{" "}
                            <span className="text-gray-400 font-normal">
                              ({count})
                            </span>
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Sheet Action Bar */}
            <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                }}
                className="py-3.5 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer active:scale-95"
              >
                Clear all {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
              </button>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-black hover:bg-gray-900 text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/10 transition-all text-center cursor-pointer active:scale-[0.98]"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
