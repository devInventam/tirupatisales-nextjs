"use client";

import { useState, useMemo } from "react";
import BlogCard from "./BlogCard";
import FeaturedBlogCard from "./FeaturedBlogCard";
import { Blog } from "@/types";

interface BlogListClientProps {
  initialPosts: Blog[];
}

export default function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "news">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of initialPosts) {
      if (p.category?.trim()) set.add(p.category.trim());
    }
    return ["All", ...Array.from(set)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchTab =
        activeTab === "all" ||
        (post.type ? post.type.toLowerCase() === activeTab : activeTab === "blog");
      const matchCat =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchTab && matchCat;
    });
  }, [initialPosts, activeTab, selectedCategory]);

  const featuredPost = useMemo(() => {
    return filteredPosts.find(
      (p) => p.featured === true || String(p.featured) === "true" || (p.featured as any) === 1
    );
  }, [filteredPosts]);

  const remainingPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    const featuredId = featuredPost.documentId || featuredPost.slug || String(featuredPost.id);
    return filteredPosts.filter(
      (p) => (p.documentId || p.slug || String(p.id)) !== featuredId
    );
  }, [filteredPosts, featuredPost]);

  return (
    <div className="space-y-8">
      {/* Tab Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          {(["all", "blog", "news"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab === "all" ? "All Updates" : tab === "blog" ? "Blogs" : "News & PR"}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Blog Highlight (Top Banner) */}
      {featuredPost && <FeaturedBlogCard post={featuredPost} />}

      {/* Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-base font-semibold">No articles found in this category.</p>
        </div>
      ) : remainingPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <BlogCard key={post.slug || post.id} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
