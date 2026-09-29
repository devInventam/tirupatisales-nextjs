"use client";

import React, { useState, useRef } from "react";
import { contactService } from "@/services/api/contact.service";
import { Turnstile } from "@/components/shared/Turnstile";
import {
  Send,
  Paperclip,
  Building2,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    mobile: "",
    email: "",
    remark: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be under 10 MB.");
        return;
      }
      setErrorMessage("");
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitState("error");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");

    const result = await contactService.submitInquiry(
      {
        name: formData.name.trim(),
        companyName: formData.companyName.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        remark: formData.remark.trim(),
      },
      attachment || undefined,
      turnstileToken,
    );

    if (result.success) {
      setSubmitState("success");
      setFormData({
        name: "",
        companyName: "",
        mobile: "",
        email: "",
        remark: "",
      });
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setSubmitState("error");
      setErrorMessage(
        result.error ||
          "Failed to submit your inquiry. Please try again or reach us by phone.",
      );
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Send Us an Inquiry
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Have questions regarding industrial switchgear, custom panels, pricing
          or tenders? Fill out the form below and our technical sales team will
          assist you.
        </p>
      </div>

      {/* Success banner */}
      {submitState === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <h4 className="text-sm font-bold">Inquiry Sent Successfully!</h4>
            <p className="mt-0.5 text-xs text-emerald-700">
              Thank you for reaching out. A copy has been routed to our
              technical engineering desk. We will respond within 1 business day.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {submitState === "error" && errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <h4 className="text-sm font-bold">Submission Failed</h4>
            <p className="mt-0.5 text-xs text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Rajesh Patel"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Company / Firm Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="e.g. Apex Electrical Industries"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contact@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Remark / Message */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Requirement / Remarks
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your switchgear, cable, or panel requirements (ratings, quantities, tender timeline)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 resize-none"
              />
            </div>
          </div>

          {/* Attachment */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Attachment / Bill of Materials (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center transition hover:border-orange-400 hover:bg-orange-50/30"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Paperclip className="h-5 w-5" />
              </div>
              {attachment ? (
                <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                  <span>{attachment.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachment(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-0.5 text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload BOM, RFQ, or technical drawings
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Supported: PDF, DOC, XLS, XLSX, PNG, JPG (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {submitState === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Inquiry…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Inquiry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
