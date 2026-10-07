"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { ArrowRight, Clock, GraduationCap, Loader2, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { CategoryIcon } from "@/components/icon";
import { trackEvent } from "@/lib/analytics/client";
import { formatPrice } from "@/lib/utils";
import type { NavData } from "@/components/layout/site-header-client";

type Result = { slug: string; name: string; category: string; priceFrom: number; isAI: boolean; degrees: string[] };

const RECENT_KEY = "fyl_recent_searches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}
function saveRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

export function SearchDialog({
  open,
  onOpenChange,
  popular,
  categories,
  degrees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popular: string[];
  categories: NavData["categories"];
  degrees: NavData["degrees"];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{ q: string; results: Result[] } | null>(null);
  const [recent, setRecent] = useState<string[]>(readRecent);

  const q = query.trim();
  const active = q.length >= 2;
  // Derived: results belong to the current query only; "loading" until they arrive.
  const results = active && response?.q === q ? response.results : [];
  const loading = active && response?.q !== q;

  useEffect(() => {
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results: Result[] };
        setResponse({ q, results: data.results ?? [] });
      } catch {
        if (!ctrl.signal.aborted) setResponse({ q, results: [] });
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  function go(href: string, searchTerm?: string) {
    if (searchTerm) {
      saveRecent(searchTerm);
      setRecent(readRecent());
      trackEvent("search", { query: searchTerm.slice(0, 120), results: results.length });
    }
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  const runSearch = (term: string) => go(`/projects?q=${encodeURIComponent(term)}`, term);

  const suggestions = useMemo(() => categories.slice(0, 4), [categories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-3 w-[calc(100%-1.5rem)] max-w-2xl translate-y-0 gap-0 overflow-hidden rounded-2xl p-0 sm:top-[12vh]"
      >
        <DialogTitle className="sr-only">Search projects</DialogTitle>
        <DialogDescription className="sr-only">Search by degree, category, technology or project name.</DialogDescription>
        <CommandPrimitive shouldFilter={false} loop className="flex flex-col bg-popover text-popover-foreground">
          <div className="flex items-center gap-3 border-b border-border px-4">
            {loading ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-muted-foreground" aria-hidden />
            ) : (
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <CommandPrimitive.Input
              value={query}
              onValueChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q && !document.querySelector("[cmdk-item][data-selected=true][data-value^='project:']")) {
                  e.preventDefault();
                  runSearch(q);
                }
              }}
              placeholder="Search BCA, AI, e-commerce, Python projects…"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              aria-label="Search projects"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </div>

          <CommandList className="max-h-[min(65vh,28rem)] p-2">
            {active ? (
              <>
                {!loading && results.length === 0 && (
                  <CommandEmpty className="px-4 py-8 text-left">
                    <p className="font-medium">No projects match “{q}”.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try a degree (BCA, MCA), a category (AI, e-commerce) or a technology (Python, React). Or ask us for a
                      custom project.
                    </p>
                  </CommandEmpty>
                )}
                {results.length > 0 && (
                  <CommandGroup heading="Projects">
                    {results.map((r) => (
                      <CommandItem
                        key={r.slug}
                        value={`project:${r.slug}`}
                        onSelect={() => go(`/projects/${r.slug}`, q)}
                        className="gap-3 rounded-xl px-3 py-2.5"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                          {r.isAI ? <Sparkles className="size-4 text-primary" /> : <Search className="size-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{r.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {r.category} · {r.degrees.slice(0, 3).join(", ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">from {formatPrice(r.priceFrom)}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup>
                  <CommandItem value={`all:${q}`} onSelect={() => runSearch(q)} className="rounded-xl px-3 py-2.5">
                    <ArrowRight className="size-4" /> See all results for “{q}”
                  </CommandItem>
                  {results.length === 0 && !loading && (
                    <CommandItem value="custom" onSelect={() => go("/custom-project")} className="rounded-xl px-3 py-2.5">
                      <Sparkles className="size-4" /> Request a custom project
                    </CommandItem>
                  )}
                </CommandGroup>
              </>
            ) : (
              <>
                {recent.length > 0 && (
                  <CommandGroup heading="Recent searches">
                    {recent.map((r) => (
                      <CommandItem key={r} value={`recent:${r}`} onSelect={() => runSearch(r)} className="rounded-xl px-3 py-2">
                        <Clock className="size-4 text-muted-foreground" /> {r}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {popular.length > 0 && (
                  <CommandGroup heading="Popular searches">
                    {popular.map((p) => (
                      <CommandItem key={p} value={`popular:${p}`} onSelect={() => runSearch(p)} className="rounded-xl px-3 py-2">
                        <TrendingUp className="size-4 text-muted-foreground" /> {p}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup heading="Categories">
                  {suggestions.map((c) => (
                    <CommandItem key={c.slug} value={`cat:${c.slug}`} onSelect={() => go(`/projects/${c.slug}`)} className="rounded-xl px-3 py-2">
                      <CategoryIcon name={c.icon} className="size-4 text-muted-foreground" /> {c.name}
                      <span className="ml-auto text-xs text-muted-foreground">{c.count} projects</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Degrees">
                  <div className="flex flex-wrap gap-2 px-2 pb-2">
                    {degrees.map((d) => (
                      <CommandItem
                        key={d.slug}
                        value={`deg:${d.slug}`}
                        onSelect={() => go(`/projects/${d.slug}`)}
                        className="rounded-full border border-border px-3 py-1.5"
                      >
                        <GraduationCap className="size-3.5 text-muted-foreground" /> {d.name}
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
