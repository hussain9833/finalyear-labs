import "server-only";
import { cookies } from "next/headers";
import { isProd } from "@/lib/env";
import { ADMIN_COOKIE, SESSION_TTL_SEC, signSessionToken, type SessionPayload } from "./token";

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSessionToken(payload);
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd(),
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(ADMIN_COOKIE);
}
