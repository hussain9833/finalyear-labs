import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Degree, Project } from "@/lib/db/models";

import { EmptyRow, PageHeader, PrimaryLink, StatusPill } from "@/components/admin/ui";

export const metadata = { title: "Degrees" };

export default async function AdminDegreesPage() {
  await requireAdminPage("catalog.edit");
  await connectDB();
  const [docs, counts] = await Promise.all([
    Degree.find().sort({ order: 1, name: 1 }).select("name slug order published fullName").lean(),
    Project.aggregate<{ _id: unknown; n: number }>([{ $unwind: "$degrees" }, { $group: { _id: "$degrees", n: { $sum: 1 } } }]),
  ]);
  const count = new Map(counts.map((c) => [String(c._id), c.n]));
  return (
    <>
      <PageHeader
        title="Degrees"
        description="Database-driven — add new degrees here without code changes. Slugs share the /projects/[slug] namespace."
        actions={
          <PrimaryLink href="/admin/degrees/new">
            <Plus className="size-4" aria-hidden /> New degree
          </PrimaryLink>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {docs.length === 0 ? (
          <EmptyRow>No degrees yet. Run the seed script or create one.</EmptyRow>
        ) : (
          <ul className="divide-y divide-border">
            {docs.map((d) => (
              <li key={String(d._id)}>
                <Link href={`/admin/degrees/${d._id}`} className="flex flex-col gap-1 p-4 hover:bg-muted/40 md:flex-row md:items-center md:justify-between">
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      {d.name}
                      <StatusPill tone={d.published ? "green" : "gray"}>{d.published ? "published" : "hidden"}</StatusPill>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /projects/{d.slug} · {d.fullName} · {count.get(String(d._id)) ?? 0} projects · order {d.order}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
