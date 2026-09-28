"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, Clock, Trash2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSearchOpen,
  setSearchQuery,
  setSearchResults,
  setSearchLoading,
  loadRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "@/store/slices/searchSlice";
import { productService } from "@/services/api";
import { NavParentCategory } from "@/types";

interface SearchModalProps {
  navData: NavParentCategory[];
}

export default function SearchModal({ navData }: SearchModalProps) {
  const dispatch = useAppDispatch();
  const { isOpen, query, results, isLoading, recentSearches } = useAppSelector(
    (state) => state.search
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadRecentSearches());
  }, [dispatch]);

  // focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cmd/Ctrl+K keyboard listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatch(setSearchOpen(!isOpen));
      }
      if (e.key === "Escape" && isOpen) {
        dispatch(setSearchOpen(false));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, isOpen]);

  // click outside
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (shellRef.current && !shellRef.current.contains(e.target as Node)) {
        dispatch(setSearchOpen(false));
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [dispatch, isOpen]);

  // Index parents & subcategories from navData
  const parentsIndex = useMemo(
    () => navData.map((p) => ({ id: p.id, name: p.name })),
    [navData]
  );

  const categoriesIndex = useMemo(
    () =>
      navData.flatMap((p) =>
        p.categories.map((c) => ({
          parentId: p.id,
          parentName: p.name,
          id: c.id,
          name: c.name,
        }))
      ),
    [navData]
  );

  const q = query.trim().toLowerCase();
  const filteredNav = useMemo(() => {
    if (!q) {
      return { parents: [], categories: [] };
    }
    const inName = (s: string) => s.toLowerCase().includes(q);
    return {
      parents: parentsIndex.filter((p) => inName(p.name)).slice(0, 6),
      categories: categoriesIndex.filter((c) => inName(c.name)).slice(0, 8),
    };
  }, [q, parentsIndex, categoriesIndex]);

  // Debounced live search
  useEffect(() => {
    if (!q) {
      dispatch(setSearchResults([]));
      return;
    }

    dispatch(setSearchLoading(true));
    const timer = setTimeout(async () => {
      const items = await productService.searchProducts(q);
      dispatch(setSearchResults(items));
    }, 300);

    return () => clearTimeout(timer);
  }, [q, dispatch]);

  if (!isOpen) return null;

  const handleSelect = (searchTerm?: string) => {
    if (searchTerm) {
      dispatch(addRecentSearch(searchTerm));
    } else if (query.trim()) {
      dispatch(addRecentSearch(query.trim()));
    }
    dispatch(setSearchOpen(false));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in-0 duration-200">
      <div
        ref={shellRef}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search products, brands, categories (Ctrl+K)..."
            className="flex-1 bg-transparent border-0 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 text-red-500 animate-spin shrink-0" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => dispatch(setSearchQuery(""))}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Search Body */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Recent Searches (when query is empty) */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(clearRecentSearches())}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setSearchQuery(term));
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      {term}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeRecentSearch(term));
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Parent Categories */}
          {filteredNav.parents.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                Main Categories
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredNav.parents.map((p) => (
                  <Link
                    key={p.id}
                    href={`/category/${p.id}`}
                    onClick={() => handleSelect(p.name)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 hover:bg-red-50/60 border border-gray-100 hover:border-red-200 text-sm font-medium text-gray-800 hover:text-red-600 transition-all"
                  >
                    <span className="truncate">{p.name}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Subcategories */}
          {filteredNav.categories.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                Subcategories
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredNav.categories.map((c) => (
                  <Link
                    key={`${c.parentId}:${c.id}`}
                    href={`/category/${c.parentId}/${c.id}`}
                    onClick={() => handleSelect(c.name)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 hover:bg-red-50/60 border border-gray-100 hover:border-red-200 text-sm text-gray-700 hover:text-red-600 transition-all"
                  >
                    <div className="truncate">
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">
                        in {c.parentName}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Strapi Products Match */}
          {results.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                Products ({results.length})
              </span>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/category/${product.parentSlug}/${product.subcategorySlug}?product=${encodeURIComponent(
                      product.name
                    )}`}
                    onClick={() => handleSelect(product.name)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50/50 border border-transparent hover:border-red-100 transition-colors"
                  >
                    {product.image ? (
                      <div className="relative w-11 h-11 rounded-lg bg-white border border-gray-100 p-1 shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <Search className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.brand && (
                          <span className="font-medium text-red-600 mr-2">
                            {product.brand}
                          </span>
                        )}
                        {product.subcategoryName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query &&
            !isLoading &&
            results.length === 0 &&
            filteredNav.parents.length === 0 &&
            filteredNav.categories.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p className="text-sm">
                  No results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for brand names like Siemens, Havells, Schneider,
                  or product categories.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
