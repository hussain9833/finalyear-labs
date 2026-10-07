import type { DeviceType } from "@/lib/constants";

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|telegrambot|discordbot|headlesschrome|lighthouse|pingdom|uptime|curl|wget|python-requests|axios|node-fetch|go-http-client|httpclient|java\//i;

export function isBot(ua: string | null | undefined) {
  if (!ua) return true;
  return BOT_RE.test(ua);
}

export function deviceFromUA(ua: string | null | undefined, chMobile?: string | null): DeviceType {
  if (chMobile === "?1") return "mobile";
  if (!ua) return "unknown";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux|cros/i.test(ua)) return "desktop";
  return "unknown";
}
