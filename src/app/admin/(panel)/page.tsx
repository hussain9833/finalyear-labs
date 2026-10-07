import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Lead, Project, ProjectRequest } from "@/lib/db/models";
import { getWhatsAppStats } from "@/lib/analytics/whatsapp-stats";
import { getCatalog } from "@/lib/data/catalog";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/constants";
import { BarList, PageHeader, Panel, StatCard, StatusPill, EmptyRow } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  const admin = await requireAdminPage("dashboard.view");
  const denied = (await searchParams).denied === "1";
  await connectDB();

  const [projectCounts, leadCounts, recent, stats, catalog] = await Promise.all([
    Project.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    Lead.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    ProjectRequest.find().sort({ createdAt: -1 }).limit(6).select("name degree category createdAt status").lean(),
    getWhatsAppStats({}),
    getCatalog(),
  ]);

  const pc = Object.fromEntries(projectCounts.map((r) => [r._id, r.n]));
  const lc = Object.fromEntries(leadCounts.map((r) => [r._id, r.n]));
  const totalProjects = Object.values(pc).reduce((a: number, b) => a + (b as number), 0);
  const totalLeads = Object.values(lc).reduce((a: number, b) => a + (b as number), 0);
  const catName = new Map(catalog.categories.map((c) => [c.slug, c.name]));
  const degName = new Map(catalog.degrees.map((d) => [d.slug, d.name]));

  return (
    <>
      <PageHeader title={`Welcome back${admin.name ? `, ${admin.name.split(" ")[0]}` : ""}`} description="Overview of your catalog, WhatsApp leads and enquiries." />
      {denied && <p role="alert" className="mb-6 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">You don&apos;t have permission to open that page.</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Projects" value={totalProjects} hint={`${pc.published ?? 0} published · ${pc.draft ?? 0} draft · ${pc.archived ?? 0} archived`} />
        <StatCard label="WhatsApp clicks (7 days)" value={stats.week} hint={`${stats.today} today · ${stats.month} in 30 days`} />
        <StatCard label="Leads" value={totalLeads} hint={`${lc.NEW ?? 0} new · ${lc.PURCHASED ?? 0} purchased`} />
        <StatCard label="Orders" value="—" hint="Online payments not enabled (WhatsApp flow)" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Popular projects (30 days)" action={<Link href="/admin/analytics" className="text-xs font-medium text-primary">Analytics →</Link>}>
          <BarList items={stats.byProject.slice(0, 6).map((b) => ({ label: b.name ?? b.key, value: b.count }))} emptyText="No WhatsApp clicks yet" />
        </Panel>
        <Panel title="Popular categories (30 days)">
          <BarList items={stats.byCategory.filter((b) => b.key !== "(none)").slice(0, 6).map((b) => ({ label: catName.get(b.key) ?? b.key, value: b.count }))} emptyText="No WhatsApp clicks yet" />
        </Panel>
        <Panel title="Popular degrees (30 days)">
          <BarList items={stats.byDegree.filter((b) => b.key !== "(none)").slice(0, 6).map((b) => ({ label: degName.get(b.key) ?? b.key, value: b.count }))} emptyText="No degree-tagged clicks yet" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Lead pipeline" action={<Link href="/admin/leads" className="text-xs font-medium text-primary">Leads →</Link>}>
          <BarList items={LEAD_STATUSES.map((s) => ({ label: LEAD_STATUS_LABEL[s], value: lc[s] ?? 0, href: `/admin/leads?status=${s}` }))} />
        </Panel>
        <Panel title="Recent custom requests" action={<Link href="/admin/requests" className="text-xs font-medium text-primary">All requests →</Link>}>
          {recent.length === 0 ? (
            <EmptyRow>No custom requests yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li key={String(r._id)}>
                  <Link href={`/admin/requests/${r._id}`} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {[r.degree && (degName.get(r.degree) ?? r.degree), r.category && (catName.get(r.category) ?? r.category)].filter(Boolean).join(" · ") || "—"} ·{" "}
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </span>
                    <StatusPill tone={r.status === "new" ? "blue" : r.status === "converted" ? "green" : "gray"}>{r.status}</StatusPill>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
