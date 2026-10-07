import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

/** Public pages crawlable; admin, API and the noindex compare tool are disallowed. CSS/JS (/_next) stays crawlable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/compare"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
