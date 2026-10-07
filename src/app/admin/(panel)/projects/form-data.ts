import "server-only";
import { connectDB } from "@/lib/db/connect";
import { Category, Degree } from "@/lib/db/models";
import type { ProjectFormValues } from "@/components/admin/project-form";

export async function getFormOptions() {
  await connectDB();
  const [categories, degrees] = await Promise.all([
    Category.find().sort({ order: 1 }).select("name").lean(),
    Degree.find().sort({ order: 1 }).select("name").lean(),
  ]);
  return {
    categories: categories.map((c) => ({ value: String(c._id), label: c.name })),
    degrees: degrees.map((d) => ({ value: String(d._id), label: d.name })),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toFormValues(doc: any): ProjectFormValues {
  const ids = (a: any[] | undefined) => (a ?? []).map(String);
  const img = (i: any) => (i?.url ? { url: i.url, alt: i.alt ?? "", width: i.width ?? undefined, height: i.height ?? undefined, caption: i.caption ?? undefined } : undefined);
  return {
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription ?? "",
    description: doc.description ?? "",
    category: String(doc.category),
    categories: ids(doc.categories).filter((c) => c !== String(doc.category)),
    degrees: ids(doc.degrees),
    technologies: doc.technologies ?? [],
    tags: doc.tags ?? [],
    priceFrom: doc.priceFrom ?? 0,
    currency: "INR",
    difficulty: doc.difficulty,
    level: doc.level,
    platform: doc.platform,
    isAI: Boolean(doc.isAI),
    hasAdminPanel: Boolean(doc.hasAdminPanel),
    hasAuth: Boolean(doc.hasAuth),
    features: (doc.features ?? []).map((f: any) => ({ title: f.title, description: f.description ?? "" })),
    modules: (doc.modules ?? []).map((m: any) => ({ name: m.name, description: m.description ?? "", items: m.items ?? [] })),
    howItWorks: (doc.howItWorks ?? []).map((f: any) => ({ title: f.title, description: f.description ?? "" })),
    whatYouGet: (doc.whatYouGet ?? []).map((w: any) => ({ title: w.title, description: w.description ?? "", included: w.included !== false })),
    documentation: { included: doc.documentation?.included !== false, items: doc.documentation?.items ?? [], note: doc.documentation?.note ?? undefined },
    customization: { available: doc.customization?.available !== false, options: doc.customization?.options ?? [], note: doc.customization?.note ?? undefined },
    faqs: (doc.faqs ?? []).map((f: any) => ({ question: f.question, answer: f.answer })),
    thumbnail: img(doc.thumbnail),
    screenshots: (doc.screenshots ?? []).map(img).filter(Boolean),
    demoUrl: doc.demoUrl ?? undefined,
    videoUrl: doc.videoUrl ?? undefined,
    repoUrl: doc.repoUrl ?? undefined,
    showRepo: Boolean(doc.showRepo),
    featured: Boolean(doc.featured),
    status: doc.status,
    sortWeight: doc.sortWeight ?? 0,
    seo: {
      title: doc.seo?.title ?? undefined,
      description: doc.seo?.description ?? undefined,
      keywords: doc.seo?.keywords ?? [],
      ogImage: doc.seo?.ogImage ?? undefined,
      canonical: doc.seo?.canonical ?? undefined,
      noindex: Boolean(doc.seo?.noindex),
      structuredData: doc.seo?.structuredData !== false,
    },
  };
}
