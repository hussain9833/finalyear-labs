import Link from "next/link";
import { Plus } from "lucide-react";
import { trusted } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { Category, Project } from "@/lib/db/models";
import { escapeRegex, formatPrice } from "@/lib/utils";
import { PROJECT_STATUSES } from "@/lib/constants";
import { EmptyRow, PageHeader, PrimaryLink, StatusPill } from "@/components/admin/ui";
import { ProjectRowActions } from "@/components/admin/project-row-actions";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const admin = await requireAdminPage("catalog.edit");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (PROJECT_STATUSES as readonly string[]).includes(sp.status) ? sp.status : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";

  await connectDB();
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) filter.name = trusted({ $regex: escapeRegex(q), $options: "i" });
  const [projects, categories] = await Promise.all([
    Project.find(filter).sort({ updatedAt: -1 }).limit(200).select("name slug status featured priceFrom category isSample updatedAt thumbnail seo").lean(),
    Category.find().select("name").lean(),
  ]);
  const catName = new Map(categories.map((c) => [String(c._id), c.name]));
  const tabs = [{ key: undefined, label: "All" }, ...PROJECT_STATUSES.map((s) => ({ key: s, label: s[0]!.toUpperCase() + s.slice(1) }))];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create, edit, publish and feature projects. Changes appear on the site immediately."
        actions={
          <PrimaryLink href="/admin/projects/new">
            <Plus className="size-4" aria-hidden /> New project
          </PrimaryLink>
        }
      />
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Status" className="flex gap-1 rounded-xl bg-muted p-1">
          {tabs.map((t) => (
            <Link
              key={t.label}
              href={t.key ? `/admin/projects?status=${t.key}` : "/admin/projects"}
              aria-current={status === t.key ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${status === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="q" className="sr-only">Search projects</label>
          <input id="q" name="q" defaultValue={q} placeholder="Search by name…" className="h-10 w-64 rounded-xl border border-input bg-background px-3 text-sm" />
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {projects.length === 0 ? (
          <EmptyRow>No projects found. Create your first project.</EmptyRow>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((p) => (
              <li key={String(p._id)} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/projects/${p._id}`} className="font-medium hover:text-primary">
                      {p.name}
                    </Link>
                    <StatusPill tone={p.status === "published" ? "green" : p.status === "draft" ? "amber" : "gray"}>{p.status}</StatusPill>
                    {p.featured && <StatusPill tone="violet">featured</StatusPill>}
                    {p.isSample && <StatusPill tone="gray">sample</StatusPill>}
                    {p.seo?.noindex && <StatusPill tone="red">noindex</StatusPill>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    /projects/{p.slug} · {catName.get(String(p.category)) ?? "—"} · {formatPrice(p.priceFrom)} · updated {new Date(p.updatedAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <ProjectRowActions
                  id={String(p._id)}
                  slug={p.slug}
                  status={p.status as "draft" | "published" | "archived"}
                  featured={Boolean(p.featured)}
                  canPublish={can(admin.role, "catalog.publish")}
                  canDelete={can(admin.role, "catalog.delete")}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
