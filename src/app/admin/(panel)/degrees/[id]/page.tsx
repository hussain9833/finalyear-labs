import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Degree } from "@/lib/db/models";
import { PageHeader, SecondaryLink } from "@/components/admin/ui";
import { HubForm } from "@/components/admin/hub-form";
import { emptyDegree } from "@/lib/admin-defaults";
import { DeleteDegreeButton } from "@/components/admin/delete-buttons";
import { toDegreeInput } from "../../hub-form-data";

export const metadata = { title: "Degree" };

export default async function EditDegreePage({ params }: PageProps<"/admin/degrees/[id]">) {
  await requireAdminPage("catalog.publish");
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <PageHeader title="New degree" actions={<SecondaryLink href="/admin/degrees">Back</SecondaryLink>} />
        <HubForm kind="degree" id={null} initial={emptyDegree()} />
      </>
    );
  }
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const doc = await Degree.findById(id).lean();
  if (!doc) notFound();
  return (
    <>
      <PageHeader
        title={doc.name}
        description={`/projects/${doc.slug}`}
        actions={
          <>
            <SecondaryLink href={`/projects/${doc.slug}`}>View on site</SecondaryLink>
            <SecondaryLink href="/admin/degrees">Back</SecondaryLink>
            <DeleteDegreeButton id={id} />
          </>
        }
      />
      <HubForm kind="degree" id={id} initial={toDegreeInput(doc)} />
    </>
  );
}
