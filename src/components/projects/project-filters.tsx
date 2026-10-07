"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { trackEvent } from "@/lib/analytics/client";
import {
  SORTS,
  SORT_LABEL,
  activeFilterCount,
  filtersToSearchParams,
  type PriceBand,
  type ProjectFilters,
  type SortKey,
} from "@/lib/search/filters";
import type { Difficulty } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; count?: number };
export type FacetData = {
  categories: Option[];
  degrees: Option[];
  technologies: Option[];
  difficulties: Option[];
  prices: Option[];
};

type ListKey = "category" | "degree" | "tech" | "difficulty";

export function ProjectFiltersPanel({
  basePath,
  filters,
  facets,
  total,
}: {
  basePath: string;
  filters: ProjectFilters;
  facets: FacetData;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [q, setQ] = useState(filters.q ?? "");
  const count = activeFilterCount(filters);

  function navigate(next: Partial<ProjectFilters>) {
    const sp = filtersToSearchParams({ ...filters, ...next, page: 1 });
    const qs = sp.toString();
    startTransition(() => router.replace(`${pathname ?? basePath}${qs ? `?${qs}` : ""}`, { scroll: false }));
  }

  function toggle(key: ListKey, value: string) {
    const current = (filters[key] as string[] | undefined) ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    trackEvent("filter_used", { filter: key, value });
    navigate({ [key]: next } as Partial<ProjectFilters>);
  }

  function setSingle<K extends "price" | "ai" | "sort">(key: K, value: ProjectFilters[K] | undefined) {
    if (value) trackEvent("filter_used", { filter: key, value: String(value) });
    navigate({ [key]: value } as Partial<ProjectFilters>);
  }

  const groups = (
    <div className="grid gap-7">
      <FilterGroup title="Category" options={facets.categories} selected={filters.category ?? []} onToggle={(v) => toggle("category", v)} />
      <FilterGroup title="Degree" options={facets.degrees} selected={filters.degree ?? []} onToggle={(v) => toggle("degree", v)} chips />
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">AI</legend>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
          {[
            { v: undefined, l: "All" },
            { v: "yes" as const, l: "AI" },
            { v: "no" as const, l: "Non-AI" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              aria-pressed={filters.ai === o.v}
              onClick={() => setSingle("ai", o.v)}
              className={cn(
                "h-9 rounded-lg text-sm font-medium transition-colors",
                filters.ai === o.v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Budget</legend>
        <div className="grid gap-1">
          {facets.prices.map((p) => {
            const active = filters.price === p.value;
            return (
              <label key={p.value} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted">
                <input
                  type="radio"
                  name="price"
                  className="size-4 accent-[var(--primary)]"
                  checked={active}
                  onChange={() => setSingle("price", p.value as PriceBand)}
                  onClick={() => active && setSingle("price", undefined)}
                />
                {p.label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <FilterGroup title="Difficulty" options={facets.difficulties} selected={filters.difficulty ?? []} onToggle={(v) => toggle("difficulty", v as Difficulty)} />
      <FilterGroup title="Technology" options={facets.technologies} selected={filters.tech ?? []} onToggle={(v) => toggle("tech", v)} chips />
      <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="size-4 rounded accent-[var(--primary)]"
          checked={Boolean(filters.featured)}
          onChange={(e) => navigate({ featured: e.target.checked })}
        />
        Featured only
      </label>
    </div>
  );

  return (
    <>
      {/* Toolbar: search + sort + mobile filters (spans the full width above results on mobile) */}
      <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row lg:items-center">
        <form
          role="search"
          action={basePath}
          method="get"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ q: q.trim() || undefined });
          }}
          className="relative flex-1"
        >
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="project-search"
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search BCA, AI, e-commerce, Python projects…"
            className="h-12 w-full rounded-xl border border-input bg-background pr-24 pl-11 text-base outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            maxLength={80}
          />
          <button type="submit" className="absolute top-1.5 right-1.5 h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Search
          </button>
        </form>

        <div className="flex gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium lg:hidden">
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
              {count > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.7rem] text-primary-foreground">{count}</span>}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[88dvh] gap-0 rounded-t-3xl p-0">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-5 py-5">{groups}</div>
              <div className="grid grid-cols-2 gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => {
                    navigate({ category: [], degree: [], tech: [], difficulty: [], price: undefined, ai: undefined, featured: false });
                  }}
                  className="h-12 rounded-xl border border-border text-sm font-medium"
                >
                  Reset
                </button>
                <button type="button" onClick={() => setSheetOpen(false)} className="h-12 rounded-xl bg-primary text-sm font-medium text-primary-foreground">
                  {pending ? <Loader2 className="mx-auto size-4 animate-spin" aria-label="Updating" /> : `Show ${total} result${total === 1 ? "" : "s"}`}
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <label className="relative flex-1 lg:flex-none">
            <span className="sr-only">Sort by</span>
            <select
              value={filters.sort}
              onChange={(e) => setSingle("sort", e.target.value as SortKey)}
              className="h-12 w-full appearance-none rounded-xl border border-border bg-background pr-9 pl-4 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30 lg:w-52"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABEL[s]}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </label>
        </div>
      </div>

      {count > 0 && (
        <ActiveChips filters={filters} facets={facets} onRemove={navigate} className="lg:col-span-2" />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold">Filters</p>
            {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Updating results" />}
          </div>
          {groups}
        </div>
      </aside>
    </>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  chips = false,
}: {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  chips?: boolean;
}) {
  if (!options.length) return null;
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      {chips ? (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const active = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(o.value)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-1">
          {options.map((o) => (
            <label key={o.value} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted">
              <input
                type="checkbox"
                className="size-4 rounded accent-[var(--primary)]"
                checked={selected.includes(o.value)}
                onChange={() => onToggle(o.value)}
              />
              <span className="flex-1">{o.label}</span>
              {o.count !== undefined && <span className="text-xs text-muted-foreground">{o.count}</span>}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function ActiveChips({
  filters,
  facets,
  onRemove,
  className,
}: {
  filters: ProjectFilters;
  facets: FacetData;
  onRemove: (next: Partial<ProjectFilters>) => void;
  className?: string;
}) {
  const label = (opts: Option[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
  const chips: { key: string; text: string; remove: () => void }[] = [];
  const list = (k: ListKey, opts: Option[]) =>
    (filters[k] as string[] | undefined)?.forEach((v) =>
      chips.push({
        key: `${k}:${v}`,
        text: label(opts, v),
        remove: () => onRemove({ [k]: (filters[k] as string[]).filter((x) => x !== v) } as Partial<ProjectFilters>),
      }),
    );
  list("category", facets.categories);
  list("degree", facets.degrees);
  list("tech", facets.technologies);
  list("difficulty", facets.difficulties);
  if (filters.price) chips.push({ key: "price", text: label(facets.prices, filters.price), remove: () => onRemove({ price: undefined }) });
  if (filters.ai) chips.push({ key: "ai", text: filters.ai === "yes" ? "AI" : "Non-AI", remove: () => onRemove({ ai: undefined }) });
  if (filters.featured) chips.push({ key: "featured", text: "Featured", remove: () => onRemove({ featured: false }) });

  return (
    <ul className={cn("-mt-2 flex flex-wrap gap-2", className)} aria-label="Active filters">
      {chips.map((c) => (
        <li key={c.key}>
          <button
            type="button"
            onClick={c.remove}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-sm text-accent-foreground hover:bg-accent/70"
          >
            {c.text}
            <X className="size-3.5" aria-hidden />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
