import { STRAPI_URL } from "@/lib/constants";
import { getStrapiMediaUrl } from "@/lib/media";
import {
  Brand,
  Client,
  NavParentCategory,
  ProductCategory,
  ProductItem,
  ProductSubcategory,
  SearchProduct,
  StrapiProduct,
  StrapiResponse,
} from "@/types";

function strapiProductToLocal(p: StrapiProduct): ProductItem {
  let images: string[] = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images.map((m) => getStrapiMediaUrl(m)).filter(Boolean);
  }
  if (images.length === 0 && p.mainImage) {
    images = [getStrapiMediaUrl(p.mainImage)].filter(Boolean);
  }
  if (images.length === 0 && p.mainImagePath) {
    images = [p.mainImagePath];
  }

  const technicalData: Record<string, string> = {};
  for (const item of p.technicalData ?? []) {
    if (item.key) technicalData[item.key] = item.value ?? "";
  }

  return {
    id: p.slug,
    name: p.name,
    brand: p.brand ?? "",
    images,
    pageUrl: p.externalUrl ?? "",
    title: p.name,
    description: p.shortDescription ?? "",
    specs: {},
    price: "",
    technicalData,
    application: (p.application ?? []).map((a) => a.value).filter(Boolean),
    properties: (p.properties ?? []).map((a) => a.value).filter(Boolean),
    keyFeatures: (p.keyFeatures ?? []).map((a) => a.value).filter(Boolean),
    pdfLinks: (p.pdfLinks ?? []).map((a) => a.url).filter(Boolean),
    subcategorySlug: p.subcategory?.slug ?? "",
  };
}

export const productService = {
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/product-categories?populate=image&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=50`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<ProductCategory> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching product categories:", error);
      return [];
    }
  },

  async getNavMenuData(): Promise<NavParentCategory[]> {
    try {
      const [parentsRes, subsRes] = await Promise.all([
        fetch(
          `${STRAPI_URL}/api/product-categories?filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=100&fields[0]=name&fields[1]=slug&fields[2]=displayOrder`,
          { next: { revalidate: 600 } }
        ),
        fetch(
          `${STRAPI_URL}/api/product-subcategories?filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=500&fields[0]=name&fields[1]=slug&fields[2]=displayOrder&populate[parentCategory][fields][0]=slug`,
          { next: { revalidate: 600 } }
        ),
      ]);

      if (!parentsRes.ok || !subsRes.ok) throw new Error("Failed to fetch nav menu data");

      const parentsJson: StrapiResponse<{ name: string; slug: string; displayOrder: number }> =
        await parentsRes.json();
      const subsJson: StrapiResponse<{
        name: string;
        slug: string;
        displayOrder: number;
        parentCategory?: { slug: string };
      }> = await subsRes.json();

      const parentMap = new Map<string, NavParentCategory & { displayOrder: number }>();
      for (const p of parentsJson.data) {
        parentMap.set(p.slug, {
          id: p.slug,
          name: p.name,
          displayOrder: p.displayOrder ?? 0,
          categories: [],
        });
      }

      for (const sub of subsJson.data) {
        const parentSlug = sub.parentCategory?.slug;
        if (parentSlug && parentMap.has(parentSlug)) {
          parentMap.get(parentSlug)!.categories.push({ id: sub.slug, name: sub.name });
        }
      }

      return Array.from(parentMap.values())
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(({ id, name, categories }) => ({ id, name, categories }));
    } catch (error) {
      console.error("Error fetching nav menu data:", error);
      return [];
    }
  },

  async getSubcategories(parentSlug: string): Promise<ProductSubcategory[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/product-subcategories?filters[parentCategory][slug][$eq]=${encodeURIComponent(
          parentSlug
        )}&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=100`,
        { next: { revalidate: 600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<ProductSubcategory> = await res.json();
      return json.data ?? [];
    } catch (error) {
      console.error("Error fetching product subcategories:", error);
      return [];
    }
  },

  async getProductsByCategory(
    parentSlug: string,
    subcategorySlug?: string
  ): Promise<ProductItem[]> {
    try {
      let subUrl = `${STRAPI_URL}/api/product-subcategories?filters[parentCategory][slug][$eq]=${encodeURIComponent(
        parentSlug
      )}&pagination[pageSize]=100&fields[0]=id&fields[1]=documentId`;
      if (subcategorySlug) {
        subUrl += `&filters[slug][$eq]=${encodeURIComponent(subcategorySlug)}`;
      }
      const subRes = await fetch(subUrl, { next: { revalidate: 300 } });
      if (!subRes.ok) throw new Error(`HTTP ${subRes.status}`);
      const subJson: StrapiResponse<{ id: number; documentId: string }> = await subRes.json();

      if (!subJson.data?.length) return [];

      const params = new URLSearchParams({
        "pagination[pageSize]": "500",
        sort: "name:asc",
        "populate[mainImage][fields][0]": "url",
        "populate[mainImage][fields][1]": "formats",
        "populate[images][fields][0]": "url",
        "populate[images][fields][1]": "formats",
        "populate[technicalData]": "*",
        "populate[application]": "*",
        "populate[properties]": "*",
        "populate[keyFeatures]": "*",
        "populate[pdfLinks]": "*",
      });
      subJson.data.forEach((sub, i) => {
        params.append(`filters[subcategory][id][$in][${i}]`, String(sub.id));
      });

      const res = await fetch(`${STRAPI_URL}/api/products?${params}`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StrapiResponse<StrapiProduct> = await res.json();
      return (json.data ?? []).map(strapiProductToLocal);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async searchProducts(query: string): Promise<SearchProduct[]> {
    if (!query.trim()) return [];
    try {
      const params = new URLSearchParams({
        "filters[$or][0][name][$containsi]": query,
        "filters[$or][1][brand][$containsi]": query,
        "pagination[pageSize]": "10",
        "fields[0]": "name",
        "fields[1]": "brand",
        "fields[2]": "slug",
        "populate[mainImage][fields][0]": "url",
        "populate[subcategory][fields][0]": "slug",
        "populate[subcategory][fields][1]": "name",
        "populate[subcategory][populate][parentCategory][fields][0]": "slug",
        "populate[subcategory][populate][parentCategory][fields][1]": "name",
      });
      const res = await fetch(`${STRAPI_URL}/api/products?${params}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StrapiResponse<StrapiProduct> = await res.json();
      return (json.data ?? []).map((p) => ({
        id: p.slug,
        name: p.name,
        brand: p.brand ?? "",
        image: p.mainImage ? getStrapiMediaUrl(p.mainImage) : "",
        parentSlug: p.subcategory?.parentCategory?.slug ?? "",
        subcategorySlug: p.subcategory?.slug ?? "",
        parentName: p.subcategory?.parentCategory?.name ?? "",
        subcategoryName: p.subcategory?.name ?? "",
      }));
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  async getBrands(): Promise<Brand[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/brands?populate=logo&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=100`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<Brand> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  },

  async getClients(): Promise<Client[]> {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/clients?populate=logo&filters[isActive][$eq]=true&sort=order:asc`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: StrapiResponse<Client> = await res.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  },
};
