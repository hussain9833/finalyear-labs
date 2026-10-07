import type { CtaLocation, WhatsAppIntent } from "./types";

export type WaLinkParams = {
  intent: WhatsAppIntent;
  cta: CtaLocation;
  project?: string;
  category?: string;
  degree?: string;
  /** Pathname of the page the click happened on. */
  source?: string;
  /** Free-text requirements (custom intent only). Truncated server-side. */
  requirements?: string;
};

/**
 * Client-safe: builds the internal tracked redirect URL. The server resolves the number, logs the
 * click and redirects to wa.me. Never put phone numbers in client code.
 */
export function buildWaHref(p: WaLinkParams): string {
  const sp = new URLSearchParams({ i: p.intent, c: p.cta });
  if (p.project) sp.set("p", p.project);
  if (p.category) sp.set("cat", p.category);
  if (p.degree) sp.set("d", p.degree);
  if (p.source) sp.set("s", p.source.slice(0, 200));
  if (p.requirements) sp.set("r", p.requirements.slice(0, 500));
  return `/api/wa?${sp.toString()}`;
}
