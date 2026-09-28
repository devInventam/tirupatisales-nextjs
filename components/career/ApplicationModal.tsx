"use client";

import React, { useEffect, useState } from "react";
import { X, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { careerService } from "@/services/api";
import { Job } from "@/types";

interface ApplicationModalProps {
  job: Job | null;
  onClose: () => void;
}

export function ApplicationModal({
  job,
  onClose,
}: ApplicationModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (job) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setResumeFile(undefined);
      setStatus("idle");
      setErrorMsg("");
    }
  }, [job]);

  if (!job) return null;

  const whatsappUrl = `https://wa.me/919512740405?text=${encodeURIComponent(
    `Hi, I visited Tirupati Sales website and I want to apply for the ${job.title} position.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!resumeFile) {
      setErrorMsg("Please upload your CV / Resume (up to 10MB).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const result = await careerService.submitJobApplication(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: `${job.title} (${job.type})`,
        department: job.department,
        preferredLocation: job.location,
        coverLetter: coverLetter.trim(),
        jobId: job.id,
      },
      resumeFile
    );

    setSubmitting(false);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Submission failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">
            Apply for Position
          </p>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5">{job.title}</h2>
          <p className="text-xs text-white/80 mt-1">
            {job.department} • {job.location} • {job.type}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* WhatsApp Quick Apply */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-emerald-950 mb-2">
              Fast Track: Send CV via WhatsApp
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send CV on WhatsApp (+91 95127 40405)</span>
            </a>
            <p className="text-[11px] text-emerald-700 mt-1.5">
              WhatsApp Only — No Phone Calls
            </p>
          </div>

          {/* Form */}
          {status === "success" ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Application Submitted!
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Thank you for applying for <strong>{job.title}</strong>. Our HR team will review your application and get in touch.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Shah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Message / Cover Note
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us about your relevant background..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <FileUpload
                label="Upload CV / Resume (PDF, DOCX up to 10MB) *"
                onFileSelect={setResumeFile}
              />

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationModal;
