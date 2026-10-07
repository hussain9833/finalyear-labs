import { getCatalog } from "@/lib/data/catalog";
import { getPopularSearches } from "@/lib/data/search";
import { SiteHeaderClient, type NavData } from "./site-header-client";

export async function SiteHeader() {
  const [{ categories, degrees, projects }, popular] = await Promise.all([getCatalog(), getPopularSearches()]);
  const nav: NavData = {
    categories: categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      accent: c.accent,
      priceFrom: c.priceFrom,
      description: c.description,
      count: projects.filter((p) => p.categories.some((x) => x.slug === c.slug)).length,
    })),
    degrees: degrees.map((d) => ({ slug: d.slug, name: d.name, fullName: d.fullName })),
    popular,
  };
  return <SiteHeaderClient nav={nav} />;
}
