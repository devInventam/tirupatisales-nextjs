"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavParentCategory } from "@/types";

interface CategoryListDropdownProps {
  setMobileMenuOpen: (open: boolean) => void;
  navData: NavParentCategory[];
}

export function CategoryListDropdown({
  setMobileMenuOpen,
  navData,
}: CategoryListDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openParentId, setOpenParentId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Products Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span>Products</span>
        <ChevronDown
          className={`size-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-red-400" : ""
          }`}
        />
      </button>

      {/* Parent Categories Accordion */}
      {isOpen && (
        <div className="pl-3 pr-1 py-1 space-y-1 animate-in fade-in duration-150">
          {navData.map((parentCat) => {
            const isParentOpen = openParentId === parentCat.id;

            return (
              <div
                key={parentCat.id}
                className="border-b border-white/5 last:border-none pb-1"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/category/${parentCat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 px-2 text-sm font-medium text-gray-300 hover:text-red-400 hover:translate-x-0.5 transition-all"
                  >
                    {parentCat.name}
                  </Link>

                  {parentCat.categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenParentId((prev) =>
                          prev === parentCat.id ? null : parentCat.id
                        )
                      }
                      className="p-2 text-gray-400 hover:text-white cursor-pointer"
                      aria-label={`Toggle ${parentCat.name} subcategories`}
                    >
                      <ChevronRight
                        className={`size-3.5 transition-transform duration-200 ${
                          isParentOpen ? "rotate-90 text-red-400" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {isParentOpen && parentCat.categories.length > 0 && (
                  <ul className="pl-4 py-1 space-y-1 border-l-2 border-red-500/40 ml-2 animate-in fade-in duration-150">
                    {parentCat.categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/category/${parentCat.id}/${cat.id}`}
                          className="text-xs font-normal text-gray-400 hover:text-white hover:translate-x-1 transition-all block py-1.5"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
