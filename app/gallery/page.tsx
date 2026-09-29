import { Metadata } from "next";
import { galleryService } from "@/services/api/gallery.service";
import { GalleryViewer, GalleryItem } from "@/components/gallery/GalleryViewer";
import { getStrapiMediaUrl } from "@/lib/media";
import { Images, Sparkles } from "lucide-react";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Photo Gallery | Tirupati Sales Corporation",
  description:
    "Explore photo moments from Tirupati Sales Corporation's office premises, Hazira warehouse, team activities, and client events.",
  keywords: [
    "tirupati sales gallery",
    "electrical warehouse surat",
    "company infrastructure photos",
    "switchgear distribution center",
  ],
  openGraph: {
    title: "Life at Tirupati Sales Corporation - Gallery",
    description:
      "A visual tour across our headquarters, modern warehousing, and corporate events.",
    type: "website",
  },
};

export default async function GalleryPage() {
  const albums = await galleryService.getAlbums();

  const allImages: GalleryItem[] = [];
  const flatCounter: Record<string, number> = {};

  albums.forEach((album) => {
    const section = album.category?.name ?? "Other";
    const showName = album.showName !== false;
    const subSection = showName ? album.name : "";
    const prefix = album.imagePrefix || album.name;

    if (album.images && album.images.length > 0) {
      album.images.forEach((image) => {
        let imgNum: number;
        if (showName) {
          imgNum =
            allImages.filter(
              (i) => i.subSection === subSection && i.section === section,
            ).length + 1;
        } else {
          flatCounter[section] = (flatCounter[section] ?? 0) + 1;
          imgNum = flatCounter[section];
        }

        allImages.push({
          id: `${album.id}-${image.id}`,
          name: `${prefix} ${imgNum}`,
          img: getStrapiMediaUrl(image),
          thumb: getStrapiMediaUrl(image),
          category: section,
          section: section,
          subSection: subSection,
          year: album.date
            ? new Date(album.date).getFullYear().toString()
            : "2024",
        });
      });
    }
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Life at Tirupati Sales Corporation
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Take a visual tour through our smart corporate offices. logistics
              hub in Hazira, engineering activities, and celebratory gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Viewer */}
      <GalleryViewer images={allImages} />
    </main>
  );
}
