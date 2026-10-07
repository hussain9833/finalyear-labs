import { after } from "next/server";
import { parseEvent } from "@/lib/analytics/events";
import { getRequestContext, recordEvent } from "@/lib/analytics/server";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/security/request";

const MAX_BYTES = 4096;

/** First-party analytics beacon. Accepts only schema-valid events from our own origin. */
export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new Response(null, { status: 403 });

  const text = await request.text();
  if (text.length > MAX_BYTES) return new Response(null, { status: 413 });

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const event = parseEvent(json);
  if (!event) return new Response(null, { status: 422 });

  const ip = clientIp(request.headers);
  after(async () => {
    if (!(await rateLimit("events", ip)).ok) return;
    await recordEvent(event, await getRequestContext());
  });
  return new Response(null, { status: 204 });
}
