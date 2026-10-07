import { Suspense } from "react";
import { getCatalog, projectsForDegree } from "@/lib/data/catalog";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import type { DegreeDTO } from "@/lib/types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ProjectGridSkeleton } from "@/components/projects/project-grid";
import { CtaBand } from "@/components/marketing/content-sections";
import { Faq } from "@/components/marketing/faq";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { HubContent, LinkPills } from "./hub-content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function DegreeHub({ degree, searchParams }: { degree: DegreeDTO; searchParams: SearchParams }) {
  const { projects, categories, degrees } = await getCatalog();
  const inDegree = projectsForDegree(projects, degree.slug);
  const categoryLinks = categories
    .map((c) => ({ c, n: inDegree.filter((p) => p.categories.some((x) => x.slug === c.slug)).length }))
    .filter((x) => x.n > 0)
    .map(({ c, n }) => ({ href: `/projects/${c.slug}`, label: `${c.shortName} projects`, meta: `${n} for ${degree.name}` }));
  const otherDegrees = degrees.filter((d) => d.slug !== degree.slug).map((d) => ({ href: `/projects/${d.slug}`, label: `${d.name} projects` }));

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }, { name: degree.name, path: `/projects/${degree.slug}` }]} />
      <JsonLd data={itemListJsonLd(inDegree, `${degree.name} final year projects`)} />

      <header className="mt-6 mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">{degree.fullName}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{degree.name} Final Year Projects</h1>
          {degree.content.intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{degree.content.intro}</p>}
        </div>
        <WhatsAppButton intent="general" cta="degree_page" degree={degree.slug} variant="outline" size="lg">
          Ask about {degree.name} projects
        </WhatsAppButton>
      </header>

      <div className="mb-10">
        <LinkPills title={`Browse ${degree.name} projects by category`} links={categoryLinks} />
      </div>

      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectExplorer searchParams={searchParams} basePath={`/projects/${degree.slug}`} lock={{ degree: degree.slug }} />
      </Suspense>

      <div className="mt-20 grid gap-20">
        <HubContent title={`A guide to ${degree.name} final-year projects`} sections={degree.content.sections} />
        {degree.faqs.length > 0 && (
          <section aria-labelledby="degree-faq" className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <h2 id="degree-faq" className="text-2xl font-semibold tracking-tight">
              {degree.name} project FAQs
            </h2>
            <Faq items={degree.faqs} />
          </section>
        )}
        <LinkPills title="Projects for other degrees" links={otherDegrees} />
        <CtaBand
          title={`Need a ${degree.name} project tailored to your syllabus?`}
          body="Share your university guidelines and preferred technology. We'll help you plan and build a project you understand."
          cta="degree_page"
          degree={degree.slug}
        />
      </div>
    </div>
  );
}
