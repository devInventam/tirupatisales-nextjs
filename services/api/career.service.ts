import { STRAPI_URL } from "@/lib/constants";
import {
  Job,
  JobApplicationData,
  JobApplicationResponse,
  JobType,
  StrapiResponse,
  StrapiSingleResponse,
} from "@/types";

interface RawJob {
  id: number;
  documentId: string;
  title: string;
  type: JobType;
  department: string;
  locationRelation?: { id: number; documentId: string; name: string } | null;
  blurb: string;
  description?: string;
  requirements?: string;
  salary?: string;
  isActive: boolean;
  applicationEmail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export const careerService = {
  async getJobs(): Promise<Job[]> {
    try {
      const params = new URLSearchParams({
        "populate[locationRelation][fields][0]": "name",
        "filters[isActive][$eq]": "true",
        sort: "createdAt:desc",
      });
      const res = await fetch(`${STRAPI_URL}/api/jobs?${params}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<RawJob> = await res.json();
      return json.data.map((job) => ({
        ...job,
        location: job.locationRelation?.name ?? "",
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  },

  async submitJobApplication(
    data: JobApplicationData,
    resumeFile?: File
  ): Promise<{ success: boolean; data?: JobApplicationResponse; error?: string }> {
    try {
      let resumeId: number | undefined;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        const uploadRes = await fetch(
          `${STRAPI_URL}/api/job-applications/upload-resume`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          if (uploadResult.data && uploadResult.data[0]) {
            resumeId = uploadResult.data[0].id;
          }
        } else {
          const uploadError = await uploadRes.json().catch(() => ({}));
          if (uploadRes.status >= 400 && uploadRes.status < 500) {
            throw new Error(
              uploadError?.error?.message ||
                "Could not upload your resume. Please check file size (<10MB) and format."
            );
          }
        }
      }

      const applicationPayload: { data: Record<string, unknown> } = {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          phone: data.phone,
          position: data.position,
          department: data.department,
          experience: data.experience || "Fresher",
          currentLocation: data.currentLocation,
          preferredLocation: data.preferredLocation || "",
          expectedSalary: data.expectedSalary,
          noticePeriod: data.noticePeriod || "Thirty Days",
          coverLetter: data.coverLetter,
          status: "New",
        },
      };

      if (resumeId) {
        applicationPayload.data.resume = resumeId;
      }

      if (data.jobId) {
        applicationPayload.data.job = data.jobId;
      }

      const res = await fetch(`${STRAPI_URL}/api/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error ${res.status}`);
      }

      const result: StrapiSingleResponse<JobApplicationResponse> = await res.json();
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error submitting job application:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit application",
      };
    }
  },
};
