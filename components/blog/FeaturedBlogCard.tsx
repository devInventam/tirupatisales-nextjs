import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Blog } from "@/types";
import { formatDate } from "@/lib/utils";

interface FeaturedBlogCardProps {
  post: Blog;
}

export default function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const imageUrl = post.image?.url
    ? post.image.url.startsWith("http")
      ? post.image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${post.image.url}`
    : "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop";

  const badgeText = post.type
    ? post.type.toUpperCase()
    : post.category
    ? post.category.toUpperCase()
    : "NEWS";

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group relative block rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Column: Image */}
        <div className="relative w-full lg:w-1/2 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] bg-gray-50 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            priority
          />
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12 space-y-4">
          {/* Tag */}
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600">
              {badgeText}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 group-hover:text-red-600 transition-colors leading-snug sm:leading-tight">
            {post.title}
          </h2>

          {/* Subtitle / Excerpt */}
          {post.excerpt && (
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta & CTA */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
              <span>{formatDate(post.date)}</span>
              <span className="text-gray-300">|</span>
              <span>{post.readTime || 5} min read</span>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gray-950 group-hover:bg-red-600 transition-all duration-300 shadow-xs">
                Read full story
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
