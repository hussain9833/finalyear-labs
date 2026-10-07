import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { Project } from "@/lib/db/models";
import { PageHeader, SecondaryLink } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getFormOptions, toFormValues } from "../form-data";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  const admin = await requireAdminPage("catalog.edit");
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const [doc, options] = await Promise.all([Project.findById(id).lean(), getFormOptions()]);
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        title={doc.name}
        description={doc.isSample ? "Sample listing — replace its content with a real project before launch." : `/projects/${doc.slug}`}
        actions={
          <>
            {doc.status === "published" && <SecondaryLink href={`/projects/${doc.slug}`}>View on site</SecondaryLink>}
            <SecondaryLink href="/admin/projects">Back to projects</SecondaryLink>
          </>
        }
      />
      <ProjectForm id={id} initial={toFormValues(doc)} categories={options.categories} degrees={options.degrees} canPublish={can(admin.role, "catalog.publish")} />
    </>
  );
}
