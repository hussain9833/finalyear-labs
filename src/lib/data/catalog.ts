import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db/connect";
import { Category, Degree, Faq, Project, Testimonial } from "@/lib/db/models";
import type { FaqScope } from "@/lib/constants";
import type {
  Catalog,
  CategoryDTO,
  DegreeDTO,
  FaqItem,
  ProjectDetail,
  ProjectSummary,
  TestimonialDTO,
} from "@/lib/types";
import { mapCategory, mapDegree, mapProjectDetail, mapProjectSummary, mapTestimonial } from "./mappers";
import { TAGS } from "./tags";

/**
 * Public, cached read layer. Every function here:
 *  - is `'use cache'` with a lifetime + tags (invalidated by admin mutations)
 *  - returns plain DTOs only
 *  - only ever returns published content
 */

/** Without a database in local development we render empty states instead of crashing. */
async function ready(): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    if (process.env.NODE_ENV === "production") throw new Error("MONGODB_URI is required in production.");
    return false;
  }
  await connectDB();
  return true;
}

const SUMMARY_PROJECTION =
  "name slug shortDescription category categories degrees technologies tags priceFrom currency difficulty level platform isAI hasAdminPanel hasAuth documentation.included customization.available featured isSample sortWeight thumbnail demoUrl createdAt updatedAt";

async function loadLookups() {
  const [categories, degrees] = await Promise.all([
    Category.find({ published: true }).sort({ order: 1, name: 1 }).lean(),
    Degree.find({ published: true }).sort({ order: 1, name: 1 }).lean(),
  ]);
  const categoryDTOs = categories.map(mapCategory);
  const degreeDTOs = degrees.map(mapDegree);
  return {
    categoryDTOs,
    degreeDTOs,
    lookup: {
      categories: new Map(categoryDTOs.map((c) => [c.id, c])),
      degrees: new Map(degreeDTOs.map((d) => [d.id, d])),
    },
  };
}

function sortProjects(a: ProjectSummary, b: ProjectSummary) {
  return (
    Number(b.featured) - Number(a.featured) ||
    b.sortWeight - a.sortWeight ||
    b.createdAt.localeCompare(a.createdAt)
  );
}

/**
 * The whole published catalog in one cached call. The catalog is small (tens to low
 * hundreds of projects), so filtering/search runs in memory over this cached snapshot.
 * Switch `searchProjects` to the Mongo text index if the catalog grows past ~2k items.
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog, TAGS.projects, TAGS.categories, TAGS.degrees);

  if (!(await ready())) return { projects: [], categories: [], degrees: [] };

  const { categoryDTOs, degreeDTOs, lookup } = await loadLookups();
  const docs = await Project.find({ status: "published" }).select(SUMMARY_PROJECTION).lean();
  const projects = docs
    .map((d) => mapProjectSummary(d, lookup))
    .filter((p): p is ProjectSummary => Boolean(p))
    .sort(sortProjects);

  return { projects, categories: categoryDTOs, degrees: degreeDTOs };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  return (await getCatalog()).categories;
}

export async function getDegrees(): Promise<DegreeDTO[]> {
  return (await getCatalog()).degrees;
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog, TAGS.projects, TAGS.project(slug));

  if (!(await ready())) return null;
  const { lookup } = await loadLookups();
  const doc = await Project.findOne({ slug, status: "published" }).lean();
  return doc ? mapProjectDetail(doc, lookup) : null;
}

export type SlugResolution =
  | { kind: "degree"; degree: DegreeDTO }
  | { kind: "category"; category: CategoryDTO }
  | { kind: "project"; slug: string }
  | { kind: "none" };

/** Resolves the shared /projects/[slug] namespace: degree → category → project. */
export async function resolveProjectsSlug(slug: string): Promise<SlugResolution> {
  const catalog = await getCatalog();
  const degree = catalog.degrees.find((d) => d.slug === slug);
  if (degree) return { kind: "degree", degree };
  const category = catalog.categories.find((c) => c.slug === slug);
  if (category) return { kind: "category", category };
  if (catalog.projects.some((p) => p.slug === slug)) return { kind: "project", slug };
  return { kind: "none" };
}

export async function getTestimonials(projectSlug?: string): Promise<TestimonialDTO[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  if (!(await ready())) return [];
  // Only real testimonials the student consented to publish.
  const filter: Record<string, unknown> = { published: true, consent: true };
  if (projectSlug) filter.projectSlug = projectSlug;
  const docs = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).limit(12).lean();
  return docs.map(mapTestimonial);
}

export async function getFaqs(scope: FaqScope): Promise<FaqItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.faqs);

  if (!(await ready())) return [];
  const docs = await Faq.find({ scope, published: true }).sort({ order: 1, createdAt: 1 }).lean();
  return docs.map((d) => ({ question: d.question, answer: d.answer }));
}

/* ------------------------- Derived helpers (pure) ------------------------ */

export function projectsForDegree(projects: ProjectSummary[], degreeSlug: string) {
  return projects.filter((p) => p.degrees.some((d) => d.slug === degreeSlug));
}

export function projectsForCategory(projects: ProjectSummary[], categorySlug: string) {
  return projects.filter((p) => p.categories.some((c) => c.slug === categorySlug));
}
