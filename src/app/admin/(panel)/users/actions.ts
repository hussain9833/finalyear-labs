"use server";

import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/dal";
import { hashPassword } from "@/lib/auth/password";
import { adminUserSchema } from "@/lib/validation/admin";
import { toActionError, type ActionResult } from "@/lib/services/action-result";

export async function createAdminUser(payload: string): Promise<ActionResult> {
  try {
    await requireAdmin("users.manage");
    const input = adminUserSchema.parse(JSON.parse(payload));
    if (!input.password) return { ok: false, error: "Set an initial password (8+ characters).", fieldErrors: { password: "Required" } };
    await connectDB();
    await Admin.create({ email: input.email, name: input.name, role: input.role, passwordHash: await hashPassword(input.password) });
    return { ok: true, message: "Admin user created. Share the password securely and ask them to keep it private." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateAdminUser(id: string, patch: { role?: string; active?: boolean }): Promise<ActionResult> {
  try {
    const me = await requireAdmin("users.manage");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid user." };
    if (id === me.id) return { ok: false, error: "You can't change your own role or status." };
    const parsed = adminUserSchema.pick({ role: true }).partial().parse({ role: patch.role });
    await connectDB();
    const update: Record<string, unknown> = {};
    if (parsed.role) update.role = parsed.role;
    if (typeof patch.active === "boolean") update.active = patch.active;
    // Any change revokes existing sessions for that user.
    await Admin.updateOne({ _id: id }, { $set: update, $inc: { sessionVersion: 1 } });
    return { ok: true, message: "User updated." };
  } catch (error) {
    return toActionError(error);
  }
}
