import { Metadata } from "next";
import { ContactCards } from "@/components/contact/ContactCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Tirupati Sales Corporation",
  description:
    "Get in touch with Tirupati Sales Corporation for electrical products, switchgear distribution, customized panel manufacturing, tenders, and pricing inquiries.",
  keywords: [
    "contact tirupati sales",
    "electrical supplier contact",
    "surat electrical distributor",
    "switchgear quotes gujarat",
    "delhi electrical distributor",
  ],
  openGraph: {
    title: "Contact Tirupati Sales Corporation",
    description:
      "Connect with our technical sales engineers in Surat, Ahmedabad, and Delhi.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s Build Powerful Electrical Solutions Together
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Whether you need urgent switchgear supplies, a tailored industrial
              panel quote, or technical consulting, our engineers across Gujarat
              and Delhi are ready to support your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="bg-slate-50/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Our Branch Network
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Direct contact details for our offices and central warehouse
              </p>
            </div>
          </div>
          <ContactCards />
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Google Maps Embed Section */}
      <section className="relative overflow-hidden bg-slate-100">
        <div className="h-[420px] w-full">
          <iframe
            title="Tirupati Sales Corporation Head Office Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1860.177588995579!2d72.832827!3d21.178045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e5f22f17205%3A0x7f9cada3e22084a9!2sTirupati%20Sales%20Corporation!5e0!3m2!1sen!2sin!4v1755883342739!5m2!1sen!2sin"
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
