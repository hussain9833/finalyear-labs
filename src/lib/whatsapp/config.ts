import "server-only";
import { env } from "@/lib/env";
import type { WhatsAppNumberType } from "./types";

/** Keeps digits only (wa.me requires the full international number without "+", spaces or dashes). */
export function normalizeNumber(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : undefined;
}

/** The only place WhatsApp numbers are read. Server-only — numbers never ship in client bundles. */
export function getWhatsAppNumbers(): Record<WhatsAppNumberType, string | undefined> {
  const e = env();
  return {
    default: normalizeNumber(e.WHATSAPP_DEFAULT_NUMBER),
    sales: normalizeNumber(e.WHATSAPP_SALES_NUMBER),
    ai: normalizeNumber(e.WHATSAPP_AI_NUMBER),
    web: normalizeNumber(e.WHATSAPP_WEB_NUMBER),
    ecommerce: normalizeNumber(e.WHATSAPP_ECOMMERCE_NUMBER),
    support: normalizeNumber(e.WHATSAPP_SUPPORT_NUMBER),
    custom: normalizeNumber(e.WHATSAPP_CUSTOM_NUMBER),
  };
}
