"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CategoryList from "./CategoryList";
import { NavParentCategory } from "@/types";

interface CategoryProps {
  navData: NavParentCategory[];
}

export function Category({ navData }: CategoryProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        data-slot="dropdown-menu-trigger"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 py-2 has-[>svg]:px-3 outline-0 gap-0 text-white cursor-pointer text-base font-bold px-2"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Products
        <ChevronDown
          className={`lucide lucide-chevron-down ml-1 h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="fixed left-1/2 -translate-x-1/2 top-16 z-50 w-screen max-w-5xl shadow-2xl rounded-2xl overflow-hidden border border-border bg-white animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <CategoryList navData={navData} onLinkClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
