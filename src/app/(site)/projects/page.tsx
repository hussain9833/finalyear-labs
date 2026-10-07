import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ProjectGridSkeleton } from "@/components/projects/project-grid";
import { CtaBand } from "@/components/marketing/content-sections";

// Filter/search query params canonicalise to the clean /projects URL (no duplicate indexable variants).
export const metadata = buildMetadata({
  title: "Final Year Projects with Source Code & Documentation",
  description:
    "Browse final-year and semester projects for BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech. Filter by category, degree, technology, budget and difficulty — with live demos and WhatsApp support.",
  path: "/projects",
});

export default function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }]} />
      <header className="mt-6 mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Final-Year Projects</h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Web, AI, e-commerce and full-stack projects for technical students — with source code, demos, documentation
          resources and customization support.
        </p>
      </header>
      <Suspense fallback={<ExplorerFallback />}>
        <ProjectExplorer searchParams={searchParams} basePath="/projects" />
      </Suspense>
      <div className="mt-20">
        <CtaBand title="Didn't find the right project?" />
      </div>
    </div>
  );
}

function ExplorerFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <div className="h-12 rounded-xl bg-muted lg:col-span-2" />
      <div className="hidden space-y-4 lg:block">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <ProjectGridSkeleton />
    </div>
  );
}
