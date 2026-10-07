"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteFaq, deleteTestimonial, saveFaq, saveTestimonial } from "@/app/admin/(panel)/content-actions";
import { FAQ_SCOPES } from "@/lib/constants";
import { Area, Select, Text, Toggle } from "./form-kit";
import { StatusPill } from "./ui";

type Result = { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

function useSaver() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<Result>, after?: () => void) =>
    start(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(res.message ?? "Saved");
        after?.();
        router.refresh();
      } else toast.error(res.error);
    });
  return { pending, run };
}

/* ------------------------------ Testimonials ----------------------------- */

export type TestimonialRow = {
  id: string;
  name: string;
  degree?: string;
  college?: string;
  quote: string;
  rating?: number;
  projectSlug?: string;
  avatarUrl?: string;
  consent: boolean;
  published: boolean;
  order: number;
};

const emptyTestimonial = (): Omit<TestimonialRow, "id"> => ({ name: "", quote: "", consent: false, published: false, order: 0 });

export function TestimonialsEditor({ rows, projects }: { rows: TestimonialRow[]; projects: { value: string; label: string }[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const { pending, run } = useSaver();
  const current = editing === "new" ? emptyTestimonial() : rows.find((r) => r.id === editing);

  return (
    <div className="grid gap-4">
      <p className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Only add <strong className="text-foreground">real</strong> testimonials from students who agreed to publication. Testimonials (and any ratings) are hidden on the
        site until published, and ratings feed structured data — never invent them.
      </p>
      {editing === null && (
        <button type="button" onClick={() => setEditing("new")} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" aria-hidden /> Add testimonial
        </button>
      )}
      {current && (
        <TestimonialForm
          key={editing}
          initial={current}
          projects={projects}
          pending={pending}
          onCancel={() => setEditing(null)}
          onSave={(data) => run(() => saveTestimonial(editing === "new" ? null : (editing as string), JSON.stringify(data)), () => setEditing(null))}
        />
      )}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {rows.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">No testimonials yet.</li>}
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 p-4 md:flex-row md:items-start">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                {r.name}
                <StatusPill tone={r.published ? "green" : "gray"}>{r.published ? "published" : "hidden"}</StatusPill>
                {!r.consent && <StatusPill tone="red">no consent</StatusPill>}
                {r.rating && <StatusPill tone="amber">{r.rating}★</StatusPill>}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">“{r.quote}”</p>
              <p className="mt-1 text-xs text-muted-foreground">{[r.degree, r.college, r.projectSlug && `project: ${r.projectSlug}`].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(r.id)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted">
                <Pencil className="size-3.5" aria-hidden /> Edit
              </button>
              <button
                type="button"
                onClick={() => confirm("Delete this testimonial?") && run(() => deleteTestimonial(r.id))}
                className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-medium text-destructive hover:bg-muted"
                aria-label={`Delete testimonial from ${r.name}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestimonialForm({
  initial,
  projects,
  pending,
  onCancel,
  onSave,
}: {
  initial: Omit<TestimonialRow, "id">;
  projects: { value: string; label: string }[];
  pending: boolean;
  onCancel: () => void;
  onSave: (v: Omit<TestimonialRow, "id">) => void;
}) {
  const [v, setV] = useState(initial);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  return (
    <form
      className="grid gap-4 rounded-2xl border border-primary/30 bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(v);
      }}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Text id="t-name" label="Student name" value={v.name} onChange={(name) => set({ name })} />
        <Text id="t-degree" label="Degree" value={v.degree} onChange={(degree) => set({ degree })} />
        <Text id="t-college" label="College (optional)" value={v.college} onChange={(college) => set({ college })} />
      </div>
      <Area id="t-quote" label="Quote" rows={3} maxLength={800} value={v.quote} onChange={(quote) => set({ quote })} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select id="t-project" label="Project (optional)" value={v.projectSlug ?? ""} placeholder="General" options={projects} onChange={(projectSlug) => set({ projectSlug: projectSlug || undefined })} />
        <Select
          id="t-rating"
          label="Rating (only if the student gave one)"
          value={v.rating ? String(v.rating) : ""}
          placeholder="No rating"
          options={["5", "4", "3", "2", "1"].map((r) => ({ value: r, label: `${r} / 5` }))}
          onChange={(r) => set({ rating: r ? Number(r) : undefined })}
        />
        <Text id="t-order" label="Order" type="number" value={v.order} onChange={(o) => set({ order: Math.max(0, Number(o) || 0) })} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Toggle label="Student consented to publication" checked={v.consent} onChange={(consent) => set({ consent })} />
        <Toggle label="Published" checked={v.published} onChange={(published) => set({ published })} hint="Requires consent." />
      </div>
      <FormButtons pending={pending} onCancel={onCancel} />
    </form>
  );
}

/* ---------------------------------- FAQs --------------------------------- */

export type FaqRow = { id: string; question: string; answer: string; scope: (typeof FAQ_SCOPES)[number]; order: number; published: boolean };

export function FaqsEditor({ rows }: { rows: FaqRow[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const { pending, run } = useSaver();
  const current = editing === "new" ? { question: "", answer: "", scope: "home" as const, order: rows.length, published: true } : rows.find((r) => r.id === editing);

  return (
    <div className="grid gap-4">
      {editing === null && (
        <button type="button" onClick={() => setEditing("new")} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" aria-hidden /> Add FAQ
        </button>
      )}
      {current && <FaqForm key={editing} initial={current} pending={pending} onCancel={() => setEditing(null)} onSave={(d) => run(() => saveFaq(editing === "new" ? null : (editing as string), JSON.stringify(d)), () => setEditing(null))} />}
      {FAQ_SCOPES.map((scope) => {
        const list = rows.filter((r) => r.scope === scope);
        return (
          <section key={scope} className="rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3 text-sm font-semibold capitalize">
              {scope.replace("-", " ")} <span className="font-normal text-muted-foreground">({list.length})</span>
            </h2>
            <ul className="divide-y divide-border">
              {list.length === 0 && <li className="p-5 text-sm text-muted-foreground">No FAQs in this section — it stays hidden on the site.</li>}
              {list.map((r) => (
                <li key={r.id} className="flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {r.question} {!r.published && <StatusPill tone="gray">hidden</StatusPill>}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.answer}</p>
                  </div>
                  <button type="button" onClick={() => setEditing(r.id)} className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => confirm("Delete this FAQ?") && run(() => deleteFaq(r.id))}
                    className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-destructive hover:bg-muted"
                    aria-label="Delete FAQ"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function FaqForm({ initial, pending, onCancel, onSave }: { initial: Omit<FaqRow, "id">; pending: boolean; onCancel: () => void; onSave: (v: Omit<FaqRow, "id">) => void }) {
  const [v, setV] = useState(initial);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  return (
    <form
      className="grid gap-4 rounded-2xl border border-primary/30 bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(v);
      }}
    >
      <Text id="faq-q" label="Question" value={v.question} onChange={(question) => set({ question })} />
      <Area id="faq-a" label="Answer" rows={3} value={v.answer} onChange={(answer) => set({ answer })} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select id="faq-scope" label="Shown on" value={v.scope} options={FAQ_SCOPES.map((s) => ({ value: s, label: s }))} onChange={(scope) => set({ scope })} />
        <Text id="faq-order" label="Order" type="number" value={v.order} onChange={(o) => set({ order: Math.max(0, Number(o) || 0) })} />
        <Toggle label="Published" checked={v.published} onChange={(published) => set({ published })} />
      </div>
      <FormButtons pending={pending} onCancel={onCancel} />
    </form>
  );
}

function FormButtons({ pending, onCancel }: { pending: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2">
      <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-70">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Save
      </button>
      <button type="button" onClick={onCancel} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted">
        <X className="size-4" aria-hidden /> Cancel
      </button>
    </div>
  );
}
