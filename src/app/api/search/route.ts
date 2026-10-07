import type { NextRequest } from "next/server";
import { getCatalog } from "@/lib/data/catalog";
import { applyFilters, parseFilters } from "@/lib/search/filters";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";

/** Typeahead suggestions for the search dialog. Public catalog data only. */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) ?? "";
  if (q.length < 2) return Response.json({ results: [] });

  if (!(await rateLimit("search", clientIp(request.headers))).ok) {
    return Response.json({ results: [], error: "rate_limited" }, { status: 429 });
  }

  const catalog = await getCatalog();
  const results = applyFilters(catalog.projects, parseFilters({ q }), catalog)
    .slice(0, 8)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category.name,
      priceFrom: p.priceFrom,
      isAI: p.isAI,
      degrees: p.degrees.map((d) => d.name),
    }));

  return Response.json({ results }, { headers: { "Cache-Control": "private, max-age=30" } });
}
