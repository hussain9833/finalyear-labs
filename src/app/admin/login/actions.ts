"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models";
import { verifyPassword } from "@/lib/auth/password";
import { clearSessionCookie, createSessionCookie } from "@/lib/auth/session";
import { getCurrentAdmin } from "@/lib/auth/dal";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { loginSchema } from "@/lib/validation/admin";
import type { AdminRole } from "@/lib/constants";

export type LoginState = { error?: string; email?: string };

const GENERIC = "Invalid email or password.";
const MAX_FAILURES = 10;
const LOCK_MINUTES = 30;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: GENERIC };
  const { email, password, next } = parsed.data;

  const ip = clientIp(await headers());
  const [byIp, byEmail] = await Promise.all([rateLimit("login", ip), rateLimit("loginEmail", email)]);
  if (!byIp.ok || !byEmail.ok) return { error: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };

  await connectDB();
  const admin = await Admin.findOne({ email }).select("+passwordHash role active sessionVersion failedLogins lockedUntil");

  // Always run bcrypt (dummy hash when the user doesn't exist) to keep timing uniform.
  const ok = await verifyPassword(password, admin?.passwordHash);

  if (!admin || !admin.active) return { error: GENERIC, email };
  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return { error: "This account is temporarily locked after repeated failed attempts. Try again later.", email };
  }
  if (!ok) {
    admin.failedLogins = (admin.failedLogins ?? 0) + 1;
    if (admin.failedLogins >= MAX_FAILURES) {
      admin.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
      admin.failedLogins = 0;
    }
    await admin.save();
    return { error: GENERIC, email };
  }

  admin.failedLogins = 0;
  admin.lockedUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  await createSessionCookie({ sub: String(admin._id), role: admin.role as AdminRole, sv: admin.sessionVersion ?? 1 });
  // Only allow internal admin paths as redirect targets (no open redirects).
  redirect(next && /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/** Revokes every session for the current admin (increments sessionVersion). */
export async function logoutEverywhereAction() {
  const admin = await getCurrentAdmin();
  if (admin) {
    await connectDB();
    await Admin.updateOne({ _id: admin.id }, { $inc: { sessionVersion: 1 } });
  }
  await clearSessionCookie();
  redirect("/admin/login");
}
