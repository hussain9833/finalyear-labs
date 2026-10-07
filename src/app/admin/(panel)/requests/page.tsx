import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { ProjectRequest } from "@/lib/db/models";
import { REQUEST_STATUSES } from "@/lib/constants";
import { maskEmail } from "@/lib/mask";
import { EmptyRow, PageHeader, StatusPill } from "@/components/admin/ui";

export const metadata = { title: "Custom requests" };

export default async function RequestsPage({ searchParams }: PageProps<"/admin/requests">) {
  const admin = await requireAdminPage("leads.view");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (REQUEST_STATUSES as readonly string[]).includes(sp.status) ? sp.status : undefined;
  await connectDB();
  const filter: Record<string, unknown> = status ? { status } : {};
  const docs = await ProjectRequest.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  const mask = !can(admin.role, "leads.edit");

  return (
    <>
      <PageHeader title="Custom project requests" description="Submitted from /custom-project. Each request also creates a lead." />
      <nav aria-label="Status" className="mb-4 flex w-fit gap-1 rounded-xl bg-muted p-1">
        {[undefined, ...REQUEST_STATUSES].map((s) => (
          <Link key={s ?? "all"} href={s ? `/admin/requests?status=${s}` : "/admin/requests"} className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${status === s ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
            {s ?? "All"}
          </Link>
        ))}
      </nav>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {docs.length === 0 ? (
          <EmptyRow>No requests yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-border">
            {docs.map((r) => (
              <li key={String(r._id)}>
                <Link href={`/admin/requests/${r._id}`} className="flex flex-col gap-1 p-4 hover:bg-muted/40 md:flex-row md:items-center md:justify-between">
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-medium">
                      {r.name} <StatusPill tone={r.status === "new" ? "blue" : r.status === "converted" ? "green" : "gray"}>{r.status}</StatusPill>
                      {r.aiRequired && <StatusPill tone="violet">AI</StatusPill>}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {[r.degree, r.category, r.technology, r.budget && `budget ${r.budget}`, r.deadline && `by ${r.deadline}`].filter(Boolean).join(" · ")} · {mask ? maskEmail(r.email) : r.email}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString("en-IN")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
