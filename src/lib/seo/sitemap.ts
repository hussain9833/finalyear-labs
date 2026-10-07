import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCatalog, getProjectDetail } from "@/lib/data/catalog";
import { getPublishedPosts } from "@/lib/data/blog";
import { TAGS } from "@/lib/data/tags";
import { absoluteUrl } from "@/lib/site";

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

export const STATIC_PAGES: { path: string; priority: number; changeFrequency: SitemapEntry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/projects", priority: 0.9, changeFrequency: "daily" },
  { path: "/project-finder", priority: 0.6, changeFrequency: "monthly" },
  { path: "/custom-project", priority: 0.7, changeFrequency: "monthly" },
  { path: "/documentation-support", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.4, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" },
];

/**
 * All indexable URLs. Excludes noindex pages, pages whose canonical points elsewhere,
 * admin/API routes and filter/query variants.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.catalog, TAGS.blog);

  const { projects, categories, degrees } = await getCatalog();
  const entries: SitemapEntry[] = STATIC_PAGES.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: p.changeFrequency, priority: p.priority }));

  for (const d of degrees) {
    if (d.seo.noindex) continue;
    entries.push({ url: absoluteUrl(`/projects/${d.slug}`), lastModified: d.updatedAt, changeFrequency: "weekly", priority: 0.85 });
  }
  for (const c of categories) {
    if (c.seo.noindex) continue;
    entries.push({ url: absoluteUrl(`/projects/${c.slug}`), lastModified: c.updatedAt, changeFrequency: "weekly", priority: 0.85 });
  }
  const details = await Promise.all(projects.map((p) => getProjectDetail(p.slug)));
  for (const p of details) {
    if (!p || p.seo.noindex) continue;
    if (p.seo.canonical && absoluteUrl(p.seo.canonical) !== absoluteUrl(`/projects/${p.slug}`)) continue;
    entries.push({ url: absoluteUrl(`/projects/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.8 });
  }

  const posts = await getPublishedPosts();
  if (posts.length) {
    entries.push({ url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 });
    for (const post of posts) {
      if (post.seo.noindex) continue;
      entries.push({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updatedAt, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  return entries;
}
