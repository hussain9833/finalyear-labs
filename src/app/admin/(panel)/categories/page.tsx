import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Category, Project } from "@/lib/db/models";
import { formatPrice } from "@/lib/utils";
import { EmptyRow, PageHeader, PrimaryLink, StatusPill } from "@/components/admin/ui";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  await requireAdminPage("catalog.edit");
  await connectDB();
  const [docs, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).select("name slug order published priceFrom whatsappRoute").lean(),
    Project.aggregate<{ _id: unknown; n: number }>([{ $unwind: "$categories" }, { $group: { _id: "$categories", n: { $sum: 1 } } }]),
  ]);
  const count = new Map(counts.map((c) => [String(c._id), c.n]));
  return (
    <>
      <PageHeader
        title="Categories"
        description="Database-driven — add new categories here without code changes. Slugs share the /projects/[slug] namespace."
        actions={
          <PrimaryLink href="/admin/categories/new">
            <Plus className="size-4" aria-hidden /> New category
          </PrimaryLink>
        }
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {docs.length === 0 ? (
          <EmptyRow>No categories yet. Run the seed script or create one.</EmptyRow>
        ) : (
          <ul className="divide-y divide-border">
            {docs.map((d) => (
              <li key={String(d._id)}>
                <Link href={`/admin/categories/${d._id}`} className="flex flex-col gap-1 p-4 hover:bg-muted/40 md:flex-row md:items-center md:justify-between">
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      {d.name}
                      <StatusPill tone={d.published ? "green" : "gray"}>{d.published ? "published" : "hidden"}</StatusPill>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /projects/{d.slug} · {formatPrice(d.priceFrom)} · WhatsApp: {d.whatsappRoute} · {count.get(String(d._id)) ?? 0} projects · order {d.order}
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
