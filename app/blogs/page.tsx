import type { Metadata } from "next";
import BlogListClient from "@/components/blog/BlogListClient";
import SectionTitle from "@/components/shared/SectionTitle";
import { blogService } from "@/services/api";

export const metadata: Metadata = {
  title: "Blogs & Industry Insights",
  description:
    "Read the latest articles, industry technical insights, product announcements, and electrical innovations from Tirupati Sales Corporation.",
  keywords: [
    "electrical industry blog",
    "switchgear technical guides",
    "automation trends India",
    "electrical engineering insights",
  ],
};

export default async function BlogsPage() {
  const posts = await blogService.getBlogs();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          badge="Knowledge Hub"
          title="Blogs & Industry Insights"
          subtitle="Stay updated with our latest articles, electrical engineering analyses, and product announcements."
        />

        <BlogListClient initialPosts={posts} />
      </div>
    </div>
  );
}
