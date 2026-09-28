"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavParentCategory } from "@/types";

interface CategoryListProps {
  navData: NavParentCategory[];
  onLinkClick?: () => void;
}

export default function CategoryList({
  navData,
  onLinkClick,
}: CategoryListProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl my-2 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 lg:max-w-none lg:grid-cols-4 lg:gap-y-8">
            {navData.map((parent) => (
              <div key={parent.id} className="relative">
                <Collapsible>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <button
                        className="w-full flex items-center justify-between text-left py-2 px-1 rounded hover:bg-gray-50 transition cursor-pointer"
                        aria-expanded={false}
                      >
                        <div>
                          <Link
                            href={`/category/${parent.id}`}
                            onClick={onLinkClick}
                            className="text-sm font-semibold text-gray-900 hover:text-[#E03131] transition-colors"
                          >
                            <span className="inline-block mr-2">
                              {parent.name}
                            </span>
                          </Link>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="mt-2 space-y-1 pl-1">
                      {parent.categories.map((cat) => (
                        <p
                          key={cat.id}
                          className="text-xs text-gray-600 hover:text-[#E03131] border-b-[1px] border-indigo-50 py-2 transition-colors"
                        >
                          <Link
                            href={`/category/${parent.id}/${cat.id}`}
                            onClick={onLinkClick}
                            className="block w-full"
                          >
                            {cat.name}
                          </Link>
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
