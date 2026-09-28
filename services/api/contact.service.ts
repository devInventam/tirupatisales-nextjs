import { STRAPI_URL } from "@/lib/constants";
import { InquiryData, InquiryResponse, StrapiSingleResponse } from "@/types";

export const contactService = {
  async submitInquiry(
    data: InquiryData,
    attachmentFile?: File,
    turnstileToken?: string
  ): Promise<{ success: boolean; data?: InquiryResponse; error?: string }> {
    try {
      let attachmentId: number | undefined;

      if (attachmentFile) {
        const formData = new FormData();
        formData.append("file", attachmentFile);

        const uploadResponse = await fetch(
          `${STRAPI_URL}/api/inquiries/upload-attachment`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json().catch(() => ({}));
          throw new Error(
            uploadError?.error?.message ||
              "Could not upload the attachment. Please check file size (<10MB) and format."
          );
        }

        const uploadResult = await uploadResponse.json();
        if (uploadResult.data && uploadResult.data[0]) {
          attachmentId = uploadResult.data[0].id;
        }
      }

      const payload: { data: Record<string, unknown> } = {
        data: {
          name: data.name,
          companyName: data.companyName,
          mobile: data.mobile,
          email: data.email,
          remark: data.remark || "",
          status: "New",
          turnstileToken,
        },
      };

      if (attachmentId) {
        payload.data.attachment = attachmentId;
      }

      const response = await fetch(`${STRAPI_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result: StrapiSingleResponse<InquiryResponse> = await response.json();
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit inquiry",
      };
    }
  },
};
