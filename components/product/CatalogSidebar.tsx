"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import { NavParentCategory } from "@/types";

interface CatalogSidebarProps {
  navData: NavParentCategory[];
  currentParentId?: string;
  currentCategoryId?: string;
}

export default function CatalogSidebar({
  navData,
  currentParentId,
  currentCategoryId,
}: CatalogSidebarProps) {
  const [search, setSearch] = useState("");
  const isSearching = search.trim().length > 0;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    ...(currentParentId ? { [currentParentId]: true } : {}),
  });

  const toggleParent = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredData = useMemo(() => {
    if (!isSearching) return navData;
    const q = search.toLowerCase();
    return navData
      .map((p) => {
        const matchesParent = p.name.toLowerCase().includes(q);
        const matchedSubs = p.categories.filter((c) =>
          c.name.toLowerCase().includes(q)
        );
        if (matchesParent || matchedSubs.length > 0) {
          return {
            ...p,
            categories: matchesParent ? p.categories : matchedSubs,
          };
        }
        return null;
      })
      .filter(Boolean) as NavParentCategory[];
  }, [navData, isSearching, search]);

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white border-r border-gray-100 p-4 flex flex-col gap-4">
      {/* Search Filter Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter categories..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Tree */}
      <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {filteredData.length === 0 ? (
          <p className="text-xs text-gray-400 p-3 text-center">No categories found</p>
        ) : (
          filteredData.map((parent) => {
            const isCurrentParent = parent.id === currentParentId;
            const isOpen = isSearching ? true : openMap[parent.id] ?? isCurrentParent;

            return (
              <div key={parent.id} className="rounded-xl overflow-hidden border border-gray-100/80">
                {/* Parent Row */}
                <div
                  className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                    isCurrentParent
                      ? "bg-red-50 text-red-600 font-bold"
                      : "bg-gray-50/70 hover:bg-gray-100 text-gray-800 font-semibold"
                  }`}
                >
                  <Link
                    href={`/category/${parent.id}`}
                    className="flex-1 text-xs sm:text-sm truncate mr-2"
                  >
                    {parent.name}
                  </Link>

                  {parent.categories.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleParent(parent.id);
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "rotate-90 text-red-500" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategory List */}
                {isOpen && parent.categories.length > 0 && (
                  <div className="bg-white py-1 px-2 space-y-0.5 border-t border-gray-100">
                    {parent.categories.map((sub) => {
                      const isSelected =
                        isCurrentParent && sub.id === currentCategoryId;

                      return (
                        <Link
                          key={sub.id}
                          href={`/category/${parent.id}/${sub.id}`}
                          className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            isSelected
                              ? "bg-red-50 text-red-600 font-bold"
                              : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
