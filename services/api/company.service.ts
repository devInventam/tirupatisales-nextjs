import { STRAPI_URL, defaultCompanyInfo, defaultFooterData } from "@/lib/constants";
import { CompanyInfo, CompanyValue, FooterData, InfrastructureItem, Slide, StrapiResponse, StrapiSingleResponse } from "@/types";

export const companyService = {
  async getCompanyInfo(): Promise<CompanyInfo> {
    try {
      const res = await fetch(`${STRAPI_URL}/api/company-info?populate=*`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiSingleResponse<CompanyInfo> = await res.json();
      return json.data || defaultCompanyInfo;
    } catch (error) {
      console.error("Error fetching company info:", error);
      return defaultCompanyInfo;
    }
  },

  async getSlides(): Promise<Slide[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/slides?populate=image&filters[isActive][$eq]=true&sort=order:asc`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<Slide> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching slides:", error);
      return [];
    }
  },

  async getFooter(): Promise<FooterData> {
    try {
      const res = await fetch(`${STRAPI_URL}/api/footer`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiSingleResponse<FooterData> = await res.json();
      return json.data || defaultFooterData;
    } catch (error) {
      console.error("Error fetching footer:", error);
      return defaultFooterData;
    }
  },

  async getCompanyValues(): Promise<CompanyValue[]> {
    try {
      const res = await fetch(`${STRAPI_URL}/api/company-values?sort=displayOrder:asc`, {
        next: { revalidate: 600 },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<CompanyValue> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching company values:", error);
      return [];
    }
  },

  async getInfrastructureItems(): Promise<InfrastructureItem[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/infrastructure-items?populate=icon&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=20`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<InfrastructureItem> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching infrastructure items:", error);
      return [];
    }
  },
};
