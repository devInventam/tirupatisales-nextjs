"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Briefcase, Clock, Send, MessageCircle } from "lucide-react";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);

  const whatsappUrl = `https://wa.me/919512740405?text=${encodeURIComponent(
    `Hi, I visited Tirupati Sales website and I want to apply for the ${job.title} position.`
  )}`;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
            <Briefcase className="w-3 h-3" /> {job.department}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-100">
            <MapPin className="w-3 h-3 text-gray-400" /> {job.location || "Gujarat"}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-600 bg-blue-50">
            <Clock className="w-3 h-3" /> {job.type}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
          {job.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
          {job.blurb}
        </p>

        {/* Collapsible Requirements */}
        {(job.description || job.requirements) && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <span>{expanded ? "Hide Details & Requirements" : "View Requirements & Role"}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {expanded && (
              <div className="mt-3 text-xs text-gray-700 space-y-3 animate-in fade-in-0 duration-150">
                {job.description && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Role Overview:</h4>
                    <MarkdownRenderer content={job.description} />
                  </div>
                )}
                {job.requirements && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Requirements:</h4>
                    <MarkdownRenderer content={job.requirements} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onApply(job)}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Apply Now</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default JobCard;
