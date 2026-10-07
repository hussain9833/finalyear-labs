import Link from "next/link";
import { SearchX } from "lucide-react";
import { getCatalog } from "@/lib/data/catalog";
import {
  PRICE_BANDS,
  activeFilterCount,
  applyFilters,
  filtersToSearchParams,
  paginate,
  parseFilters,
  technologyFacet,
  type ProjectFilters,
} from "@/lib/search/filters";
import { DIFFICULTIES, DIFFICULTY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { ProjectGrid } from "./project-grid";
import { ProjectFiltersPanel, type FacetData } from "./project-filters";
import { SearchTracker } from "./search-tracker";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Search + filters + results for /projects and the degree/category hubs.
 * `lock` pins a facet (e.g. degree on /projects/bca) so it can't be removed from the hub page.
 */
export async function ProjectExplorer({
  searchParams,
  basePath,
  lock,
}: {
  searchParams: Promise<SearchParams>;
  basePath: string;
  lock?: { degree?: string; category?: string };
}) {
  const [params, catalog] = await Promise.all([searchParams, getCatalog()]);
  const filters = parseFilters(params);
  const effective: ProjectFilters = {
    ...filters,
    degree: lock?.degree ? [lock.degree] : filters.degree,
    category: lock?.category ? [lock.category] : filters.category,
  };

  const scope = catalog.projects.filter(
    (p) =>
      (!lock?.degree || p.degrees.some((d) => d.slug === lock.degree)) &&
      (!lock?.category || p.categories.some((c) => c.slug === lock.category)),
  );
  const results = applyFilters(catalog.projects, effective, catalog);
  const page = paginate(results, filters.page);

  const facets: FacetData = {
    categories: lock?.category ? [] : catalog.categories.map((c) => ({ value: c.slug, label: c.name })),
    degrees: lock?.degree ? [] : catalog.degrees.map((d) => ({ value: d.slug, label: d.name })),
    technologies: technologyFacet(scope)
      .slice(0, 14)
      .map((t) => ({ value: t.slug, label: t.label, count: t.count })),
    difficulties: DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] })),
    prices: PRICE_BANDS.map((b) => ({ value: b.key, label: b.label })),
  };

  const nextHref = (() => {
    const sp = filtersToSearchParams({ ...filters, page: page.page + 1 });
    return `${basePath}?${sp.toString()}`;
  })();
  const filtered = activeFilterCount(filters) > 0 || Boolean(filters.q);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <ProjectFiltersPanel basePath={basePath} filters={filters} facets={facets} total={results.length} />

      <div className="min-w-0">
        <SearchTracker query={filters.q} results={results.length} />
        <p className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
          {results.length === 0
            ? "No projects found"
            : `Showing ${page.items.length} of ${results.length} project${results.length === 1 ? "" : "s"}`}
          {filters.q && (
            <>
              {" "}
              for <span className="font-medium text-foreground">“{filters.q}”</span>
            </>
          )}
        </p>

        {results.length === 0 ? (
          <EmptyResults basePath={basePath} filtered={filtered} degree={lock?.degree} category={lock?.category} />
        ) : (
          <>
            <ProjectGrid projects={page.items} degree={lock?.degree} priorityFirst />
            {page.page < page.totalPages && (
              <div className="mt-10 flex justify-center">
                <Link href={nextHref} scroll={false} className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl px-8 text-base")}>
                  Load more projects
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyResults({ basePath, filtered, degree, category }: { basePath: string; filtered: boolean; degree?: string; category?: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted">
        <SearchX className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{filtered ? "No projects match these filters" : "Projects are coming soon"}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {filtered
          ? "Try removing a filter or searching for a technology like Python or React. We can also build a project around your exact requirements."
          : "We're adding projects here. Tell us what you need and we'll help you plan it."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {filtered && (
          <Link href={basePath} className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-5")}>
            Clear filters
          </Link>
        )}
        <Link href="/custom-project" className={cn(buttonVariants(), "h-11 rounded-xl px-5")}>
          Request a custom project
        </Link>
        <WhatsAppButton intent="general" cta={degree ? "degree_page" : category ? "category_page" : "cta_band"} degree={degree} category={category} variant="outline">
          Ask on WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
