import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-8 md:mb-12",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        align === "right" && "items-end text-right",
        className
      )}
    >
      {badge && (
        <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-50 rounded-full border border-red-200/60 mb-3">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
