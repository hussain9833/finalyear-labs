import { getCatalog, getProjectDetail, resolveProjectsSlug } from "@/lib/data/catalog";
import { OG_SIZE, renderOgCard } from "@/lib/seo/og";
import { formatPrice } from "@/lib/utils";

export const alt = "Final year project preview";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const { projects, degrees, categories } = await getCatalog();
  const slugs = [...degrees, ...categories, ...projects].map((x) => x.slug);
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolveProjectsSlug(slug);

  if (resolved.kind === "project") {
    const p = await getProjectDetail(slug);
    if (p?.seo.ogImage) {
      // Admin-provided OG image overrides the generated card.
      const res = await fetch(p.seo.ogImage).catch(() => null);
      if (res?.ok) return new Response(res.body, { headers: { "content-type": res.headers.get("content-type") ?? "image/png" } });
    }
    if (p) {
      return renderOgCard({
        eyebrow: `${p.category.name} · from ${formatPrice(p.priceFrom)}`,
        title: p.name,
        subtitle: p.degrees.length ? `Final year project for ${p.degrees.map((d) => d.name).join(", ")}` : p.shortDescription,
        chips: p.technologies,
      });
    }
  }
  if (resolved.kind === "degree") {
    const { projects } = await getCatalog();
    const n = projects.filter((p) => p.degrees.some((d) => d.slug === slug)).length;
    return renderOgCard({
      eyebrow: resolved.degree.fullName,
      title: `${resolved.degree.name} Final Year Projects`,
      subtitle: n ? `${n} projects with source code, demos & documentation` : "Source code, demos & documentation support",
    });
  }
  if (resolved.kind === "category") {
    return renderOgCard({
      eyebrow: `Starting from ${formatPrice(resolved.category.priceFrom)}`,
      title: `${resolved.category.name} Projects`,
      subtitle: resolved.category.description,
      chips: resolved.category.examples,
    });
  }
  return renderOgCard({ eyebrow: "Final-year projects", title: "Your Final-Year Project Starts Here." });
}
