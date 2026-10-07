/**
 * Pure project filtering / search / sort. Runs over the cached catalog snapshot.
 * Shared by the /projects page, hub pages, /api/search and the project finder.
 */
import { DIFFICULTIES, type Difficulty } from "@/lib/constants";
import type { CategoryDTO, DegreeDTO, ProjectSummary } from "@/lib/types";

export const SORTS = ["recommended", "newest", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORTS)[number];
export const SORT_LABEL: Record<SortKey, string> = {
  recommended: "Recommended",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export const PRICE_BANDS = [
  { key: "under-5k", label: "Under ₹5,000", min: 0, max: 4999 },
  { key: "5k-10k", label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { key: "10k-20k", label: "₹10,000 – ₹20,000", min: 10001, max: 20000 },
  { key: "20k-plus", label: "₹20,000+", min: 20001, max: Number.POSITIVE_INFINITY },
] as const;
export type PriceBand = (typeof PRICE_BANDS)[number]["key"];

export type ProjectFilters = {
  q?: string;
  category?: string[];
  degree?: string[];
  tech?: string[];
  difficulty?: Difficulty[];
  price?: PriceBand;
  ai?: "yes" | "no";
  featured?: boolean;
  sort: SortKey;
  page: number;
};

export const PAGE_SIZE = 12;

type RawParams = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? v.split(",") : [])
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z0-9.+#-]{1,40}$/.test(s))
    .slice(0, 12);

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim();

export function parseFilters(params: RawParams): ProjectFilters {
  const sort = one(params.sort) as SortKey | undefined;
  const price = one(params.price) as PriceBand | undefined;
  const ai = one(params.ai);
  const page = Number.parseInt(one(params.page) ?? "1", 10);
  return {
    q: one(params.q)?.slice(0, 80) || undefined,
    category: list(params.category),
    degree: list(params.degree),
    tech: list(params.tech),
    difficulty: list(params.difficulty).filter((d): d is Difficulty => (DIFFICULTIES as readonly string[]).includes(d)),
    price: PRICE_BANDS.some((b) => b.key === price) ? price : undefined,
    ai: ai === "yes" || ai === "no" ? ai : undefined,
    featured: one(params.featured) === "1" || one(params.featured) === "true",
    sort: sort && (SORTS as readonly string[]).includes(sort) ? sort : "recommended",
    page: Number.isFinite(page) && page > 0 && page < 1000 ? page : 1,
  };
}

/** Serialises filters back to a query string (stable order, omits defaults). */
export function filtersToSearchParams(f: Partial<ProjectFilters>): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.category?.length) sp.set("category", f.category.join(","));
  if (f.degree?.length) sp.set("degree", f.degree.join(","));
  if (f.tech?.length) sp.set("tech", f.tech.join(","));
  if (f.difficulty?.length) sp.set("difficulty", f.difficulty.join(","));
  if (f.price) sp.set("price", f.price);
  if (f.ai) sp.set("ai", f.ai);
  if (f.featured) sp.set("featured", "1");
  if (f.sort && f.sort !== "recommended") sp.set("sort", f.sort);
  if (f.page && f.page > 1) sp.set("page", String(f.page));
  return sp;
}

export function activeFilterCount(f: ProjectFilters) {
  return (
    (f.category?.length ?? 0) +
    (f.degree?.length ?? 0) +
    (f.tech?.length ?? 0) +
    (f.difficulty?.length ?? 0) +
    (f.price ? 1 : 0) +
    (f.ai ? 1 : 0) +
    (f.featured ? 1 : 0)
  );
}

export const techSlug = (t: string) =>
  t
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.+#-]/g, "");

/* --------------------------------- Search -------------------------------- */

const STOP_WORDS = new Set([
  "project", "projects", "final", "year", "for", "with", "and", "the", "a", "an", "of", "in", "on",
  "source", "code", "students", "student", "ideas", "idea", "best", "semester", "mini", "major", "based", "using",
]);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[._]/g, "")
    .replace(/[^a-z0-9+#\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export type QueryIntent = { degrees: string[]; categories: string[]; ai: boolean; terms: string[] };

/**
 * Understands queries like "AI project for BCA", "MCA e-commerce project", "btech python".
 * Degree and category names/slugs in the query become structured matches; remaining words are free-text terms.
 */
export function parseQuery(q: string, degrees: DegreeDTO[], categories: CategoryDTO[]): QueryIntent {
  let text = ` ${normalize(q)} `;
  const found: QueryIntent = { degrees: [], categories: [], ai: false, terms: [] };

  for (const d of degrees) {
    const aliases = [d.slug, normalize(d.name), normalize(d.name).replace(/\s/g, "")];
    for (const a of new Set(aliases)) {
      if (a && text.includes(` ${a} `)) {
        found.degrees.push(d.slug);
        text = text.replace(` ${a} `, " ");
      }
    }
  }
  for (const c of categories) {
    const aliases = [c.slug, c.slug.replace(/-/g, " "), normalize(c.name), normalize(c.shortName)];
    for (const a of new Set(aliases)) {
      if (a && a.length > 1 && text.includes(` ${a} `)) {
        found.categories.push(c.slug);
        if (c.isAI) found.ai = true;
        text = text.replace(` ${a} `, " ");
      }
    }
  }
  if (/\s(ai|ml|genai|llm|artificial intelligence|machine learning)\s/.test(text)) found.ai = true;

  found.terms = text
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  found.degrees = [...new Set(found.degrees)];
  found.categories = [...new Set(found.categories)];
  return found;
}

function textScore(p: ProjectSummary, terms: string[]) {
  if (!terms.length) return 0;
  const name = normalize(p.name);
  const hay = normalize(
    [p.shortDescription, p.technologies.join(" "), p.tags.join(" "), p.category.name, p.categories.map((c) => c.name).join(" ")].join(" "),
  );
  let score = 0;
  for (const t of terms) {
    if (name.includes(t)) score += 10;
    else if (p.technologies.some((x) => normalize(x) === t)) score += 6;
    else if (hay.includes(t)) score += 3;
    else return -1; // every remaining term must match somewhere
  }
  return score;
}

export function applyFilters(
  projects: ProjectSummary[],
  f: ProjectFilters,
  ctx: { degrees: DegreeDTO[]; categories: CategoryDTO[] },
): ProjectSummary[] {
  const band = f.price ? PRICE_BANDS.find((b) => b.key === f.price) : undefined;
  const intent = f.q ? parseQuery(f.q, ctx.degrees, ctx.categories) : undefined;

  const scored: { p: ProjectSummary; score: number }[] = [];
  for (const p of projects) {
    if (f.category?.length && !p.categories.some((c) => f.category!.includes(c.slug))) continue;
    if (f.degree?.length && !p.degrees.some((d) => f.degree!.includes(d.slug))) continue;
    if (f.tech?.length && !p.technologies.some((t) => f.tech!.includes(techSlug(t)))) continue;
    if (f.difficulty?.length && !f.difficulty.includes(p.difficulty)) continue;
    if (band && (p.priceFrom < band.min || p.priceFrom > band.max)) continue;
    if (f.ai === "yes" && !p.isAI) continue;
    if (f.ai === "no" && p.isAI) continue;
    if (f.featured && !p.featured) continue;

    let score = 0;
    if (intent) {
      if (intent.degrees.length && !p.degrees.some((d) => intent.degrees.includes(d.slug))) continue;
      const inCategory = p.categories.some((c) => intent.categories.includes(c.slug));
      // "AI" queries also match AI-powered projects listed under other categories.
      if (intent.categories.length && !inCategory && !(intent.ai && p.isAI)) continue;
      if (intent.ai && !p.isAI && !inCategory) continue;
      const ts = textScore(p, intent.terms);
      if (ts < 0) continue;
      score = ts;
    }
    scored.push({ p, score });
  }

  const cmp: Record<SortKey, (a: (typeof scored)[number], b: (typeof scored)[number]) => number> = {
    recommended: (a, b) =>
      b.score - a.score ||
      Number(b.p.featured) - Number(a.p.featured) ||
      b.p.sortWeight - a.p.sortWeight ||
      b.p.createdAt.localeCompare(a.p.createdAt),
    newest: (a, b) => b.p.createdAt.localeCompare(a.p.createdAt),
    "price-asc": (a, b) => a.p.priceFrom - b.p.priceFrom,
    "price-desc": (a, b) => b.p.priceFrom - a.p.priceFrom,
  };
  return scored.sort(cmp[f.sort]).map((s) => s.p);
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, totalPages);
  return { items: items.slice(0, current * size), total: items.length, page: current, totalPages };
}

/** Technology facet with counts, most common first. */
export function technologyFacet(projects: ProjectSummary[]) {
  const counts = new Map<string, { label: string; count: number }>();
  for (const p of projects)
    for (const t of p.technologies) {
      const key = techSlug(t);
      const cur = counts.get(key);
      counts.set(key, { label: cur?.label ?? t, count: (cur?.count ?? 0) + 1 });
    }
  return [...counts.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Related projects: same degree + same category first, then shared technologies. */
export function relatedProjects(target: ProjectSummary, all: ProjectSummary[], limit = 3) {
  const degreeSet = new Set(target.degrees.map((d) => d.slug));
  const catSet = new Set(target.categories.map((c) => c.slug));
  const techSet = new Set(target.technologies.map(techSlug));
  return all
    .filter((p) => p.slug !== target.slug)
    .map((p) => {
      let s = 0;
      if (p.categories.some((c) => catSet.has(c.slug))) s += 5;
      s += p.degrees.filter((d) => degreeSet.has(d.slug)).length;
      s += p.technologies.filter((t) => techSet.has(techSlug(t))).length * 2;
      if (p.isAI === target.isAI) s += 1;
      return { p, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || Number(b.p.featured) - Number(a.p.featured))
    .slice(0, limit)
    .map((x) => x.p);
}
