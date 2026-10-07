import "server-only";
import type { CategoryInput, DegreeInput } from "@/lib/validation/admin";

/* eslint-disable @typescript-eslint/no-explicit-any */
const seo = (s: any): CategoryInput["seo"] => ({
  title: s?.title ?? undefined,
  description: s?.description ?? undefined,
  keywords: s?.keywords ?? [],
  ogImage: s?.ogImage ?? undefined,
  canonical: s?.canonical ?? undefined,
  noindex: Boolean(s?.noindex),
  structuredData: s?.structuredData !== false,
});
const content = (c: any) => ({
  intro: c?.intro ?? undefined,
  sections: (c?.sections ?? []).map((s: any) => ({ heading: s.heading, body: s.body })),
});
const faqs = (f: any[] | undefined) => (f ?? []).map((x) => ({ question: x.question, answer: x.answer }));

export function toCategoryInput(d: any): CategoryInput {
  return {
    name: d.name,
    slug: d.slug,
    shortName: d.shortName ?? d.name,
    description: d.description ?? "",
    priceFrom: d.priceFrom ?? 0,
    examples: d.examples ?? [],
    icon: d.icon ?? "layers",
    accent: d.accent ?? "iris",
    whatsappRoute: d.whatsappRoute ?? "sales",
    isAI: Boolean(d.isAI),
    order: d.order ?? 0,
    published: d.published !== false,
    seo: seo(d.seo),
    content: content(d.content),
    faqs: faqs(d.faqs),
  };
}

export function toDegreeInput(d: any): DegreeInput {
  return {
    name: d.name,
    slug: d.slug,
    fullName: d.fullName ?? "",
    shortIntro: d.shortIntro ?? "",
    order: d.order ?? 0,
    published: d.published !== false,
    seo: seo(d.seo),
    content: content(d.content),
    faqs: faqs(d.faqs),
  };
}
