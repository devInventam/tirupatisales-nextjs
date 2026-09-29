"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { NavParentCategory } from "@/types";

interface CategoryListDropdownProps {
  setMobileMenuOpen: (open: boolean) => void;
  navData: NavParentCategory[];
}

export function CategoryListDropdown({
  setMobileMenuOpen,
  navData,
}: CategoryListDropdownProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="-mx-3 rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible className="w-full">
            {navData.map((parentCat) => (
              <AccordionItem key={parentCat.id} value={parentCat.id}>
                <AccordionTrigger className="text-sm font-medium py-2 px-1">
                  {parentCat.name}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <ul className="pl-5 text-xs/5 text-gray-500 space-y-1">
                    {parentCat.categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/category/${parentCat.id}/${cat.id}`}
                          className="hover:text-red-600 transition-colors block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
