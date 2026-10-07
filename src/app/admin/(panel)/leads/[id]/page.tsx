import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/lib/db/models";
import { LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/constants";
import { maskEmail, maskPhone } from "@/lib/mask";
import { LEAD_STATUS_TONE, PageHeader, Panel, SecondaryLink, StatusPill } from "@/components/admin/ui";
import { LeadUpdater, NewLeadForm } from "@/components/admin/lead-forms";

export const metadata = { title: "Lead" };

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  if (id === "new") {
    await requireAdminPage("leads.edit");
    return (
      <>
        <PageHeader title="Add lead" description="For enquiries that came in on WhatsApp or by phone." actions={<SecondaryLink href="/admin/leads">Back</SecondaryLink>} />
        <NewLeadForm />
      </>
    );
  }
  const admin = await requireAdminPage("leads.view");
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const lead = await Lead.findById(id).lean();
  if (!lead) notFound();
  const mask = !can(admin.role, "leads.edit");
  const status = lead.status as LeadStatus;

  const rows: [string, React.ReactNode][] = [
    ["Phone / WhatsApp", lead.phone ? (mask ? maskPhone(lead.phone) : <a href={`tel:${lead.phone}`} className="text-primary hover:underline">{lead.phone}</a>) : "—"],
    ["Email", lead.email ? (mask ? maskEmail(lead.email) : <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>) : "—"],
    ["Degree", lead.degree || "—"],
    ["Project", lead.project || "—"],
    ["Category", lead.category || "—"],
    ["Source", lead.source.replace("_", " ")],
    ["WhatsApp number", lead.whatsappType || "—"],
    ["UTM", [lead.utm?.source, lead.utm?.medium, lead.utm?.campaign].filter(Boolean).join(" / ") || "—"],
    ["Referrer", lead.referrer || "—"],
    ["Landing page", lead.landingPage || "—"],
    ["Created", new Date(lead.createdAt).toLocaleString("en-IN")],
    ["Last updated", new Date(lead.updatedAt).toLocaleString("en-IN")],
  ];

  return (
    <>
      <PageHeader
        title={lead.name || "Lead"}
        description={undefined}
        actions={
          <>
            {lead.requestId && <SecondaryLink href={`/admin/requests/${lead.requestId}`}>View request</SecondaryLink>}
            <SecondaryLink href="/admin/leads">Back</SecondaryLink>
          </>
        }
      />
      <div className="mb-6">
        <StatusPill tone={LEAD_STATUS_TONE[status]}>{LEAD_STATUS_LABEL[status]}</StatusPill>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Panel title="Details">
          <dl className="divide-y divide-border text-sm">
            {rows.map(([k, val]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="break-words">{val}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <div className="grid h-fit gap-6">
          {!mask && <LeadUpdater id={id} status={status} />}
          <Panel title={`Activity (${lead.notes.length})`}>
            {lead.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <ol className="grid gap-4">
                {[...lead.notes].reverse().map((n) => (
                  <li key={String(n._id)} className="border-l-2 border-border pl-4">
                    <p className="text-sm whitespace-pre-line">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {n.author} · {n.at ? new Date(n.at).toLocaleString("en-IN") : ""}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <p className="text-xs text-muted-foreground">
            Tip: a WhatsApp click is lead intent, not a sale. Move this lead to <strong>Purchased</strong> only once payment is confirmed. See{" "}
            <Link href="/admin/analytics" className="text-primary hover:underline">WhatsApp analytics</Link> for click context.
          </p>
        </div>
      </div>
    </>
  );
}
