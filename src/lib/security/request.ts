import "server-only";
import { createHash } from "node:crypto";
import { requireSecret } from "@/lib/env";
import { siteConfig } from "@/lib/site";

type HeaderBag = { get(name: string): string | null };

export function clientIp(h: HeaderBag): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

/** Salted hash — raw IP addresses are never stored. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(`${requireSecret("RATE_LIMIT_SALT")}:${value}`).digest("hex").slice(0, 40);
}

/** CSRF defence for POST route handlers: Origin (or Referer) must match our host. */
export function isSameOrigin(h: HeaderBag): boolean {
  const origin = h.get("origin") ?? h.get("referer");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) allowed.add(host);
  try {
    allowed.add(new URL(siteConfig.url).host);
  } catch {
    /* ignore */
  }
  return allowed.has(originHost);
}
