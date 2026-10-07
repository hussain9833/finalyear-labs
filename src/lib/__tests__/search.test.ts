import { describe, expect, it } from "vitest";
import { applyFilters, filtersToSearchParams, paginate, parseFilters, parseQuery, relatedProjects } from "@/lib/search/filters";
import { ruleBasedRecommender } from "@/lib/recommend/rule-based";
import { categories, degrees, projects } from "./fixtures";

const ctx = { degrees, categories };
const run = (params: Record<string, string>) => applyFilters(projects, parseFilters(params), ctx).map((p) => p.slug);

describe("parseQuery", () => {
  it("extracts degree and category intent from natural queries", () => {
    expect(parseQuery("AI project for BCA", degrees, categories)).toMatchObject({ degrees: ["bca"], categories: ["ai"], ai: true });
    expect(parseQuery("MCA e-commerce project", degrees, categories)).toMatchObject({ degrees: ["mca"], categories: ["ecommerce"] });
    expect(parseQuery("BTech AI project", degrees, categories).degrees).toEqual(["btech"]);
    expect(parseQuery("B.Tech final year project", degrees, categories).degrees).toEqual(["btech"]);
    expect(parseQuery("bsc it project", degrees, categories).degrees).toEqual(["bsc-it"]);
  });
});

describe("applyFilters", () => {
  it("handles natural-language search", () => {
    expect(run({ q: "AI project for BCA" })).toEqual(["ai-resume-analyzer"]);
    // AI-powered projects in other categories still match "AI" queries.
    expect(run({ q: "AI project for MCA" }).sort()).toEqual(["ai-resume-analyzer", "smart-store"]);
    expect(run({ q: "php" })).toEqual(["student-management"]);
    expect(run({ q: "nonexistent-tech-xyz" })).toEqual([]);
  });
  it("filters by facets", () => {
    expect(run({ degree: "btech" })).toEqual(["smart-store"]);
    expect(run({ ai: "no" })).toEqual(["student-management"]);
    expect(run({ price: "20k-plus" })).toEqual(["smart-store"]);
    expect(run({ tech: "next.js" })).toEqual(["ai-resume-analyzer"]);
    expect(run({ difficulty: "advanced,beginner" }).sort()).toEqual(["smart-store", "student-management"]);
  });
  it("sorts", () => {
    expect(run({ sort: "price-asc" })).toEqual(["student-management", "ai-resume-analyzer", "smart-store"]);
    expect(run({ sort: "newest" })[0]).toBe("student-management");
    expect(run({})[0]).toBe("ai-resume-analyzer"); // featured first
  });
  it("rejects junk params safely", () => {
    const f = parseFilters({ sort: "drop table", price: "free", page: "-3", category: ["<script>", "ai"] });
    expect(f.sort).toBe("recommended");
    expect(f.price).toBeUndefined();
    expect(f.page).toBe(1);
    expect(f.category).toEqual(["ai"]);
  });
  it("round-trips filters through the query string", () => {
    const f = parseFilters({ q: "ai", category: "ai,ecommerce", sort: "newest", page: "2" });
    expect(parseFilters(Object.fromEntries(filtersToSearchParams(f)))).toEqual(f);
  });
});

describe("paginate", () => {
  it("returns cumulative pages", () => {
    const r = paginate([1, 2, 3, 4, 5], 2, 2);
    expect(r).toMatchObject({ items: [1, 2, 3, 4], total: 5, totalPages: 3, page: 2 });
  });
});

describe("relatedProjects", () => {
  it("prefers shared degrees, categories and technologies", () => {
    const related = relatedProjects(projects[0]!, projects, 2).map((p) => p.slug);
    expect(related).not.toContain("ai-resume-analyzer");
    expect(related.length).toBeLessThanOrEqual(2);
  });
});

describe("ruleBasedRecommender", () => {
  it("applies hard constraints and explains matches", () => {
    const recs = ruleBasedRecommender.recommend({ degree: "bca", ai: "yes", budget: "under-20k" }, projects);
    expect(recs[0]!.project.slug).toBe("ai-resume-analyzer");
    expect(recs[0]!.reasons).toContain("Includes AI features");
    expect(recs.every((r) => r.project.degrees.some((d) => d.slug === "bca"))).toBe(true);
    expect(recs.every((r) => r.project.priceFrom <= 20000)).toBe(true);
  });
});
