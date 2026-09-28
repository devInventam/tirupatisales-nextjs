"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Megaphone,
  X,
} from "lucide-react";
import { StrapiNotification } from "@/types";

interface NotificationPopupProps {
  notifications: StrapiNotification[];
}

const styles = {
  launch: {
    label: "Product Launch",
    icon: Megaphone,
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  event: {
    label: "Event",
    icon: Calendar,
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  training: {
    label: "Training",
    icon: GraduationCap,
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  },
};

export default function NotificationPopup({
  notifications,
}: NotificationPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || notifications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, notifications.length]);

  if (!notifications.length) return null;

  const current = notifications[currentIndex] ?? notifications[0];
  const config = styles[current.type] || styles.event;
  const Icon = config.icon;

  const imageUrl = current.image?.url
    ? current.image.url.startsWith("http")
      ? current.image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${current.image.url}`
    : current.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop";

  return (
    <>
      {/* Floating Badge Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/3 z-40 -translate-y-1/2 rounded-l-2xl bg-gray-900 px-3 py-4 text-white shadow-xl hover:bg-black transition-all hover:px-4 cursor-pointer"
          aria-label="Open updates"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-yellow-400 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>
            <span
              className="hidden text-xs font-bold tracking-wider sm:block uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Updates
            </span>
          </div>
        </button>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="grid md:grid-cols-[1.1fr_1fr]">
              {/* Image Banner */}
              <div className="relative h-48 md:h-full min-h-[220px] bg-gray-950">
                <Image
                  src={imageUrl}
                  alt={current.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${config.badge}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {current.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {current.description}
                  </p>
                </div>

                <div className="mt-6">
                  {current.link ? (
                    <Link
                      href={current.link}
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
                    >
                      View Details
                    </Link>
                  ) : (
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-black transition-colors"
                    >
                      Inquire Now
                    </Link>
                  )}
                  <p className="mt-3 text-[11px] text-gray-400">{current.date}</p>
                </div>
              </div>
            </div>

            {/* Carousel Controls Footer */}
            {notifications.length > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-5 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        (prev) =>
                          (prev - 1 + notifications.length) %
                          notifications.length
                      )
                    }
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                    aria-label="Previous notification"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        (prev) => (prev + 1) % notifications.length
                      )
                    }
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                    aria-label="Next notification"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {notifications.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? "w-4 bg-red-600"
                          : "w-1.5 bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
