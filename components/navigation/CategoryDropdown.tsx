"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CategoryList from "./CategoryList";
import { NavParentCategory } from "@/types";

interface CategoryDropdownProps {
  navData: NavParentCategory[];
}

export function CategoryDropdown({ navData }: CategoryDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Button
        variant="ghost"
        className="outline-0 gap-1 text-white cursor-pointer text-base font-bold px-3 hover:bg-white/10"
        onClick={() => setOpen(!open)}
      >
        Products
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-screen max-w-5xl shadow-2xl rounded-2xl overflow-hidden border border-border bg-white animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <CategoryList navData={navData} onLinkClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
