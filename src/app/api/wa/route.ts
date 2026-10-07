import { after, type NextRequest } from "next/server";
import { z } from "zod";
import { getCatalog } from "@/lib/data/catalog";
import { getRequestContext, recordWhatsAppClick } from "@/lib/analytics/server";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { getWhatsAppNumbers } from "@/lib/whatsapp/config";
import { resolveNumberType } from "@/lib/whatsapp/resolve";
import { buildMessage, buildWaMeUrl } from "@/lib/whatsapp/templates";
import { CTA_LOCATIONS, WHATSAPP_INTENTS } from "@/lib/whatsapp/types";
import { siteConfig } from "@/lib/site";

const slug = z.string().trim().max(120).regex(/^[a-z0-9-]+$/);

const querySchema = z.object({
  i: z.enum(WHATSAPP_INTENTS).catch("general"),
  c: z.enum(CTA_LOCATIONS).catch("hero"),
  p: slug.optional().catch(undefined),
  cat: slug.optional().catch(undefined),
  d: slug.optional().catch(undefined),
  s: z.string().max(200).startsWith("/").optional().catch(undefined),
  r: z.string().max(500).optional().catch(undefined),
});

const NO_STORE = { "Cache-Control": "no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow" };

/**
 * Tracked WhatsApp redirect. Every WhatsApp CTA links here; we resolve the right number server-side,
 * build the pre-filled message from trusted DB data, record the click context, then 302 to wa.me.
 */
export async function GET(request: NextRequest) {
  const fallback = new URL("/contact", request.url);
  if (!siteConfig.whatsappEnabled) return Response.redirect(fallback, 302);

  const q = querySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const catalog = await getCatalog();

  const project = q.p ? catalog.projects.find((p) => p.slug === q.p) : undefined;
  const category = project
    ? catalog.categories.find((c) => c.slug === project.category.slug)
    : q.cat
      ? catalog.categories.find((c) => c.slug === q.cat)
      : undefined;
  const degree = q.d ? catalog.degrees.find((d) => d.slug === q.d) : undefined;

  // Upgrade project intent to AI template for AI projects.
  let intent = q.i;
  if (project && (intent === "project" || intent === "ai_project")) intent = project.isAI ? "ai_project" : "project";
  if (!project && (intent === "project" || intent === "ai_project")) intent = "general";

  const target = resolveNumberType({ intent, categoryRoute: category?.whatsappRoute }, getWhatsAppNumbers());
  if (!target) return Response.redirect(fallback, 302);

  const message = buildMessage(intent, {
    projectName: project?.name,
    categoryName: category && !project ? category.name : undefined,
    degreeName: degree?.name,
    requirements: intent === "custom" ? q.r : undefined,
  });

  const ip = clientIp(request.headers);
  after(async () => {
    const limited = await rateLimit("wa", ip);
    if (!limited.ok) return; // still redirect the human; just don't inflate metrics
    const ctx = await getRequestContext();
    await recordWhatsAppClick(
      {
        intent,
        numberType: target.numberType,
        ctaLocation: q.c,
        sourcePage: q.s,
        projectId: project?.id,
        projectSlug: project?.slug,
        projectName: project?.name,
        category: category?.slug,
        degree: degree?.slug,
      },
      ctx,
    );
  });

  return new Response(null, {
    status: 302,
    headers: { Location: buildWaMeUrl(target.number, message), ...NO_STORE },
  });
}
