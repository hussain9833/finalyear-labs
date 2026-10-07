import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return entries.map((e) => ({ ...e, lastModified: e.lastModified ? new Date(e.lastModified) : undefined }));
}
