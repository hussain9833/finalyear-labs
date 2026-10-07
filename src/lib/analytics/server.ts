import "server-only";
import { cookies, headers } from "next/headers";
import { connectDB, isDatabaseConfigured } from "@/lib/db/connect";
import { AnalyticsEvent, WhatsAppEvent } from "@/lib/db/models";
import { env } from "@/lib/env";
import type { DeviceType } from "@/lib/constants";
import type { CtaLocation, WhatsAppIntent, WhatsAppNumberType } from "@/lib/whatsapp/types";
import { ATTR_COOKIE, SESSION_COOKIE, attributionToUtm, decodeAttribution, type Attribution } from "./attribution";
import { deviceFromUA, isBot } from "./device";

export type RequestContext = {
  attribution: Attribution;
  sessionId?: string;
  deviceType: DeviceType;
  bot: boolean;
  userAgent: string;
};

/** Reads attribution/session cookies and device info for the current request. */
export async function getRequestContext(): Promise<RequestContext> {
  const [c, h] = await Promise.all([cookies(), headers()]);
  const ua = h.get("user-agent") ?? "";
  return {
    attribution: decodeAttribution(c.get(ATTR_COOKIE)?.value),
    sessionId: c.get(SESSION_COOKIE)?.value?.slice(0, 64),
    deviceType: deviceFromUA(ua, h.get("sec-ch-ua-mobile")),
    bot: isBot(ua),
    userAgent: ua,
  };
}

export type WhatsAppClickInput = {
  intent: WhatsAppIntent;
  numberType: WhatsAppNumberType;
  ctaLocation: CtaLocation;
  sourcePage?: string;
  projectId?: string;
  projectSlug?: string;
  projectName?: string;
  category?: string;
  degree?: string;
};

export async function recordWhatsAppClick(input: WhatsAppClickInput, ctx: RequestContext) {
  if (ctx.bot || !isDatabaseConfigured()) return;
  try {
    await connectDB();
    const { numberType, ...rest } = input;
    await WhatsAppEvent.create({
      ...rest,
      whatsappNumberType: numberType,
      deviceType: ctx.deviceType,
      referrer: ctx.attribution.ref,
      utm: attributionToUtm(ctx.attribution),
      sessionId: ctx.sessionId,
    });
  } catch (error) {
    console.error("[analytics] whatsapp click not recorded", error);
  }
}

export async function recordEvent(
  event: { name: string; props: Record<string, unknown>; path?: string },
  ctx: RequestContext,
) {
  if (ctx.bot || !isDatabaseConfigured()) return;
  try {
    await connectDB();
    const retentionDays = env().ANALYTICS_RETENTION_DAYS;
    await AnalyticsEvent.create({
      name: event.name,
      props: event.props,
      path: event.path,
      deviceType: ctx.deviceType,
      referrer: ctx.attribution.ref,
      utm: attributionToUtm(ctx.attribution),
      sessionId: ctx.sessionId,
      expiresAt: new Date(Date.now() + retentionDays * 86_400_000),
    });
  } catch (error) {
    console.error("[analytics] event not recorded", error);
  }
}
