import { StrapiMedia } from "@/types";
import { STRAPI_URL } from "./constants";

export function getStrapiMediaUrl(media: StrapiMedia | { url?: string } | string | null | undefined): string {
  if (!media) return "";
  if (typeof media === "string") {
    if (media.startsWith("http")) return media;
    return `${STRAPI_URL}${media.startsWith("/") ? "" : "/"}${media}`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = (media as StrapiMedia).url || (media as any).data?.attributes?.url;
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function getStrapiMediaThumbUrl(media: StrapiMedia | { formats?: unknown; url?: string } | null | undefined): string {
  if (!media) return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatUrl = (media as StrapiMedia).formats?.thumbnail?.url || (media as StrapiMedia).formats?.small?.url || (media as any)?.data?.attributes?.formats?.thumbnail?.url;
  if (!formatUrl) return getStrapiMediaUrl(media);
  if (formatUrl.startsWith("http")) return formatUrl;
  return `${STRAPI_URL}${formatUrl.startsWith("/") ? "" : "/"}${formatUrl}`;
}

