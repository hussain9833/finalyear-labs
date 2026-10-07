import "server-only";
import type { Types } from "mongoose";
import type {
  CategoryDTO,
  CategoryRef,
  DegreeDTO,
  Image,
  ProjectDetail,
  ProjectSummary,
  Ref,
  Seo,
  TestimonialDTO,
} from "@/lib/types";
import type { Accent, Difficulty, Platform, ProjectLevel } from "@/lib/constants";
import type { WhatsAppNumberType } from "@/lib/whatsapp/types";

/* eslint-disable @typescript-eslint/no-explicit-any -- lean() documents are untyped JSON-ish objects */
type Lean = Record<string, any>;

const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : typeof d === "string" ? d : new Date(0).toISOString());
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function mapSeo(seo: Lean | undefined): Seo {
  if (!seo) return {};
  return {
    title: seo.title || undefined,
    description: seo.description || undefined,
    keywords: arr<string>(seo.keywords),
    ogImage: seo.ogImage || undefined,
    canonical: seo.canonical || undefined,
    noindex: Boolean(seo.noindex),
    structuredData: seo.structuredData !== false,
  };
}

function mapImage(img: Lean | undefined): Image | undefined {
  if (!img?.url) return undefined;
  return {
    url: img.url,
    alt: str(img.alt),
    width: img.width ?? undefined,
    height: img.height ?? undefined,
    caption: img.caption || undefined,
  };
}

export function mapCategory(doc: Lean): CategoryDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    shortName: str(doc.shortName, doc.name),
    description: str(doc.description),
    priceFrom: doc.priceFrom ?? 0,
    currency: str(doc.currency, "INR"),
    examples: arr<string>(doc.examples),
    icon: str(doc.icon, "layers"),
    accent: (doc.accent ?? "iris") as Accent,
    whatsappRoute: (doc.whatsappRoute ?? "sales") as WhatsAppNumberType,
    isAI: Boolean(doc.isAI),
    order: doc.order ?? 0,
    seo: mapSeo(doc.seo),
    content: { intro: doc.content?.intro || undefined, sections: arr<Lean>(doc.content?.sections).map(pickSection) },
    faqs: arr<Lean>(doc.faqs).map((f) => ({ question: f.question, answer: f.answer })),
    updatedAt: iso(doc.updatedAt),
  };
}

export function mapDegree(doc: Lean): DegreeDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    fullName: str(doc.fullName),
    shortIntro: str(doc.shortIntro),
    order: doc.order ?? 0,
    seo: mapSeo(doc.seo),
    content: { intro: doc.content?.intro || undefined, sections: arr<Lean>(doc.content?.sections).map(pickSection) },
    faqs: arr<Lean>(doc.faqs).map((f) => ({ question: f.question, answer: f.answer })),
    updatedAt: iso(doc.updatedAt),
  };
}

function pickSection(s: Lean) {
  return { heading: s.heading, body: s.body };
}

type Lookup = {
  categories: Map<string, CategoryDTO>;
  degrees: Map<string, DegreeDTO>;
};

const toId = (v: Types.ObjectId | string | undefined | null) => (v ? String(v) : "");

export function mapProjectSummary(doc: Lean, lookup: Lookup): ProjectSummary | null {
  const primary = lookup.categories.get(toId(doc.category));
  if (!primary) return null; // category unpublished/missing → hide project from public listings
  const categoryRef: CategoryRef = {
    slug: primary.slug,
    name: primary.name,
    accent: primary.accent,
    icon: primary.icon,
    whatsappRoute: primary.whatsappRoute,
  };
  const categories: Ref[] = arr<Types.ObjectId>(doc.categories)
    .map((id) => lookup.categories.get(toId(id)))
    .filter((c): c is CategoryDTO => Boolean(c))
    .map((c) => ({ slug: c.slug, name: c.name }));
  if (!categories.some((c) => c.slug === primary.slug)) categories.unshift({ slug: primary.slug, name: primary.name });

  const degrees: Ref[] = arr<Types.ObjectId>(doc.degrees)
    .map((id) => lookup.degrees.get(toId(id)))
    .filter((d): d is DegreeDTO => Boolean(d))
    .sort((a, b) => a.order - b.order)
    .map((d) => ({ slug: d.slug, name: d.name }));

  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    shortDescription: str(doc.shortDescription),
    category: categoryRef,
    categories,
    degrees,
    technologies: arr<string>(doc.technologies),
    tags: arr<string>(doc.tags),
    priceFrom: doc.priceFrom ?? 0,
    currency: str(doc.currency, "INR"),
    difficulty: (doc.difficulty ?? "intermediate") as Difficulty,
    level: (doc.level ?? "both") as ProjectLevel,
    platform: (doc.platform ?? "web") as Platform,
    isAI: Boolean(doc.isAI),
    hasAdminPanel: Boolean(doc.hasAdminPanel),
    hasAuth: Boolean(doc.hasAuth),
    documentationIncluded: doc.documentation?.included !== false,
    customizationAvailable: doc.customization?.available !== false,
    featured: Boolean(doc.featured),
    isSample: Boolean(doc.isSample),
    sortWeight: doc.sortWeight ?? 0,
    thumbnail: mapImage(doc.thumbnail),
    demoUrl: doc.demoUrl || undefined,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

export function mapProjectDetail(doc: Lean, lookup: Lookup): ProjectDetail | null {
  const summary = mapProjectSummary(doc, lookup);
  if (!summary) return null;
  return {
    ...summary,
    description: str(doc.description),
    features: arr<Lean>(doc.features).map((f) => ({ title: f.title, description: str(f.description) })),
    modules: arr<Lean>(doc.modules).map((m) => ({
      name: m.name,
      description: str(m.description),
      items: arr<string>(m.items),
    })),
    howItWorks: arr<Lean>(doc.howItWorks).map((s) => ({ title: s.title, description: str(s.description) })),
    whatYouGet: arr<Lean>(doc.whatYouGet).map((w) => ({
      title: w.title,
      description: str(w.description),
      included: w.included !== false,
    })),
    documentation: {
      included: doc.documentation?.included !== false,
      items: arr<string>(doc.documentation?.items),
      note: doc.documentation?.note || undefined,
    },
    customization: {
      available: doc.customization?.available !== false,
      options: arr<string>(doc.customization?.options),
      note: doc.customization?.note || undefined,
    },
    faqs: arr<Lean>(doc.faqs).map((f) => ({ question: f.question, answer: f.answer })),
    screenshots: arr<Lean>(doc.screenshots)
      .map(mapImage)
      .filter((i): i is Image => Boolean(i)),
    videoUrl: doc.videoUrl || undefined,
    // Private repository links are never exposed unless explicitly enabled.
    repoUrl: doc.showRepo && doc.repoUrl ? doc.repoUrl : undefined,
    seo: mapSeo(doc.seo),
    publishedAt: doc.publishedAt ? iso(doc.publishedAt) : undefined,
  };
}

export function mapTestimonial(doc: Lean): TestimonialDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    degree: doc.degree || undefined,
    college: doc.college || undefined,
    quote: doc.quote,
    rating: doc.rating ?? undefined,
    projectSlug: doc.projectSlug || undefined,
    avatarUrl: doc.avatarUrl || undefined,
  };
}
