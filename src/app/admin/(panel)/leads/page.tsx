import Link from "next/link";
import { Plus } from "lucide-react";
import { trusted } from "mongoose";
import { requireAdminPage } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/lib/db/models";
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/constants";
import { escapeRegex } from "@/lib/utils";
import { maskEmail, maskPhone } from "@/lib/mask";
import { EmptyRow, LEAD_STATUS_TONE, PageHeader, PrimaryLink, StatusPill } from "@/components/admin/ui";
import { NativeSelect } from "@/components/forms/native-select";

export const metadata = { title: "Leads" };


export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const admin = await requireAdminPage("leads.view");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (LEAD_STATUSES as readonly string[]).includes(sp.status) ? sp.status : undefined;
  const source = typeof sp.source === "string" && (LEAD_SOURCES as readonly string[]).includes(sp.source) ? sp.source : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const mask = !can(admin.role, "leads.edit");

  await connectDB();
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (q) {
    const rx = trusted({ $regex: escapeRegex(q), $options: "i" });
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { project: rx }];
  }
  const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <>
      <PageHeader
        title="Leads"
        description="Pipeline: New → Contacted → Interested → Follow-up → Purchased → Completed / Lost."
        actions={
          can(admin.role, "leads.edit") ? (
            <PrimaryLink href="/admin/leads/new">
              <Plus className="size-4" aria-hidden /> Add lead
            </PrimaryLink>
          ) : undefined
        }
      />
      <form method="get" className="mb-4 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
        <NativeSelect name="status" label="Status" placeholder="All" defaultValue={status} options={LEAD_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABEL[s] }))} />
        <NativeSelect name="source" label="Source" placeholder="All" defaultValue={source} options={LEAD_SOURCES.map((s) => ({ value: s, label: s.replace("_", " ") }))} />
        <div className="grid gap-1.5">
          <label htmlFor="lq" className="text-sm font-medium">Search</label>
          <input id="lq" name="q" defaultValue={q} placeholder="Name, phone, email, project…" className="h-12 rounded-xl border border-input bg-background px-3 text-sm" />
        </div>
        <button type="submit" className="h-12 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">Filter</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {leads.length === 0 ? (
          <EmptyRow>No leads match. Leads come from the custom project form or can be added manually after a WhatsApp chat.</EmptyRow>
        ) : (
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Interest</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={String(l._id)} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l._id}`} className="font-medium hover:text-primary">
                      {l.name || "(no name)"}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{mask ? maskPhone(l.phone) : l.phone} {l.email && `· ${mask ? maskEmail(l.email) : l.email}`}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{[l.project, l.category, l.degree].filter(Boolean).join(" · ") || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {l.source.replace("_", " ")}
                    {l.utm?.source && <span className="block text-xs">utm: {l.utm.source}{l.utm.campaign ? ` / ${l.utm.campaign}` : ""}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={LEAD_STATUS_TONE[l.status as LeadStatus]}>{LEAD_STATUS_LABEL[l.status as LeadStatus]}</StatusPill>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
