"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-8">
        We encountered an unexpected error while loading this page. Please try again or return to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
        <Button variant="outline" asChild className="rounded-xl gap-2">
          <Link href="/">
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
