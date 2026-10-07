/**
 * Public, client-safe site configuration. Only NEXT_PUBLIC_* values belong here.
 * Server-only secrets live in `lib/env.ts`.
 */
function normalizeUrl(url: string | undefined) {
  const value = (url ?? "").trim() || "http://localhost:3000";
  return value.replace(/\/+$/, "");
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "FinalYear Labs",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  tagline: "Don't just download code. Build a project you can understand, customize and confidently present.",
  description:
    "Final-year and semester projects for BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech students — with source code, live demos, documentation resources, customization and direct WhatsApp support.",
  locale: "en_IN",
  whatsappEnabled: process.env.NEXT_PUBLIC_WHATSAPP_ENABLED !== "false",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL?.trim() || "",
  },
  /**
   * Business track record supplied by the owner (not derived from the database). Keep these accurate —
   * update via env as the numbers grow. Set a value to 0 to hide that stat.
   */
  trust: {
    projectsCompleted: Number(process.env.NEXT_PUBLIC_STATS_PROJECTS_COMPLETED ?? 100) || 0,
    studentsServed: Number(process.env.NEXT_PUBLIC_STATS_STUDENTS ?? 90) || 0,
    colleges: Number(process.env.NEXT_PUBLIC_STATS_COLLEGES ?? 30) || 0,
  },
  responsibleUse:
    "Use our projects as a learning, development and customization starting point. Understand the implementation, adapt it to your requirements and ensure your final submission follows your institution's academic policies.",
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
