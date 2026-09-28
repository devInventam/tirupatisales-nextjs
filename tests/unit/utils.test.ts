import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import { getStrapiMediaUrl } from "@/lib/media";
import { STRAPI_URL } from "@/lib/constants";

describe("Utils & Helpers", () => {
  it("cn merges class names properly with tailwind rules", () => {
    const result = cn("px-4 py-2", "px-6", { "bg-red-500": true, "bg-blue-500": false });
    expect(result).toBe("py-2 px-6 bg-red-500");
  });

  it("getStrapiMediaUrl returns full URL if relative path is provided", () => {
    const media = {
      id: 1,
      documentId: "1",
      name: "test.png",
      url: "/uploads/test.png",
    };
    const url = getStrapiMediaUrl(media);
    expect(url).toBe(`${STRAPI_URL}/uploads/test.png`);
  });

  it("getStrapiMediaUrl preserves absolute HTTP URLs", () => {
    const media = {
      id: 2,
      documentId: "2",
      name: "remote.png",
      url: "https://images.unsplash.com/photo-test",
    };
    const url = getStrapiMediaUrl(media);
    expect(url).toBe("https://images.unsplash.com/photo-test");
  });

  it("getStrapiMediaUrl returns empty string when media is null or undefined", () => {
    expect(getStrapiMediaUrl(null)).toBe("");
    expect(getStrapiMediaUrl(undefined)).toBe("");
  });
});
