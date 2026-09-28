import { STRAPI_URL } from "@/lib/constants";

export const newsletterService = {
  async subscribe(
    email: string,
    turnstileToken?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { email, source: "footer", turnstileToken },
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${response.status}`);
      }
      return { success: true };
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Subscription failed",
      };
    }
  },
};
