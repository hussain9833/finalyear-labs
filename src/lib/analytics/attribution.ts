/**
 * First-party attribution (UTM + external referrer + landing page). Written by proxy.ts on landing,
 * read server-side when recording events and leads. Contains no personal data.
 */
export const ATTR_COOKIE = "fyl_attr";
export const SESSION_COOKIE = "fyl_sid";
export const ATTR_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (last-touch window)
export const SESSION_MAX_AGE = 60 * 30; // 30 min sliding

export type Attribution = {
  s?: string; // utm_source
  m?: string; // utm_medium
  c?: string; // utm_campaign
  t?: string; // utm_term
  ct?: string; // utm_content
  ref?: string; // external referrer host
  lp?: string; // landing path
  ts?: number;
};

export type Utm = { source?: string; medium?: string; campaign?: string; term?: string; content?: string };

const UTM_KEYS = [
  ["utm_source", "s"],
  ["utm_medium", "m"],
  ["utm_campaign", "c"],
  ["utm_term", "t"],
  ["utm_content", "ct"],
] as const;

const cleanValue = (v: string | null, max = 100) =>
  v
    ? v
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 _.\-+/]/g, "")
        .slice(0, max) || undefined
    : undefined;

export function utmFromSearchParams(sp: URLSearchParams): Partial<Attribution> | null {
  const out: Partial<Attribution> = {};
  let found = false;
  for (const [param, key] of UTM_KEYS) {
    const v = cleanValue(sp.get(param), key === "s" || key === "m" ? 100 : 150);
    if (v) {
      out[key] = v;
      found = true;
    }
  }
  return found ? out : null;
}

export function referrerHost(referer: string | null, ownHost: string | null): string | undefined {
  if (!referer) return undefined;
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || (ownHost && host === ownHost.replace(/^www\./, "").split(":")[0])) return undefined;
    return host.slice(0, 120);
  } catch {
    return undefined;
  }
}

export function encodeAttribution(a: Attribution) {
  return encodeURIComponent(JSON.stringify(a));
}

export function decodeAttribution(raw: string | undefined): Attribution {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object") return {};
    const out: Attribution = {};
    for (const k of ["s", "m", "c", "t", "ct", "ref", "lp"] as const) {
      if (typeof parsed[k] === "string") out[k] = parsed[k].slice(0, 300);
    }
    if (typeof parsed.ts === "number") out.ts = parsed.ts;
    return out;
  } catch {
    return {};
  }
}

export function attributionToUtm(a: Attribution): Utm {
  return { source: a.s, medium: a.m, campaign: a.c, term: a.t, content: a.ct };
}

/** Traffic source label used by dashboards when no UTM source exists. */
export function trafficSource(a: Attribution): string {
  if (a.s) return a.s;
  if (a.ref) {
    if (/google\./.test(a.ref)) return "google (organic)";
    if (/bing\./.test(a.ref)) return "bing (organic)";
    if (/instagram\.com|l\.instagram/.test(a.ref)) return "instagram";
    if (/facebook\.com|fb\.me/.test(a.ref)) return "facebook";
    if (/youtube\.com|youtu\.be/.test(a.ref)) return "youtube";
    if (/t\.co|twitter\.com|x\.com/.test(a.ref)) return "x/twitter";
    if (/linkedin\.com|lnkd\.in/.test(a.ref)) return "linkedin";
    return a.ref;
  }
  return "direct";
}
