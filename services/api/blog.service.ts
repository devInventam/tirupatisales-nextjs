import { STRAPI_URL } from "@/lib/constants";
import { Blog, StrapiResponse } from "@/types";

export const blogService = {
  async getBlogs(): Promise<Blog[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/blogs?populate[image]=true&populate[htmlFileMedia]=true&sort=date:desc&pagination[pageSize]=50`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<Blog> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/blogs?filters[slug][$eq]=${encodeURIComponent(
          slug
        )}&populate[image]=true&populate[htmlFileMedia]=true`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<Blog> = await res.json();
      return json.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      return null;
    }
  },
};
