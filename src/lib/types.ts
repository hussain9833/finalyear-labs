/** Client-safe DTOs returned by the data layer. Plain JSON — safe across the cache/RSC boundary. */
import type { Accent, Difficulty, Platform, ProjectLevel } from "@/lib/constants";
import type { WhatsAppNumberType } from "@/lib/whatsapp/types";

export type Image = { url: string; alt: string; width?: number; height?: number; caption?: string };
export type FaqItem = { question: string; answer: string };
export type ContentSection = { heading: string; body: string };
export type Seo = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: boolean;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  description: string;
  priceFrom: number;
  currency: string;
  examples: string[];
  icon: string;
  accent: Accent;
  whatsappRoute: WhatsAppNumberType;
  isAI: boolean;
  order: number;
  seo: Seo;
  content: { intro?: string; sections: ContentSection[] };
  faqs: FaqItem[];
  updatedAt: string;
};

export type DegreeDTO = {
  id: string;
  name: string;
  slug: string;
  fullName: string;
  shortIntro: string;
  order: number;
  seo: Seo;
  content: { intro?: string; sections: ContentSection[] };
  faqs: FaqItem[];
  updatedAt: string;
};

export type Ref = { slug: string; name: string };
export type CategoryRef = Ref & { accent: Accent; icon: string; whatsappRoute: WhatsAppNumberType };

export type ProjectSummary = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: CategoryRef;
  categories: Ref[];
  degrees: Ref[];
  technologies: string[];
  tags: string[];
  priceFrom: number;
  currency: string;
  difficulty: Difficulty;
  level: ProjectLevel;
  platform: Platform;
  isAI: boolean;
  hasAdminPanel: boolean;
  hasAuth: boolean;
  documentationIncluded: boolean;
  customizationAvailable: boolean;
  featured: boolean;
  /** Seeded sample listing (development/review data) — shown with a visible badge. */
  isSample: boolean;
  sortWeight: number;
  thumbnail?: Image;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  description: string;
  features: { title: string; description: string }[];
  modules: { name: string; description: string; items: string[] }[];
  howItWorks: { title: string; description: string }[];
  whatYouGet: { title: string; description: string; included: boolean }[];
  documentation: { included: boolean; items: string[]; note?: string };
  customization: { available: boolean; options: string[]; note?: string };
  faqs: FaqItem[];
  screenshots: Image[];
  videoUrl?: string;
  repoUrl?: string;
  seo: Seo;
  publishedAt?: string;
};

export type TestimonialDTO = {
  id: string;
  name: string;
  degree?: string;
  college?: string;
  quote: string;
  rating?: number;
  projectSlug?: string;
  avatarUrl?: string;
};

export type Catalog = {
  projects: ProjectSummary[];
  categories: CategoryDTO[];
  degrees: DegreeDTO[];
};
