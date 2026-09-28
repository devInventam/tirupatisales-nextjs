"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import Turnstile from "@/components/shared/Turnstile";
import { newsletterService } from "@/services/api";
import { FooterData } from "@/types";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#product-categories" },
  { label: "About Us", href: "/about" },
  { label: "Technical Guides", href: "/technical-guides" },
  { label: "Gallery", href: "/gallery" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

interface FooterProps {
  footerData: FooterData;
}

export default function Footer({ footerData }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const result = await newsletterService.subscribe(email.trim(), turnstileToken);
    if (result.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-[#2D415F] text-gray-200 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Logo & Tagline */}
        <div className="space-y-4">
          <div className="inline-block p-2.5 bg-white rounded-xl shadow-xs">
            <div className="relative h-12 w-48">
              <Image
                src="/assets/company_logo/TSC_LOGO.webp"
                alt="Tirupati Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed max-w-sm">
            {footerData.tagline}
          </p>
          <div className="flex gap-3 pt-2">
            {footerData.facebookUrl && (
              <a
                href={footerData.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            )}
            {footerData.instagramUrl && (
              <a
                href={footerData.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {footerData.linkedinUrl && (
              <a
                href={footerData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="font-bold text-white text-base mb-4 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-red-400">›</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact Info */}
        <div className="space-y-3 text-xs sm:text-sm">
          <h3 className="font-bold text-white text-base mb-4 tracking-wide">
            Contact Us
          </h3>
          <div className="flex items-start gap-2.5 text-gray-300">
            <MapPin className="w-4 h-4 text-[#F5C846] shrink-0 mt-0.5" />
            <p className="whitespace-pre-line leading-relaxed">
              {footerData.address}
            </p>
          </div>
          {footerData.phone1 && (
            <div className="flex items-center gap-2.5 text-gray-300">
              <Phone className="w-4 h-4 text-[#F5C846] shrink-0" />
              <p>
                <span className="text-gray-400">{footerData.phone1Label}:</span>{" "}
                <a
                  href={`tel:${footerData.phone1.replace(/\s+/g, "")}`}
                  className="hover:text-white"
                >
                  {footerData.phone1}
                </a>
              </p>
            </div>
          )}
          {footerData.landline && (
            <div className="flex items-center gap-2.5 text-gray-300">
              <Phone className="w-4 h-4 text-[#F5C846] shrink-0" />
              <p>
                <span className="text-gray-400">{footerData.landlineLabel}:</span>{" "}
                <a
                  href={`tel:${footerData.landline.replace(/\s+/g, "")}`}
                  className="hover:text-white"
                >
                  {footerData.landline}
                </a>
              </p>
            </div>
          )}
          {footerData.email && (
            <div className="flex items-center gap-2.5 text-gray-300">
              <Mail className="w-4 h-4 text-[#F5C846] shrink-0" />
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                <a
                  href={`mailto:${footerData.email}`}
                  className="text-[#F5C846] hover:underline"
                >
                  {footerData.email}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Col 4: Newsletter & Price List */}
        <div>
          <h3 className="font-bold text-white text-base mb-3 tracking-wide">
            Stay Updated
          </h3>
          <p className="text-xs text-gray-300 mb-3">
            Subscribe for product launches, technical updates & price lists.
          </p>

          {status === "success" ? (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3.5 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Thank you for subscribing! You will receive our latest updates.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your business email"
                className="w-full px-3.5 py-2.5 rounded-xl text-gray-900 bg-white placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Turnstile onToken={setTurnstileToken} theme="dark" className="mt-1" />
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-md disabled:opacity-60 cursor-pointer"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#1F2D3D] py-4 px-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{footerData.copyrightText}</p>
          <p className="text-[11px] text-gray-500">
            Leading Electrical Distributor & Engineering Solutions Provider
          </p>
        </div>
      </div>
    </footer>
  );
}
