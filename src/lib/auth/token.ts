import { SignJWT, jwtVerify } from "jose";
import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";

/** Shared by proxy.ts (optimistic check) and the DAL (authoritative check). No DB access here. */
export const ADMIN_COOKIE = "fyl_admin";
export const SESSION_TTL_SEC = 60 * 60 * 8; // 8 hours

export type SessionPayload = { sub: string; role: AdminRole; sv: number };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be at least 32 characters.");
    return new TextEncoder().encode("dev-only-insecure-AUTH_SECRET-change-me-0123456789abcdef");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role, sv: payload.sv })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .setAudience("fyl-admin")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"], audience: "fyl-admin" });
    const role = payload.role as AdminRole;
    if (!payload.sub || !ADMIN_ROLES.includes(role) || typeof payload.sv !== "number") return null;
    return { sub: payload.sub, role, sv: payload.sv };
  } catch {
    return null;
  }
}
