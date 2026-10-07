import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { humanList, truncate } from "@/lib/utils";
import type { CategoryDTO, DegreeDTO, ProjectDetail, ProjectSummary } from "@/lib/types";

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

type BuildInput = {
  title: string;
  description: string;
  path: string;
  /** When true the title is used as-is (no "| Brand" template). */
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  canonical?: string;
  type?: "website" | "article";
  keywords?: string[];
};

/** Builds complete per-page metadata: canonical, Open Graph, Twitter, robots. */
export function buildMetadata(input: BuildInput): Metadata {
  const canonical = input.canonical ? absoluteUrl(input.canonical) : absoluteUrl(input.path);
  const description = truncate(input.description, DESCRIPTION_MAX);
  const ogTitle = input.absoluteTitle ? input.title : `${input.title} | ${siteConfig.name}`;
  const images = input.image ? [{ url: absoluteUrl(input.image), alt: input.imageAlt ?? input.title }] : undefined;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description,
    keywords: input.keywords?.length ? input.keywords : undefined,
    alternates: { canonical },
    openGraph: {
      type: input.type ?? "website",
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: ogTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    robots: input.noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

/* ----------------------------- Dynamic defaults ---------------------------- */

function degreePhrase(degrees: { name: string }[]) {
  if (!degrees.length) return "";
  if (degrees.length <= 2) return humanList(degrees.map((d) => d.name));
  return `${degrees
    .slice(0, 2)
    .map((d) => d.name)
    .join(", ")} & More`;
}

/** e.g. "AI Resume Analyzer Project for BCA & MCA | Final Year Project" — trimmed to fit. */
export function projectTitle(p: Pick<ProjectSummary, "name" | "degrees">) {
  const degrees = degreePhrase(p.degrees);
  const candidates = [
    degrees ? `${p.name} Project for ${degrees} | Final Year Project` : `${p.name} | Final Year Project`,
    degrees ? `${p.name} Project for ${p.degrees[0]!.name} | Final Year Project` : "",
    degrees ? `${p.name} – ${p.degrees[0]!.name} Final Year Project` : "",
    `${p.name} Final Year Project`,
    p.name,
  ].filter(Boolean);
  return candidates.find((c) => c.length <= TITLE_MAX) ?? truncate(p.name, TITLE_MAX);
}

export function projectDescription(p: ProjectDetail) {
  const stack = p.technologies.slice(0, 3).join(", ");
  const degrees = p.degrees.length ? ` for ${humanList(p.degrees.slice(0, 3).map((d) => d.name))} students` : "";
  const extras = [
    p.documentationIncluded ? "documentation resources" : "",
    p.customizationAvailable ? "customization" : "",
  ].filter(Boolean);
  const base = p.shortDescription.replace(/\.$/, "");
  const text = `${base}. Built with ${stack}${degrees}. Includes source code, setup guide${
    extras.length ? `, ${humanList(extras, "and")}` : ""
  }.`;
  return truncate(text, DESCRIPTION_MAX);
}

export function projectMetadata(p: ProjectDetail): Metadata {
  return buildMetadata({
    title: p.seo.title || projectTitle(p),
    absoluteTitle: true,
    description: p.seo.description || projectDescription(p),
    path: `/projects/${p.slug}`,
    canonical: p.seo.canonical,
    image: p.seo.ogImage, // falls back to opengraph-image.tsx when undefined
    noindex: p.seo.noindex,
    keywords: p.seo.keywords,
  });
}

export function degreeMetadata(d: DegreeDTO, projectCount: number): Metadata {
  return buildMetadata({
    title: d.seo.title || `${d.name} Final Year Projects with Source Code`,
    description:
      d.seo.description ||
      `Explore ${projectCount > 0 ? `${projectCount} ` : ""}${d.name} final-year and semester projects — web, AI, e-commerce and more — with source code, live demos, documentation resources and customization support.`,
    path: `/projects/${d.slug}`,
    image: d.seo.ogImage,
    noindex: d.seo.noindex,
  });
}

export function categoryMetadata(c: CategoryDTO, projectCount: number): Metadata {
  return buildMetadata({
    title: c.seo.title || `${c.name} Final Year Projects`,
    description:
      c.seo.description ||
      `${c.description || `${c.name} projects for technical students.`} ${
        projectCount > 0 ? `${projectCount} projects` : "Projects"
      } for BCA, MCA, B.Tech & more, starting from ₹${c.priceFrom.toLocaleString("en-IN")}.`,
    path: `/projects/${c.slug}`,
    image: c.seo.ogImage,
    noindex: c.seo.noindex,
  });
}
