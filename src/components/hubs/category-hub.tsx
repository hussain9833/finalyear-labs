import { Suspense } from "react";
import { getCatalog, projectsForCategory } from "@/lib/data/catalog";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { cn, formatPrice } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/types";
import { ACCENT_CLASSES, CategoryIcon } from "@/components/icon";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ProjectGridSkeleton } from "@/components/projects/project-grid";
import { CtaBand } from "@/components/marketing/content-sections";
import { Faq } from "@/components/marketing/faq";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { HubContent, LinkPills } from "./hub-content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function CategoryHub({ category, searchParams }: { category: CategoryDTO; searchParams: SearchParams }) {
  const { projects, degrees, categories } = await getCatalog();
  const inCategory = projectsForCategory(projects, category.slug);
  const accent = ACCENT_CLASSES[category.accent] ?? ACCENT_CLASSES.iris;
  const degreeLinks = degrees
    .map((d) => ({ d, n: inCategory.filter((p) => p.degrees.some((x) => x.slug === d.slug)).length }))
    .filter((x) => x.n > 0)
    .map(({ d, n }) => ({ href: `/projects/${d.slug}`, label: `${d.name} projects`, meta: `${n} ${category.shortName}` }));
  const otherCategories = categories
    .filter((c) => c.slug !== category.slug)
    .map((c) => ({ href: `/projects/${c.slug}`, label: c.name, meta: `from ${formatPrice(c.priceFrom)}` }));

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }, { name: category.name, path: `/projects/${category.slug}` }]} />
      <JsonLd data={itemListJsonLd(inCategory, `${category.name} final year projects`)} />

      <header className="mt-6 mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <span className={cn("inline-grid size-12 place-items-center rounded-2xl ring-1", accent.bg, accent.ring)}>
            <CategoryIcon name={category.icon} className={cn("size-6", accent.text)} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{category.name} Final Year Projects</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{category.content.intro || category.description}</p>
          <p className="mt-4 text-sm">
            Starting from <span className="text-lg font-semibold">{formatPrice(category.priceFrom, category.currency)}</span>
          </p>
          {category.examples.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Examples">
              {category.examples.map((e) => (
                <li key={e} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
        <WhatsAppButton intent="pricing" cta="category_page" category={category.slug} variant="outline" size="lg">
          Ask about {category.shortName} projects
        </WhatsAppButton>
      </header>

      <div className="mb-10">
        <LinkPills title={`${category.name} projects by degree`} links={degreeLinks} />
      </div>

      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectExplorer searchParams={searchParams} basePath={`/projects/${category.slug}`} lock={{ category: category.slug }} />
      </Suspense>

      <div className="mt-20 grid gap-20">
        <HubContent title={`About ${category.name.toLowerCase()} projects`} sections={category.content.sections} />
        {category.faqs.length > 0 && (
          <section aria-labelledby="category-faq" className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <h2 id="category-faq" className="text-2xl font-semibold tracking-tight">
              {category.name} FAQs
            </h2>
            <Faq items={category.faqs} />
          </section>
        )}
        <LinkPills title="Other categories" links={otherCategories} />
        <CtaBand cta="category_page" category={category.slug} />
      </div>
    </div>
  );
}
