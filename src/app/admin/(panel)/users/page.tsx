import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/lib/db/models";
import { PageHeader } from "@/components/admin/ui";
import { UsersManager } from "@/components/admin/users-manager";
import type { AdminRole } from "@/lib/constants";

export const metadata = { title: "Admin users" };

export default async function UsersPage() {
  const me = await requireAdminPage("users.manage");
  await connectDB();
  const users = await Admin.find().sort({ createdAt: 1 }).select("email name role active lastLoginAt").lean();
  return (
    <>
      <PageHeader title="Admin users" description="Owner: everything · Admin: catalog, leads, analytics · Editor: drafts & content · Viewer: read-only (PII masked)." />
      <UsersManager
        meId={me.id}
        users={users.map((u) => ({
          id: String(u._id),
          email: u.email,
          name: u.name ?? "",
          role: u.role as AdminRole,
          active: Boolean(u.active),
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("en-IN") : "never",
        }))}
      />
    </>
  );
}
