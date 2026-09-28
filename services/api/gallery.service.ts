import { STRAPI_URL } from "@/lib/constants";
import { GalleryAlbum, StrapiResponse } from "@/types";

export const galleryService = {
  async getAlbums(): Promise<GalleryAlbum[]> {
    try {
      const params = new URLSearchParams({
        "populate[images][fields][0]": "url",
        "populate[images][fields][1]": "formats",
        "populate[coverImage][fields][0]": "url",
        "populate[category][fields][0]": "name",
        "populate[category][fields][1]": "slug",
        "populate[category][fields][2]": "displayOrder",
        "filters[isActive][$eq]": "true",
        sort: "order:asc",
        "pagination[pageSize]": "100",
      });
      const res = await fetch(`${STRAPI_URL}/api/gallery-albums?${params}`, {
        next: { revalidate: 600 },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<GalleryAlbum> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching gallery albums:", error);
      return [];
    }
  },
};
