import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { ProjectRequest } from "@/lib/db/models";
import { YEAR_LABEL } from "@/lib/constants";
import { maskEmail, maskPhone } from "@/lib/mask";
import { PageHeader, Panel, SecondaryLink } from "@/components/admin/ui";
import { RequestStatusControl } from "@/components/admin/request-status";

export const metadata = { title: "Custom request" };

export default async function RequestPage({ params }: PageProps<"/admin/requests/[id]">) {
  const admin = await requireAdminPage("leads.view");
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const r = await ProjectRequest.findById(id).lean();
  if (!r) notFound();
  const mask = !can(admin.role, "leads.edit");
  const rows: [string, string][] = [
    ["Email", mask ? maskEmail(r.email) : r.email],
    ["Phone", mask ? maskPhone(r.phone) : r.phone],
    ["WhatsApp", r.whatsapp ? (mask ? maskPhone(r.whatsapp) : r.whatsapp) : "Same as phone"],
    ["Degree", r.degree || "—"],
    ["Year", r.year ? YEAR_LABEL[r.year] : "—"],
    ["Category", r.category || "—"],
    ["Technology", r.technology || "—"],
    ["AI required", r.aiRequired ? "Yes" : "No"],
    ["Budget", r.budget || "—"],
    ["Deadline", r.deadline || "—"],
    ["UTM", [r.utm?.source, r.utm?.medium, r.utm?.campaign].filter(Boolean).join(" / ") || "—"],
    ["Referrer", r.referrer || "—"],
    ["Submitted", new Date(r.createdAt).toLocaleString("en-IN")],
  ];
  return (
    <>
      <PageHeader
        title={r.name}
        actions={
          <>
            {r.leadId && <SecondaryLink href={`/admin/leads/${r.leadId}`}>Open lead</SecondaryLink>}
            <SecondaryLink href="/admin/requests">Back</SecondaryLink>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel title="Details">
          <dl className="divide-y divide-border text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <div className="grid h-fit gap-6">
          {can(admin.role, "requests.edit") && <RequestStatusControl id={id} status={r.status} />}
          <Panel title="Features required">
            <p className="text-sm whitespace-pre-line">{r.features}</p>
          </Panel>
          {r.additional && (
            <Panel title="Additional requirements">
              <p className="text-sm whitespace-pre-line">{r.additional}</p>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
