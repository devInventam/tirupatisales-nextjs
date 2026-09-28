import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import { Blog } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: Blog;
}

export default function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.image?.url
    ? post.image.url.startsWith("http")
      ? post.image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${post.image.url}`
    : "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop";

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-red-600 bg-white/95 shadow-xs border border-red-100">
            {post.category || post.type || "Article"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.date)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime || 4} min read
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[150px]">
            <User className="w-3.5 h-3.5 text-gray-400" />
            {post.author || "Tirupati Sales"}
          </span>
          <span className="text-xs font-semibold text-red-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Read article <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
