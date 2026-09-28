import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  spinnerClassName?: string;
}

export default function Loading({
  text = "Loading...",
  className,
  spinnerClassName,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground",
        className
      )}
    >
      <Loader2
        className={cn("w-8 h-8 animate-spin text-red-600", spinnerClassName)}
      />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
}
