import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Share2, Tag } from "lucide-react";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import HtmlFileContent from "@/components/blog/HtmlFileContent";
import BlogCard from "@/components/blog/BlogCard";
import { blogService } from "@/services/api";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const imageUrl = post.image?.url
    ? post.image.url.startsWith("http")
      ? post.image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${post.image.url}`
    : undefined;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    keywords: post.seoKeywords
      ? post.seoKeywords.split(",").map((k) => k.trim())
      : [post.title, post.category, "Tirupati Sales blog"],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const blogs = await blogService.getBlogs();
  return blogs.map((b) => ({
    slug: b.slug,
  }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, allBlogs] = await Promise.all([
    blogService.getBlogBySlug(slug),
    blogService.getBlogs(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allBlogs
    .filter((b) => b.slug !== post.slug)
    .slice(0, 3);

  const imageUrl = post.image?.url
    ? post.image.url.startsWith("http")
      ? post.image.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${post.image.url}`
    : null;

  const htmlUrl = post.htmlFileMedia?.url
    ? post.htmlFileMedia.url.startsWith("http")
      ? post.htmlFileMedia.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "https://admin.tirupatisales.com"}${post.htmlFileMedia.url}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || "Tirupati Sales Corporation",
    },
    publisher: {
      "@type": "Organization",
      name: "Tirupati Sales Corporation",
      logo: {
        "@type": "ImageObject",
        url: "https://tirupatisales.com/assets/company_logo/TSC_LOGO.webp",
      },
    },
    image: imageUrl || undefined,
  };

  return (
    <article className="min-h-screen bg-gray-50 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>

        {/* Article Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-10">
          {/* Tag & Meta Header */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200">
              <Tag className="w-3 h-3" /> {post.category || "General"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(post.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.readTime || 4} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author Strip */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {post.author || "Tirupati Editorial Team"}
                </p>
                <p className="text-xs text-gray-500">
                  Tirupati Sales Corporation
                </p>
              </div>
            </div>
          </div>

          {/* Main Cover Image */}
          {imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 bg-gray-100 shadow-inner">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* HTML Standalone Content (if uploaded via HTML file) */}
          {htmlUrl ? (
            <div className="my-8">
              <HtmlFileContent url={htmlUrl} />
            </div>
          ) : (
            /* Markdown Content */
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 leading-relaxed">
              <MarkdownRenderer content={post.content} />
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug || related.id} post={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
