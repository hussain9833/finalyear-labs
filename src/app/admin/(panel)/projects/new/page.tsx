import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { PageHeader, SecondaryLink } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/project-form";
import { emptyProject } from "@/lib/admin-defaults";
import { getFormOptions } from "../form-data";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const admin = await requireAdminPage("catalog.edit");
  const { categories, degrees } = await getFormOptions();
  return (
    <>
      <PageHeader title="New project" actions={<SecondaryLink href="/admin/projects">Back to projects</SecondaryLink>} />
      <ProjectForm id={null} initial={emptyProject()} categories={categories} degrees={degrees} canPublish={can(admin.role, "catalog.publish")} />
    </>
  );
}
