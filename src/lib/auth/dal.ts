import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models";
import type { AdminRole } from "@/lib/constants";
import { ADMIN_COOKIE, verifySessionToken } from "./token";
import { can, type Permission } from "./rbac";

export type AdminUser = { id: string; email: string; name: string; role: AdminRole };

/**
 * Authoritative session check (Data Access Layer). Verifies the JWT, then the account:
 * active, and sessionVersion unchanged (enables "sign out everywhere" / revocation).
 * Deduplicated per request with React.cache.
 */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session || !isValidObjectId(session.sub)) return null;

  await connectDB();
  const admin = await Admin.findById(session.sub).select("email name role active sessionVersion").lean();
  if (!admin || !admin.active || admin.sessionVersion !== session.sv) return null;
  return { id: String(admin._id), email: admin.email, name: admin.name ?? "", role: admin.role as AdminRole };
});

/** For pages: redirects to login when unauthenticated, to the dashboard when unauthorized. */
export async function requireAdminPage(permission: Permission = "dashboard.view"): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (!can(admin.role, permission)) redirect("/admin?denied=1");
  return admin;
}

export class AuthError extends Error {
  constructor(message = "You are not allowed to do that.") {
    super(message);
    this.name = "AuthError";
  }
}

/** For Server Actions / Route Handlers: throws instead of redirecting. */
export async function requireAdmin(permission: Permission): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new AuthError("Your session has expired. Please sign in again.");
  if (!can(admin.role, permission)) throw new AuthError();
  return admin;
}
