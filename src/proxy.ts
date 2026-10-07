import { NextResponse, type NextRequest } from "next/server";
import {
  ATTR_COOKIE,
  ATTR_MAX_AGE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  decodeAttribution,
  encodeAttribution,
  referrerHost,
  utmFromSearchParams,
  type Attribution,
} from "@/lib/analytics/attribution";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth/token";

const secure = process.env.NODE_ENV === "production";

/**
 * 1. Admin gate (optimistic — authoritative checks happen in the data-access layer).
 * 2. First-party attribution: UTM / external referrer / landing page (last-touch, no PII).
 * 3. Anonymous session id for grouping events.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin")) return NextResponse.next();

  const response = NextResponse.next();

  const utm = utmFromSearchParams(searchParams);
  const ref = referrerHost(request.headers.get("referer"), request.nextUrl.host);
  const existing = request.cookies.get(ATTR_COOKIE)?.value;

  if (utm || (ref && !existing)) {
    const next: Attribution = utm
      ? { ...utm, ref, lp: pathname, ts: Date.now() }
      : { ...decodeAttribution(existing), ref, lp: pathname, ts: Date.now() };
    response.cookies.set(ATTR_COOKIE, encodeAttribution(next), {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: ATTR_MAX_AGE,
    });
  }

  const sid = request.cookies.get(SESSION_COOKIE)?.value ?? crypto.randomUUID().replace(/-/g, "");
  response.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}

export const config = {
  matcher: [
    // Pages only: skip API, Next internals, metadata files and static assets.
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|woff2?)$).*)",
  ],
};
