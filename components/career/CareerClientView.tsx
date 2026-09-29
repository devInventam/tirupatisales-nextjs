"use client";

import React, { useState, useMemo } from "react";
import { Job } from "@/types";
import { JobCard } from "./JobCard";
import { ApplicationModal } from "./ApplicationModal";
import { GeneralApplicationForm } from "./GeneralApplicationForm";
import { MessageCircle, Mail, Filter, Briefcase, Sparkles } from "lucide-react";

interface CareerClientViewProps {
  initialJobs: Job[];
}

export function CareerClientView({ initialJobs }: CareerClientViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique departments & locations
  const allDepartments = useMemo(
    () =>
      Array.from(new Set(initialJobs.map((j) => j.department).filter(Boolean))),
    [initialJobs],
  );
  const allLocations = useMemo(
    () =>
      Array.from(new Set(initialJobs.map((j) => j.location).filter(Boolean))),
    [initialJobs],
  );

  // Cascading options
  const departmentOptions = useMemo(() => {
    if (selectedLocation === "All") return ["All", ...allDepartments];
    return [
      "All",
      ...Array.from(
        new Set(
          initialJobs
            .filter((j) => j.location === selectedLocation)
            .map((j) => j.department)
            .filter(Boolean),
        ),
      ),
    ];
  }, [selectedLocation, allDepartments, initialJobs]);

  const locationOptions = useMemo(() => {
    if (selectedDepartment === "All") return ["All", ...allLocations];
    return [
      "All",
      ...Array.from(
        new Set(
          initialJobs
            .filter((j) => j.department === selectedDepartment)
            .map((j) => j.location)
            .filter(Boolean),
        ),
      ),
    ];
  }, [selectedDepartment, allLocations, initialJobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const deptOk =
        selectedDepartment === "All" || job.department === selectedDepartment;
      const locOk =
        selectedLocation === "All" || job.location === selectedLocation;
      return deptOk && locOk;
    });
  }, [initialJobs, selectedDepartment, selectedLocation]);

  function handleDepartmentChange(dept: string) {
    setSelectedDepartment(dept);
    const valid =
      dept === "All"
        ? new Set(allLocations)
        : new Set(
            initialJobs
              .filter((j) => j.department === dept)
              .map((j) => j.location),
          );
    if (selectedLocation !== "All" && !valid.has(selectedLocation)) {
      setSelectedLocation("All");
    }
  }

  function handleLocationChange(loc: string) {
    setSelectedLocation(loc);
    const valid =
      loc === "All"
        ? new Set(allDepartments)
        : new Set(
            initialJobs
              .filter((j) => j.location === loc)
              .map((j) => j.department),
          );
    if (selectedDepartment !== "All" && !valid.has(selectedDepartment)) {
      setSelectedDepartment("All");
    }
  }

  function handleApply(job: Job) {
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  return (
    <div className="bg-slate-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {initialJobs.length}
              </span>{" "}
              vacancies
            </span>
          </div> */}

          {/* Quick Filter Reset */}
          {(selectedDepartment !== "All" || selectedLocation !== "All") && (
            <button
              onClick={() => {
                setSelectedDepartment("All");
                setSelectedLocation("All");
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 2 Column Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Job Listing (8 cols) */}
          <div className="lg:col-span-8">
            {/* Filter controls */}
            <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Filter className="h-4 w-4" /> Filters:
              </div>

              {/* Department */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="career-dept"
                  className="text-xs font-medium text-slate-600 shrink-0"
                >
                  Department:
                </label>
                <select
                  id="career-dept"
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="h-9 w-40 sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 cursor-pointer"
                >
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="career-loc"
                  className="text-xs font-medium text-slate-600 shrink-0"
                >
                  Location:
                </label>
                <select
                  id="career-loc"
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="h-9 w-40 sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 cursor-pointer"
                >
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  No matching jobs found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  We couldn&apos;t find any job openings matching your selected
                  filters. Try resetting the filters or submit a general
                  application on the right!
                </p>
                <button
                  onClick={() => {
                    setSelectedDepartment("All");
                    setSelectedLocation("All");
                  }}
                  className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600 shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* WhatsApp Quick Apply */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quick WhatsApp Apply
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directly message our talent team
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Prefer WhatsApp? Send your resume and contact details directly
                to our HR helpline.
              </p>

              <a
                href="https://wa.me/919512740405?text=I%20visited%20Tirupati%20Sales%20website.%20Hi%2C%20I%20would%20like%20to%20apply."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-98"
              >
                <MessageCircle className="h-4 w-4" />
                Send CV via WhatsApp
              </a>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                +91 95127 40405 (WhatsApp Only)
              </p>
            </div>

            {/* General Application Form Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  General Application
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Don&apos;t see your specific role? Send us your resume anyway!
                </p>
              </div>
              <GeneralApplicationForm />
            </div>

            {/* Email CV info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Mail className="h-4 w-4 text-orange-500" />
                Direct Email Inquiries
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                  <span className="font-medium text-slate-600">
                    HR Department:
                  </span>
                  <a
                    href="mailto:hr@tirupatisales.com"
                    className="font-bold text-orange-600 hover:underline"
                  >
                    hr@tirupatisales.com
                  </a>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                  <span className="font-medium text-slate-600">
                    Sales Careers:
                  </span>
                  <a
                    href="mailto:sales@tirupatisales.com"
                    className="font-bold text-orange-600 hover:underline"
                  >
                    sales@tirupatisales.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          onClose={() => {
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
