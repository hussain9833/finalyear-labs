import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Project, Testimonial } from "@/lib/db/models";
import { PageHeader } from "@/components/admin/ui";
import { TestimonialsEditor } from "@/components/admin/content-editors";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  await requireAdminPage("content.edit");
  await connectDB();
  const [docs, projects] = await Promise.all([
    Testimonial.find().sort({ order: 1, createdAt: -1 }).lean(),
    Project.find().sort({ name: 1 }).select("name slug").lean(),
  ]);
  return (
    <>
      <PageHeader title="Testimonials" description="Real, consented student testimonials only." />
      <TestimonialsEditor
        rows={docs.map((d) => ({
          id: String(d._id),
          name: d.name,
          degree: d.degree ?? undefined,
          college: d.college ?? undefined,
          quote: d.quote,
          rating: d.rating ?? undefined,
          projectSlug: d.projectSlug ?? undefined,
          avatarUrl: d.avatarUrl ?? undefined,
          consent: Boolean(d.consent),
          published: Boolean(d.published),
          order: d.order ?? 0,
        }))}
        projects={projects.map((p) => ({ value: p.slug, label: p.name }))}
      />
    </>
  );
}
