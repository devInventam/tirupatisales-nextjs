"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search as SearchIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDropdown } from "./CategoryDropdown";
import SearchModal from "./SearchModal";
import { useAppDispatch } from "@/store";
import { setSearchOpen } from "@/store/slices/searchSlice";
import { CompanyInfo, NavParentCategory } from "@/types";

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
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const homeItem = navigation.find((item) => item.name === "Home");
  const remainingNavItems = navigation.filter((item) => item.name !== "Home");

  return (
    <>
      {/* Search Modal */}
      <SearchModal navData={navData} />

      {/* Marquee Banner */}
      <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden relative mt-20">
        <div className="flex animate-marquee-smooth whitespace-nowrap text-xs sm:text-sm md:text-base font-bold text-gray-800">
          <span className="mx-8 sm:mx-16">
            Welcome to {companyInfo.companyName}{" "}
            <span className="font-black text-red-600">
              Since {companyInfo.yearEstablished}
            </span>
            ! {companyInfo.marqueeText} with{" "}
            <span className="font-black text-red-600">
              annual turnover ₹{companyInfo.annualTurnover} Cr
            </span>{" "}
            &{" "}
            <span className="font-black text-red-600">
              {companyInfo.employeeCount}+ manpower
            </span>
          </span>
          <span className="mx-8 sm:mx-16">
            Welcome to {companyInfo.companyName}{" "}
            <span className="font-black text-red-600">
              Since {companyInfo.yearEstablished}
            </span>
            ! {companyInfo.marqueeText} with{" "}
            <span className="font-black text-red-600">
              annual turnover ₹{companyInfo.annualTurnover} Cr
            </span>{" "}
            &{" "}
            <span className="font-black text-red-600">
              {companyInfo.employeeCount}+ manpower
            </span>
          </span>
        </div>
      </div>

      {/* Fixed Main Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <nav
          aria-label="Global"
          className="max-w-7xl mx-auto flex items-center justify-between p-3 lg:px-6"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">{companyInfo.companyName}</span>
              <div className="relative h-10 w-44 sm:h-12 sm:w-56 lg:h-14 lg:w-72">
                <Image
                  src="/assets/company_logo/header-logo-removed-bg.webp"
                  alt="Tirupati Sales Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Mobile Right Buttons (Search + Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Search products"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Open main menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {homeItem && (
              <Button
                variant="ghost"
                className={`outline-0 text-base font-bold px-3 transition-colors ${
                  pathname === "/"
                    ? "text-red-500 bg-white/5"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                asChild
              >
                <Link href={homeItem.href}>{homeItem.name}</Link>
              </Button>
            )}

            <CategoryDropdown navData={navData} />

            {remainingNavItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`outline-0 text-base font-bold px-3 transition-colors ${
                  pathname.startsWith(item.href)
                    ? "text-red-500 bg-white/5"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
                asChild
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>

          {/* Desktop Search Trigger */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => dispatch(setSearchOpen(true))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium"
              title="Search (Ctrl/⌘K)"
            >
              <SearchIcon className="h-4 w-4 text-red-400" />
              <span>Search...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white/80 font-mono">
                Ctrl K
              </kbd>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <div className="relative h-9 w-40">
                    <Image
                      src="/assets/company_logo/TSC_LOGO.webp"
                      alt="Tirupati Sales"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    dispatch(setSearchOpen(true));
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                    Search catalog...
                  </span>
                  <kbd className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="mt-6 space-y-1">
                {homeItem && (
                  <Link
                    href={homeItem.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                      pathname === "/"
                        ? "text-red-600 bg-red-50"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {homeItem.name}
                  </Link>
                )}

                {/* Mobile Products Accordion */}
                <div className="border-y border-gray-100 my-2 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileCategoriesOpen(!mobileCategoriesOpen)
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <span>Products</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileCategoriesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="mt-2 space-y-1 pl-3">
                      {navData.map((parent) => {
                        const isExpanded = expandedParent === parent.id;
                        return (
                          <div key={parent.id} className="space-y-1">
                            <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                              <Link
                                href={`/category/${parent.id}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-red-600 flex-1 truncate"
                              >
                                {parent.name}
                              </Link>
                              {parent.categories.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedParent(
                                      isExpanded ? null : parent.id
                                    )
                                  }
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <ChevronRight
                                    className={`w-4 h-4 transition-transform ${
                                      isExpanded ? "rotate-90 text-red-600" : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {isExpanded && parent.categories.length > 0 && (
                              <div className="pl-4 space-y-1 border-l-2 border-red-100 ml-3">
                                {parent.categories.map((cat) => (
                                  <Link
                                    key={cat.id}
                                    href={`/category/${parent.id}/${cat.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 px-2 text-xs text-gray-600 hover:text-red-600"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {remainingNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                      pathname.startsWith(item.href)
                        ? "text-red-600 bg-red-50"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-800">
                {companyInfo.companyName}
              </p>
              <p>Turnover ₹{companyInfo.annualTurnover} Cr • {companyInfo.employeeCount}+ Team</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
