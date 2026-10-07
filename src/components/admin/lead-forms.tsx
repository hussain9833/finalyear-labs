"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createLead, updateLead } from "@/app/admin/(panel)/crm-actions";
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/constants";
import { WHATSAPP_NUMBER_LABEL, WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";
import { Area, FormSection, Select, Text } from "./form-kit";

export function LeadUpdater({ id, status }: { id: string; status: LeadStatus }) {
  const router = useRouter();
  const [next, setNext] = useState<LeadStatus>(status);
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="grid gap-4 rounded-2xl border border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await updateLead(id, JSON.stringify({ status: next, note: note || undefined }));
          if (res.ok) {
            toast.success(res.message ?? "Updated");
            setNote("");
            router.refresh();
          } else toast.error(res.error);
        });
      }}
    >
      <h2 className="text-sm font-semibold">Update lead</h2>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Status">
        {LEAD_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={next === s}
            onClick={() => setNext(s)}
            className={`h-9 rounded-full border px-3 text-xs font-medium ${next === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
          >
            {LEAD_STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      <Area id="note" label="Add a note" rows={3} value={note} onChange={setNote} placeholder="Called, shared demo, waiting for confirmation…" />
      <button type="submit" disabled={pending || (next === status && !note.trim())} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save
      </button>
    </form>
  );
}

export function NewLeadForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v, setV] = useState({
    name: "",
    phone: "",
    email: "",
    degree: "",
    project: "",
    category: "",
    whatsappType: "" as string,
    source: "whatsapp" as (typeof LEAD_SOURCES)[number],
    status: "NEW" as LeadStatus,
    note: "",
  });
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await createLead(JSON.stringify({ ...v, whatsappType: v.whatsappType || undefined }));
          if (res.ok) {
            toast.success(res.message ?? "Created");
            router.replace(`/admin/leads/${res.data?.id}`);
          } else {
            setErrors(res.fieldErrors ?? {});
            toast.error(res.error);
          }
        });
      }}
    >
      <FormSection title="Contact">
        <div className="grid gap-4 md:grid-cols-3">
          <Text id="ln" label="Name" value={v.name} onChange={(name) => set({ name })} />
          <Text id="lp" label="Phone / WhatsApp" value={v.phone} onChange={(phone) => set({ phone })} />
          <Text id="le" label="Email" value={v.email} error={errors.email} onChange={(email) => set({ email })} />
        </div>
      </FormSection>
      <FormSection title="Interest & source">
        <div className="grid gap-4 md:grid-cols-3">
          <Text id="ld" label="Degree" value={v.degree} onChange={(degree) => set({ degree })} />
          <Text id="lpr" label="Project" value={v.project} onChange={(project) => set({ project })} />
          <Text id="lc" label="Category" value={v.category} onChange={(category) => set({ category })} />
          <Select id="ls" label="Source" value={v.source} options={LEAD_SOURCES.map((s) => ({ value: s, label: s.replace("_", " ") }))} onChange={(source) => set({ source })} />
          <Select id="lw" label="WhatsApp number" value={v.whatsappType} placeholder="—" options={WHATSAPP_NUMBER_TYPES.map((n) => ({ value: n, label: WHATSAPP_NUMBER_LABEL[n] }))} onChange={(whatsappType) => set({ whatsappType })} />
          <Select id="lst" label="Status" value={v.status} options={LEAD_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABEL[s] }))} onChange={(status) => set({ status })} />
        </div>
        <Area id="lnote" label="Note" rows={3} value={v.note} onChange={(note) => set({ note })} />
      </FormSection>
      <button type="submit" disabled={pending} className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-70">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Create lead
      </button>
    </form>
  );
}
