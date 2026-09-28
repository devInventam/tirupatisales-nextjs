import { STRAPI_URL } from "@/lib/constants";
import { GroupCompany, StrapiResponse, TechnicalGuide } from "@/types";

export const technicalGuideService = {
  async getTechnicalGuides(): Promise<TechnicalGuide[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/technical-guides?populate=pdfFile&populate=thumbnail&sort=displayOrder:asc&pagination[pageSize]=50`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<TechnicalGuide> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching technical guides:", error);
      return [];
    }
  },

  async getGroupCompanies(): Promise<GroupCompany[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/group-companies?populate=image&sort=displayOrder:asc&pagination[pageSize]=50`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<GroupCompany> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching group companies:", error);
      return [];
    }
  },
};
