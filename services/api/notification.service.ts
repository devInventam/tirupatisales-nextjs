import { STRAPI_URL } from "@/lib/constants";
import { StrapiNotification, StrapiResponse } from "@/types";

export const notificationService = {
  async getNotifications(): Promise<StrapiNotification[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/notifications?populate=image&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=20`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StrapiResponse<StrapiNotification> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },
};
