"use client";

import React, { useRef, useState } from "react";
import { careerService } from "@/services/api/career.service";
import { Loader2, CheckCircle2, AlertCircle, Paperclip, X } from "lucide-react";

const DEPARTMENTS = [
  "Admin",
  "Admin Security",
  "Retail Sales",
  "Dispatch / Logistics",
  "General Department",
  "Back Office Sales",
  "Electrical Projects",
  "Field Sales & Marketing - B2B & Retail",
  "Electrician",
  "Finance & Accounts",
  "Human Resource",
  "Technical Sales Engineer (Switchgear/Panels)",
  "Application Engineer (Panel Board)",
  "Technical Sales Engineer (Lighting/Illumination)",
  "Panel Estimation & Design Engineer",
  "Other",
];

const LOCATIONS = ["Surat", "Ahmedabad", "Delhi", "Vadodara", "Other"];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const selectCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 appearance-none cursor-pointer";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export function GeneralApplicationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (!allowed.includes(file.type)) {
      setErrorMsg("Only PDF, DOC, DOCX, JPG, PNG files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size must be under 10 MB.");
      return;
    }
    setErrorMsg("");
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("Please enter your last name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!department) {
      setErrorMsg("Please select a department.");
      return;
    }
    if (!location) {
      setErrorMsg("Please select a location.");
      return;
    }
    if (department === "Other" && !otherDepartment.trim()) {
      setErrorMsg("Please specify your department.");
      return;
    }
    if (location === "Other" && !otherLocation.trim()) {
      setErrorMsg("Please specify your location.");
      return;
    }
    if (!resumeFile) {
      setErrorMsg("Please upload your CV / Resume.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const resolvedDept = department === "Other" ? otherDepartment.trim() : department;
    const resolvedLoc = location === "Other" ? otherLocation.trim() : location;

    const result = await careerService.submitJobApplication(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: "General Application",
        department: resolvedDept,
        preferredLocation: resolvedLoc,
        currentLocation: resolvedLoc,
        coverLetter: message.trim(),
      },
      resumeFile
    );

    setSubmitting(false);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">Application Submitted!</h3>
        <p className="mb-1 text-sm text-slate-600">
          Your CV has been received. Our recruitment team will review it and get in touch.
        </p>
        <p className="text-xs text-slate-400">A confirmation email has been logged.</p>
        <button
          onClick={() => {
            setStatus("idle");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setDepartment("");
            setOtherDepartment("");
            setLocation("");
            setOtherLocation("");
            setMessage("");
            setResumeFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black active:scale-95"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" required>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Rahul"
            className={inputCls}
          />
        </Field>
        <Field label="Last Name" required>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Shah"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email" required>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="rahul@example.com"
          className={inputCls}
        />
      </Field>

      {/* Phone */}
      <Field label="Mobile Number" required>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className={inputCls}
        />
      </Field>

      {/* Department */}
      <Field label="Department" required>
        <div className="relative">
          <select
            required
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setOtherDepartment("");
            }}
            className={selectCls}
          >
            <option value="">Please Select</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {department === "Other" && (
          <input
            required
            value={otherDepartment}
            onChange={(e) => setOtherDepartment(e.target.value)}
            placeholder="Specify your department"
            className={`${inputCls} mt-2`}
          />
        )}
      </Field>

      {/* Location */}
      <Field label="Preferred Location" required>
        <div className="relative">
          <select
            required
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setOtherLocation("");
            }}
            className={selectCls}
          >
            <option value="">Please Select</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {location === "Other" && (
          <input
            required
            value={otherLocation}
            onChange={(e) => setOtherLocation(e.target.value)}
            placeholder="Specify your city / location"
            className={`${inputCls} mt-2`}
          />
        )}
      </Field>

      {/* Message */}
      <Field label="Message / Cover Note">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience, skills, or why you want to join us…"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* Resume */}
      <Field label="Upload CV / Resume" required>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 text-left text-sm transition ${
            resumeFile
              ? "border-orange-400 bg-orange-50/60 text-orange-700"
              : "border-slate-200 bg-slate-50 text-slate-500 hover:border-orange-300 hover:bg-orange-50/30"
          }`}
        >
          <Paperclip className="h-5 w-5 shrink-0 text-slate-400" />
          <span className="flex-1 truncate">
            {resumeFile ? resumeFile.name : "Click to choose resume file"}
          </span>
          {resumeFile && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setResumeFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
              className="ml-auto shrink-0 p-1 text-slate-400 hover:text-red-500"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Accepted: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
        </p>
      </Field>

      {/* Error */}
      {(status === "error" || errorMsg) && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg || "Submission failed. Please try again."}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:brightness-105 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting CV…
          </>
        ) : (
          "Submit CV"
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        Your application will be reviewed confidentially by our HR team.
      </p>
    </form>
  );
}
