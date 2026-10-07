/**
 * Creates (or resets) an owner account.
 *   ADMIN_BOOTSTRAP_EMAIL=you@example.com ADMIN_BOOTSTRAP_PASSWORD='long-password' npm run create-admin
 * Re-running for an existing email resets its password, re-activates it and revokes existing sessions.
 */
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models";
import { PASSWORD_MIN, hashPassword } from "@/lib/auth/password";

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || "Owner";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Set ADMIN_BOOTSTRAP_EMAIL to a valid email.");
  if (password.length < PASSWORD_MIN) throw new Error(`ADMIN_BOOTSTRAP_PASSWORD must be at least ${PASSWORD_MIN} characters.`);

  await connectDB();
  await Admin.syncIndexes();
  const passwordHash = await hashPassword(password);
  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "owner";
    existing.active = true;
    existing.failedLogins = 0;
    existing.lockedUntil = undefined;
    existing.sessionVersion = (existing.sessionVersion ?? 1) + 1;
    await existing.save();
    console.log(`✓ Reset owner ${email} (existing sessions revoked)`);
  } else {
    await Admin.create({ email, name, passwordHash, role: "owner" });
    console.log(`✓ Created owner ${email}`);
  }
  console.log("  Remove ADMIN_BOOTSTRAP_PASSWORD from your environment now.");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exit(1);
});
