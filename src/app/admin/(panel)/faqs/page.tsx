import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Faq } from "@/lib/db/models";
import { PageHeader } from "@/components/admin/ui";
import { FaqsEditor } from "@/components/admin/content-editors";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  await requireAdminPage("content.edit");
  await connectDB();
  const docs = await Faq.find().sort({ scope: 1, order: 1 }).lean();
  return (
    <>
      <PageHeader title="FAQs" description="Site-wide FAQs. Project, degree and category FAQs are edited on those records." />
      <FaqsEditor rows={docs.map((d) => ({ id: String(d._id), question: d.question, answer: d.answer, scope: d.scope, order: d.order ?? 0, published: Boolean(d.published) }))} />
    </>
  );
}
