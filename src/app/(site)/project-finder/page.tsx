import { Suspense } from "react";
import { getCatalog } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { getRecommender } from "@/lib/recommend/rule-based";
import { BUDGETS, type FinderAnswers } from "@/lib/recommend/types";
import { DIFFICULTIES } from "@/lib/constants";
import { technologyFacet } from "@/lib/search/filters";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProjectGridSkeleton } from "@/components/projects/project-grid";
import { FinderForm } from "@/components/finder/finder-form";
import { FinderResults } from "@/components/finder/finder-results";

export const metadata = buildMetadata({
  title: "Project Finder — Which Final Year Project Should I Choose?",
  description:
    "Not sure which final-year project to choose? Answer a few questions about your degree, budget, technology and AI preference to get matching project suggestions.",
  path: "/project-finder",
});

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

function parseAnswers(sp: SP): FinderAnswers {
  const pick = <T extends string>(v: string | undefined, allowed: readonly T[]) => (v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined);
  return {
    degree: one(sp.degree)?.slice(0, 40),
    category: one(sp.category)?.slice(0, 60),
    technology: one(sp.technology)?.slice(0, 40),
    budget: pick(one(sp.budget), BUDGETS.map((b) => b.key)),
    difficulty: pick(one(sp.difficulty), DIFFICULTIES),
    ai: pick(one(sp.ai), ["yes", "no", "either"] as const),
    year: pick(one(sp.year), ["final", "semi-final"] as const),
    platform: pick(one(sp.platform), ["web", "mobile", "either"] as const),
  };
}

export default function ProjectFinderPage({ searchParams }: PageProps<"/project-finder">) {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Project finder", path: "/project-finder" }]} />
      <header className="mt-6 mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Not sure which project to choose?</h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Tell us a little about yourself and what you&apos;re looking for. We&apos;ll suggest projects that match — and explain why.
        </p>
      </header>
      <Suspense fallback={<ProjectGridSkeleton count={3} />}>
        <Finder searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Finder({ searchParams }: { searchParams: Promise<SP> }) {
  const [sp, catalog] = await Promise.all([searchParams, getCatalog()]);
  const answers = parseAnswers(sp);
  const submitted = Object.values(answers).some(Boolean);
  const results = submitted ? getRecommender().recommend(answers, catalog.projects, 9) : [];
  const technologies = technologyFacet(catalog.projects).slice(0, 12).map((t) => t.label);

  return (
    <div className="grid gap-12 lg:grid-cols-[22rem_1fr]">
      <FinderForm
        answers={answers}
        degrees={catalog.degrees.map((d) => ({ value: d.slug, label: d.name }))}
        categories={catalog.categories.map((c) => ({ value: c.slug, label: c.name }))}
        technologies={technologies}
      />
      <FinderResults submitted={submitted} results={results} answers={answers} />
    </div>
  );
}
