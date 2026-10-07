import Link from "next/link";
import { Suspense } from "react";
import { Check, GitCompareArrows, Minus } from "lucide-react";
import { getCatalog, getProjectDetail } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { ProjectDetail } from "@/lib/types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { CompareSync } from "@/components/projects/compare-sync";
import { ProjectCover } from "@/components/projects/project-cover";

export const metadata = buildMetadata({
  title: "Compare Projects",
  description: "Compare final-year projects side by side — technologies, degrees, difficulty, features and price.",
  path: "/compare",
  noindex: true,
});

type Row = { label: string; render: (p: ProjectDetail) => React.ReactNode };

const yesNo = (v: boolean) =>
  v ? (
    <span className="inline-flex items-center gap-1.5 font-medium text-success">
      <Check className="size-4" aria-hidden /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Minus className="size-4" aria-hidden /> No
    </span>
  );

const ROWS: Row[] = [
  { label: "Category", render: (p) => p.categories.map((c) => c.name).join(", ") },
  { label: "Technologies", render: (p) => p.technologies.join(", ") },
  { label: "Degrees", render: (p) => p.degrees.map((d) => d.name).join(", ") || "—" },
  { label: "Difficulty", render: (p) => DIFFICULTY_LABEL[p.difficulty] },
  { label: "AI features", render: (p) => yesNo(p.isAI) },
  { label: "Admin panel", render: (p) => yesNo(p.hasAdminPanel) },
  { label: "Authentication", render: (p) => yesNo(p.hasAuth) },
  { label: "Documentation", render: (p) => yesNo(p.documentation.included) },
  { label: "Customization", render: (p) => yesNo(p.customization.available) },
  { label: "Starting price", render: (p) => <span className="text-base font-semibold">{formatPrice(p.priceFrom, p.currency)}</span> },
];

export default function ComparePage({ searchParams }: PageProps<"/compare">) {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }, { name: "Compare", path: "/compare" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Compare projects</h1>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted" />}>
        <Comparison searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Comparison({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.p) ? sp.p.join(",") : (sp.p ?? "");
  const slugs = [...new Set(raw.split(",").map((s) => s.trim().toLowerCase()).filter((s) => /^[a-z0-9-]{1,120}$/.test(s)))].slice(0, 3);
  const { projects: all } = await getCatalog();
  const projects = (await Promise.all(slugs.map((s) => getProjectDetail(s)))).filter((p): p is ProjectDetail => Boolean(p));

  if (projects.length < 2) {
    return (
      <>
        <CompareSync slugs={projects.map((p) => p.slug)} />
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <GitCompareArrows className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-lg font-semibold">Pick at least two projects to compare</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">Use the “Compare” button on any project card. You can compare up to three at a time.</p>
          <Link href="/projects" className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">
            Browse projects
          </Link>
          {all.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{all.length} projects available</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <CompareSync slugs={projects.map((p) => p.slug)} track />
      {/* Desktop / tablet: table with sticky first column */}
      <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <caption className="sr-only">Comparison of {projects.map((p) => p.name).join(", ")}</caption>
          <thead>
            <tr className="bg-muted/40">
              <th scope="col" className="sticky left-0 z-10 w-44 bg-muted/90 p-4 text-left font-medium text-muted-foreground backdrop-blur">
                Project
              </th>
              {projects.map((p) => (
                <th key={p.slug} scope="col" className="p-4 text-left align-top font-normal">
                  <div className="group overflow-hidden rounded-xl border border-border">
                    <ProjectCover project={p} sizes="320px" />
                  </div>
                  <Link href={`/projects/${p.slug}`} className="mt-3 block text-base font-semibold hover:text-primary">
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th scope="row" className="sticky left-0 z-10 bg-background/95 p-4 text-left font-medium text-muted-foreground backdrop-blur">
                  {row.label}
                </th>
                {projects.map((p) => (
                  <td key={p.slug} className="p-4 align-top">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <th scope="row" className="sticky left-0 z-10 bg-background/95 p-4" />
              {projects.map((p) => (
                <td key={p.slug} className="p-4">
                  <WhatsAppButton intent="project" cta="compare" project={p.slug} className="w-full">
                    Get this project
                  </WhatsAppButton>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked comparison cards */}
      <div className="mt-6 grid gap-5 md:hidden">
        {projects.map((p) => (
          <section key={p.slug} className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby={`cmp-${p.slug}`}>
            <div className="group">
              <ProjectCover project={p} sizes="100vw" />
            </div>
            <div className="p-5">
              <h2 id={`cmp-${p.slug}`} className="text-lg font-semibold">
                <Link href={`/projects/${p.slug}`}>{p.name}</Link>
              </h2>
              <dl className="mt-4 divide-y divide-border">
                {ROWS.map((row) => (
                  <div key={row.label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd>{row.render(p)}</dd>
                  </div>
                ))}
              </dl>
              <WhatsAppButton intent="project" cta="compare" project={p.slug} className="mt-4 w-full">
                Get this project
              </WhatsAppButton>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
