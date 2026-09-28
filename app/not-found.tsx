import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-6xl sm:text-8xl font-black text-red-600/20 tracking-widest mb-2">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2">
          <Link href="/">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl gap-2">
          <Link href="/contact">
            <ArrowLeft className="w-4 h-4" /> Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
