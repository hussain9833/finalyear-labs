import { absoluteUrl, siteConfig } from "@/lib/site";
import type { FaqItem, ProjectDetail, ProjectSummary, TestimonialDTO } from "@/lib/types";

/* Schema.org builders. Never emit ratings/reviews unless real data exists. */

type Json = Record<string, unknown>;

export function organizationJsonLd(): Json {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.youtube].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/projects")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(items: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function itemListJsonLd(projects: ProjectSummary[], name: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: projects.length,
    itemListElement: projects.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/projects/${p.slug}`),
      name: p.name,
    })),
  };
}

/**
 * Product + Offer for a project. AggregateRating is only added when real, consented testimonials
 * with ratings exist for this project.
 */
export function projectJsonLd(p: ProjectDetail, testimonials: TestimonialDTO[] = []): Json {
  const images = [p.thumbnail?.url, ...p.screenshots.map((s) => s.url)].filter(Boolean).map((u) => absoluteUrl(u!));
  const rated = testimonials.filter((t) => typeof t.rating === "number");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/projects/${p.slug}#product`),
    name: p.name,
    description: p.shortDescription,
    url: absoluteUrl(`/projects/${p.slug}`),
    category: p.category.name,
    brand: { "@type": "Brand", name: siteConfig.name },
    image: images.length ? images : [absoluteUrl(`/projects/${p.slug}/opengraph-image`)],
    keywords: [...p.technologies, ...p.degrees.map((d) => `${d.name} project`)].join(", "),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/projects/${p.slug}`),
      priceCurrency: p.currency,
      price: p.priceFrom,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: p.currency,
        minPrice: p.priceFrom,
        price: p.priceFrom,
      },
      availability: "https://schema.org/InStock",
      seller: { "@id": absoluteUrl("/#organization") },
    },
    ...(rated.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (rated.reduce((s, t) => s + (t.rating ?? 0), 0) / rated.length).toFixed(1),
            reviewCount: rated.length,
          },
          review: rated.slice(0, 5).map((t) => ({
            "@type": "Review",
            author: { "@type": "Person", name: t.name },
            reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
            reviewBody: t.quote,
          })),
        }
      : {}),
  };
}

/** Only call when the FAQs are visibly rendered on the same page. */
export function faqJsonLd(faqs: FaqItem[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Serialises JSON-LD safely for inline <script> (prevents </script> breakouts). */
export function serializeJsonLd(data: Json | Json[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
