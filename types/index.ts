// Base Strapi Types
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
  url: string;
}

// Company Info
export interface CompanyInfo {
  id: number;
  documentId: string;
  companyName: string;
  yearEstablished: number;
  heroTagline: string;
  marqueeText: string;
  productSegments: string;
  employeeCount: number;
  employeeCountDescription: string;
  brandsCount: number;
  brandsCountDescription: string;
  yearsExperience: number;
  yearsExperienceDescription: string;
  annualTurnover: number;
  annualTurnoverDescription: string;
  trustFactorsHeading: string;
  trustFactorsSubheading: string;
  seoKeywords?: string;
  happyClientsCount: number;
  happyClientsCountDescription: string;
  heroCarouselSpeedMs: number;
  clientCarouselSpeedMs: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Slides
export interface Slide {
  id: number;
  documentId: string;
  title: string;
  subtitle?: string;
  image: StrapiMedia;
  link?: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Brands & Clients
export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug?: string;
  logo?: StrapiMedia;
  website?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Client {
  id: number;
  documentId: string;
  name: string;
  logo?: StrapiMedia;
  description?: string;
  website?: string;
  testimonial?: string;
  contactPerson?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Jobs & Applications
export type JobType = 'Full Time' | 'Part Time' | 'Full Time / Part Time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Fresher' | 'Less than 1 Year' | 'One to Two Years' | 'Two to Five Years' | 'Five to Ten Years' | 'More than 10 Years';
export type NoticePeriod = 'Immediate' | 'Fifteen Days' | 'Thirty Days' | 'Sixty Days' | 'Ninety Days';
export type ApplicationStatus = 'New' | 'Reviewed' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';

export interface Job {
  id: number;
  documentId: string;
  title: string;
  type: JobType;
  department: string;
  location: string;
  blurb: string;
  description?: string;
  requirements?: string;
  salary?: string;
  isActive: boolean;
  applicationEmail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface JobApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department?: string;
  experience?: ExperienceLevel;
  currentLocation?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  noticePeriod?: NoticePeriod;
  coverLetter?: string;
  jobId?: number;
}

export interface JobApplicationResponse {
  id: number;
  documentId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone: string;
  position: string;
  department?: string;
  experience?: ExperienceLevel;
  currentLocation?: string;
  preferredLocation?: string;
  expectedSalary?: string;
  noticePeriod?: NoticePeriod;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// Contact Inquiry
export interface InquiryData {
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  remark?: string;
}

export interface InquiryResponse {
  id: number;
  documentId: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  remark?: string;
  status: 'New' | 'Reviewed' | 'Replied';
  createdAt: string;
}

// Blogs
export interface Blog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: StrapiMedia;
  author: string;
  date: string;
  category: string;
  featured: boolean;
  readTime: number;
  type: 'blog' | 'news';
  htmlFile?: string;
  htmlFileMedia?: StrapiMedia;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Gallery
export interface GalleryCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface GalleryAlbum {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: StrapiMedia;
  images?: StrapiMedia[];
  date?: string;
  category?: GalleryCategory | null;
  showName?: boolean;
  imagePrefix?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Technical Guides
export interface TechnicalGuide {
  id: number;
  documentId: string;
  name: string;
  path?: string;
  pdfFile?: StrapiMedia;
  videoUrl?: string;
  thumbnail?: StrapiMedia;
  category: string;
  description?: string;
  displayOrder: number;
}

// Notifications
export interface StrapiNotification {
  id: number;
  documentId: string;
  title: string;
  description: string;
  type: 'launch' | 'event' | 'training';
  date: string;
  image?: StrapiMedia | null;
  imageUrl?: string | null;
  link?: string | null;
  isActive: boolean;
  displayOrder: number;
  publishedAt: string;
}

// Infrastructure & About
export interface InfrastructureItem {
  id: number;
  documentId: string;
  title: string;
  description: string;
  icon?: StrapiMedia;
  displayOrder: number;
  isActive: boolean;
}

export interface CompanyValue {
  id: number;
  documentId: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface GroupCompany {
  id: number;
  documentId: string;
  name: string;
  since?: string;
  category: string;
  address: string;
  phone?: string[];
  email?: string[];
  website?: string;
  image?: StrapiMedia;
  imagePath?: string;
  displayOrder: number;
}

// Navigation & Categories
export interface NavParentCategory {
  id: string; // slug
  name: string;
  categories: { id: string; name: string }[];
}

export interface ProductCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  image?: StrapiMedia;
  displayOrder: number;
  isActive: boolean;
  description?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductSubcategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  brand?: string;
  externalUrl?: string;
  mainImagePath?: string;
  mainImage?: StrapiMedia | null;
  images?: StrapiMedia[] | null;
  shortDescription?: string;
  technicalData?: Array<{ key: string; value: string }> | null;
  application?: Array<{ value: string }> | null;
  properties?: Array<{ value: string }> | null;
  keyFeatures?: Array<{ value: string }> | null;
  pdfLinks?: Array<{ label?: string; url: string }> | null;
  subcategory?: ProductSubcategory & {
    parentCategory?: { name: string; slug: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  images: string[];
  pageUrl: string;
  title: string;
  description: string;
  specs: Record<string, string>;
  price: string;
  technicalData: Record<string, string>;
  application: string[];
  properties: string[];
  keyFeatures: string[];
  pdfLinks: string[];
  subcategorySlug: string;
}

export interface SearchProduct {
  id: string; // slug
  name: string;
  brand: string;
  image: string;
  parentSlug: string;
  subcategorySlug: string;
  parentName: string;
  subcategoryName: string;
}

export interface FooterData {
  tagline: string;
  address: string;
  phone1Label: string;
  phone1: string;
  phone2Label: string;
  phone2: string;
  landlineLabel: string;
  landline: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  copyrightText: string;
}
