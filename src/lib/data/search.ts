import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db/connect";
import { AnalyticsEvent } from "@/lib/db/models";
import { getCatalog } from "./catalog";
import { TAGS } from "./tags";

/**
 * Popular searches: real top queries from the last 30 days (min. 3 searches each), topped up with
 * suggestions generated from the live catalog (degree × category combinations that have projects).
 */
export async function getPopularSearches(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog);

  const out: string[] = [];
  if (isDatabaseConfigured()) {
    try {
      await connectDB();
      const since = new Date(Date.now() - 30 * 86_400_000);
      const rows = await AnalyticsEvent.aggregate<{ _id: string; n: number }>([
        { $match: { name: "search", createdAt: { $gte: since }, "props.results": { $gt: 0 } } },
        { $group: { _id: { $toLower: "$props.query" }, n: { $sum: 1 } } },
        { $match: { n: { $gte: 3 } } },
        { $sort: { n: -1 } },
        { $limit: 8 },
      ]);
      out.push(...rows.map((r) => r._id).filter((q) => q && q.length <= 60));
    } catch {
      /* fall back to generated suggestions */
    }
  }

  const { categories, degrees, projects } = await getCatalog();
  for (const c of categories) {
    for (const d of degrees) {
      if (out.length >= 8) break;
      const has = projects.some((p) => p.categories.some((x) => x.slug === c.slug) && p.degrees.some((x) => x.slug === d.slug));
      const q = `${c.shortName} project for ${d.name}`;
      if (has && !out.some((o) => o.toLowerCase() === q.toLowerCase())) out.push(q);
      if (has) break; // one suggestion per category keeps variety
    }
  }
  for (const d of degrees) {
    if (out.length >= 8) break;
    out.push(`${d.name} final year project`);
  }
  return out.slice(0, 8);
}
