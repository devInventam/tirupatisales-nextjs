import { StrapiMedia } from "@/types";
import { STRAPI_URL } from "./constants";

export function getStrapiMediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media?.url) return "";
  if (media.url.startsWith("http")) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

export function getStrapiMediaThumbUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return "";
  const formatUrl = media.formats?.thumbnail?.url || media.formats?.small?.url;
  if (!formatUrl) return getStrapiMediaUrl(media);
  if (formatUrl.startsWith("http")) return formatUrl;
  return `${STRAPI_URL}${formatUrl}`;
}
