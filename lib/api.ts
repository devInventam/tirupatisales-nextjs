import { STRAPI_URL } from "./constants";
import { getStrapiMediaUrl, getStrapiMediaThumbUrl } from "./media";
import { Brand, ProductCategory, StrapiResponse } from "@/types";

export { getStrapiMediaUrl, getStrapiMediaThumbUrl, STRAPI_URL };
export type { Brand, ProductCategory };

// Fetch active brands
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/brands?populate=logo&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=100`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: StrapiResponse<Brand> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

// Fetch active product categories
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/product-categories?populate=image&filters[isActive][$eq]=true&sort=displayOrder:asc&pagination[pageSize]=50`,
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: StrapiResponse<ProductCategory> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}

export const fetchCategories = fetchProductCategories;
