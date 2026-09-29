"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Category } from "./Category";
import { CategoryListDropdown } from "./CategoryListDropdown";
import { productService } from "@/services/api";
import { CompanyInfo, NavParentCategory, SearchProduct } from "@/types";

function Bars3Icon({
  className = "size-6",
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function XMarkIcon({
  className = "size-6",
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

function MagnifyingGlassIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blogs", href: "/blogs" },
  { name: "Technical Guide", href: "/technical-guides" },
  { name: "Group Company", href: "/group-company" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

interface MainHeaderProps {
  companyInfo: CompanyInfo;
  navData: NavParentCategory[];
}

export default function MainHeader({ companyInfo, navData }: MainHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  // lock body scroll on mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // focus when opened
  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [searchOpen]);

  // keyboard: Cmd/Ctrl+K to open, Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close
  useEffect(() => {
    if (!searchOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!shellRef.current) return;
      if (!shellRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchOpen]);

  // recent
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem("tsc_recent_searches");
        if (raw) setRecent(JSON.parse(raw));
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const pushRecent = (term: string) => {
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 7);
      setRecent(next);
      localStorage.setItem("tsc_recent_searches", JSON.stringify(next));
    } catch {}
  };

  // Build indexes from API nav data
  const parentsIndex = useMemo(
    () => navData.map((p) => ({ id: p.id, name: p.name })),
    [navData],
  );

  const categoriesIndex = useMemo(
    () =>
      navData.flatMap((p) =>
        p.categories.map((c) => ({
          parentId: p.id,
          parentName: p.name,
          id: c.id,
          name: c.name,
        })),
      ),
    [navData],
  );

  // filter parents/categories by query
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) {
      return {
        parents: [] as typeof parentsIndex,
        categories: [] as typeof categoriesIndex,
      };
    }
    const inName = (s: string) => s.toLowerCase().includes(q);
    return {
      parents: parentsIndex.filter((p) => inName(p.name)).slice(0, 6),
      categories: categoriesIndex.filter((c) => inName(c.name)).slice(0, 8),
    };
  }, [q, parentsIndex, categoriesIndex]);

  // Debounced product search via Strapi
  useEffect(() => {
    if (!q) return;
    const timer = setTimeout(() => {
      productService.searchProducts(q).then(setSearchProducts);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const activeSearchProducts = q ? searchProducts : [];

  // build hrefs per your rules
  const parentHref = (parentId: string) => `/category/${parentId}`;
  const categoryHref = (parentId: string, categoryId: string) =>
    `/category/${parentId}/${categoryId}`;
  const productHref = (
    parentId: string,
    categoryId: string,
    productName: string,
  ) => `/category/${parentId}/${categoryId}?${encodeURIComponent(productName)}`;

  const homeItem = navigation.find((item) => item.name === "Home");
  const remainingNavItems = navigation.filter((item) => item.name !== "Home");

  return (
    <div className="">
      {/* Solid color background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

      {/* marquee banner - mt-20 to account for fixed header */}
      <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden relative mt-20">
        <div className="flex animate-marquee-smooth whitespace-nowrap text-lg font-bold text-gray-800">
          <span className="mx-16">
            Welcome to {companyInfo.companyName}{" "}
            <span className="font-black">
              Since {companyInfo.yearEstablished}
            </span>
            !!!! {companyInfo.marqueeText} with{" "}
            <span className="font-black">
              annual turnover {companyInfo.annualTurnover * 10} million
            </span>{" "}
            &{" "}
            <span className="font-black">
              {companyInfo.employeeCount}+ manpower
            </span>
          </span>
          <span className="mx-16">
            Welcome to {companyInfo.companyName}{" "}
            <span className="font-black">
              Since {companyInfo.yearEstablished}
            </span>
            !!!! {companyInfo.marqueeText} with{" "}
            <span className="font-black">
              annual turnover {companyInfo.annualTurnover * 10} million
            </span>{" "}
            &{" "}
            <span className="font-black">
              {companyInfo.employeeCount}+ manpower
            </span>
          </span>
        </div>
      </div>

      <header className="fixed inset-x-0 top-0 z-50 bg-black/70 backdrop-blur-md">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-3 lg:p-3"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 pt-2 rounded-md">
              <span className="sr-only">Tirupati Sales</span>
              <img
                alt="Tirupati Sales Logo"
                src="/assets/company_logo/header-logo-removed-bg.webp"
                className="h-10 w-auto max-w-[250px] sm:h-12 sm:max-w-[320px] lg:h-14 lg:max-w-[430px]"
              />
            </Link>
          </div>

          {/* Mobile menu + search */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-white hover:text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors cursor-pointer"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white hover:text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors cursor-pointer"
              aria-label="Open main menu"
            >
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            {homeItem && (
              <Link
                href={homeItem.href}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 outline-0 gap-0 text-white cursor-pointer text-base font-bold"
              >
                {homeItem.name}
              </Link>
            )}
            <Category navData={navData} />
            {remainingNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 outline-0 gap-0 text-white cursor-pointer text-base font-bold"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="font-semibold text-white hover:text-black hover:bg-white px-2 py-1 rounded-md"
              title="Search (Ctrl/⌘K)"
            >
              <MagnifyingGlassIcon className="inline-block mr-1 size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Search panel */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div
            ref={shellRef}
            className="
              mt-16
              w-full max-w-[92%] sm:max-w-[750px]
              rounded-2xl bg-white
              ring-1 ring-black/5
              shadow-[0_8px_30px_rgba(0,0,0,0.12)]
              transition-transform duration-300 scale-100
            "
          >
            {/* input row */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, parents…"
                className="
                  flex-1 border-0 bg-transparent focus:ring-0
                  text-sm sm:text-base text-gray-900 placeholder:text-gray-500 outline-none
                "
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 hover:bg-black/5"
                  aria-label="Clear"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </form>

            {/* results */}
            <div
              className="px-3 sm:px-4 pb-3 sm:pb-4 grid gap-3 sm:gap-4 
             max-h-[60vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              {query ? (
                <>
                  {/* Parents */}
                  {filtered.parents.length > 0 && (
                    <div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.parents.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={parentHref(p.id)}
                              onClick={() => {
                                pushRecent(query);
                                setSearchOpen(false);
                              }}
                              title={p.name}
                              className={[
                                "relative block w-full overflow-hidden",
                                "bg-white/70 px-3 py-2 text-sm ring-1 ring-black/5 hover:bg-[#dcddde] transition",
                                "after:pointer-events-none after:content-['']",
                                "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full",
                                "after:origin-left after:scale-x-0 hover:after:scale-x-100",
                                "after:bg-gradient-to-r after:from-orange-500 after:to-red-500",
                                "after:transition-transform after:duration-300",
                              ].join(" ")}
                            >
                              <span className="block truncate">{p.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Categories */}
                  {filtered.categories.length > 0 && (
                    <div>
                      <div className="px-1 pb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Categories
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.categories.map((c) => (
                          <li key={`${c.parentId}:${c.id}`}>
                            <Link
                              href={categoryHref(c.parentId, c.id)}
                              onClick={() => {
                                pushRecent(query);
                                setSearchOpen(false);
                              }}
                              title={`${c.name} — ${c.parentName}`}
                              className={[
                                "relative block w-full overflow-hidden",
                                " bg-white px-3 py-2 text-sm ring-1 ring-black/5 hover:bg-[#dcddde] transition",
                                "after:pointer-events-none after:content-['']",
                                "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full",
                                "after:origin-left after:scale-x-0 hover:after:scale-x-100",
                                "after:bg-gradient-to-r after:from-orange-500 after:to-red-500",
                                "after:transition-transform after:duration-300",
                              ].join(" ")}
                            >
                              <span className="block truncate">{c.name}</span>
                              <span className="block text-[11px] text-gray-500 truncate">
                                {c.parentName}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Products */}
                  {activeSearchProducts.length > 0 && (
                    <div>
                      <div className="px-1 pb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Products
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeSearchProducts.map((pr) => (
                          <li key={pr.id} className="flex">
                            <Link
                              href={productHref(
                                pr.parentSlug,
                                pr.subcategorySlug,
                                pr.name,
                              )}
                              onClick={() => {
                                pushRecent(query);
                                setSearchOpen(false);
                              }}
                              title={`${pr.name} - ${pr.brand || ""} ${
                                pr.subcategoryName || ""
                              }`.trim()}
                              className={[
                                "relative flex items-center gap-3 flex-1 overflow-hidden",
                                "bg-white px-3 py-2 text-sm ring-1 ring-black/5 hover:bg-[#dcddde] transition",
                                "after:pointer-events-none after:content-['']",
                                "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full",
                                "after:origin-left after:scale-x-0 hover:after:scale-x-100",
                                "after:bg-gradient-to-r after:from-orange-500 after:to-red-500",
                                "after:transition-transform after:duration-300",
                              ].join(" ")}
                            >
                              {pr.image ? (
                                <img
                                  src={pr.image}
                                  alt={pr.name}
                                  className="h-8 w-8 object-contain bg-white shrink-0"
                                />
                              ) : (
                                <div className="h-8 w-8 border-[1px] bg-white shrink-0" />
                              )}
                              <div className="min-w-0">
                                <div className="truncate">{pr.name}</div>
                                <div className="text-[11px] text-gray-500 truncate">
                                  {[pr.brand, pr.subcategoryName]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {filtered.parents.length === 0 &&
                    filtered.categories.length === 0 &&
                    activeSearchProducts.length === 0 && (
                      <div className="px-1 py-2 text-sm text-gray-600">
                        No matches
                      </div>
                    )}
                </>
              ) : (
                // Idle: recent chips
                <div className="grid gap-3">
                  {!!recent.length && (
                    <div>
                      <div className="px-1 pb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Recent
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            type="button"
                            title={r}
                            onClick={() => {
                              setQuery(r);
                            }}
                            className="max-w-[48%] sm:max-w-none truncate rounded-full bg-white/70 px-3 py-1.5 text-xs ring-1 ring-black/5 hover:bg-[#dcddde] transition"
                          >
                            <span className="truncate">{r}</span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setRecent([]);
                            localStorage.removeItem("tsc_recent_searches");
                          }}
                          className="text-xs text-gray-600 underline/30 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Drawer - OUTSIDE header so it spans full viewport */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Right Sidebar Drawer */}
          <div
            className="fixed inset-y-0 right-0 z-50 w-[85vw] xs:w-[320px] sm:w-[360px] max-w-[380px] h-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40 shrink-0">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Tirupati Sales</span>
                <img
                  alt="Tirupati Sales Logo"
                  src="/assets/company_logo/header-logo-removed-bg.webp"
                  className="h-9 w-auto max-w-[180px] object-contain"
                />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar">
              {homeItem && (
                <Link
                  href={homeItem.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {homeItem.name}
                </Link>
              )}

              {/* Expandable Products Hierarchy */}
              <CategoryListDropdown
                setMobileMenuOpen={setMobileMenuOpen}
                navData={navData}
              />

              {remainingNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-base font-semibold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-white/10 bg-black/50 space-y-3 shrink-0">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition-all active:scale-[0.98]"
              >
                Inquire Now / Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
