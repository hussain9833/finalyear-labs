import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/db/models";
import { PageHeader, SecondaryLink } from "@/components/admin/ui";
import { HubForm } from "@/components/admin/hub-form";
import { emptyCategory } from "@/lib/admin-defaults";
import { DeleteCategoryButton } from "@/components/admin/delete-buttons";
import { toCategoryInput } from "../../hub-form-data";

export const metadata = { title: "Category" };

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  await requireAdminPage("catalog.publish");
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <PageHeader title="New category" actions={<SecondaryLink href="/admin/categories">Back</SecondaryLink>} />
        <HubForm kind="category" id={null} initial={emptyCategory()} />
      </>
    );
  }
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const doc = await Category.findById(id).lean();
  if (!doc) notFound();
  return (
    <>
      <PageHeader
        title={doc.name}
        description={`/projects/${doc.slug}`}
        actions={
          <>
            <SecondaryLink href={`/projects/${doc.slug}`}>View on site</SecondaryLink>
            <SecondaryLink href="/admin/categories">Back</SecondaryLink>
            <DeleteCategoryButton id={id} />
          </>
        }
      />
      <HubForm kind="category" id={id} initial={toCategoryInput(doc)} />
    </>
  );
}
