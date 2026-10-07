"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitCustomRequest } from "@/app/(site)/custom-project/actions";
import { NativeSelect } from "@/components/forms/native-select";
import { TextAreaField, TextField } from "@/components/forms/field";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { STUDY_YEARS, YEAR_LABEL } from "@/lib/constants";
import type { FormState } from "@/lib/validation/public";

type Opt = { value: string; label: string };

export function CustomProjectForm({ degrees, categories }: { degrees: Opt[]; categories: Opt[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitCustomRequest, { ok: false });
  const summaryRef = useRef<HTMLDivElement>(null);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.message) summaryRef.current?.focus();
  }, [state]);

  if (state.ok) {
    return (
      <div ref={summaryRef} tabIndex={-1} className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center outline-none" role="status">
        <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">{state.message}</p>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">Want a faster reply? Continue the conversation on WhatsApp — your requirements are pre-filled.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppButton intent="custom" cta="custom_project" degree={state.summary?.degree} requirements={state.summary?.requirements} size="lg">
            Continue on WhatsApp
          </WhatsAppButton>
          <Link href="/projects" className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 font-medium hover:bg-muted">
            Browse projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form key={JSON.stringify(v)} action={action} noValidate className="grid gap-8 rounded-2xl border border-border bg-card p-5 md:p-8" aria-describedby={state.message ? "form-status" : undefined}>
      {state.message && (
        <div ref={summaryRef} tabIndex={-1} id="form-status" role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive outline-none">
          {state.message}
        </div>
      )}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">About you</legend>
        <TextField defaultValue={v.name} name="name" label="Full name" autoComplete="name" required error={e.name} />
        <TextField defaultValue={v.email} name="email" label="Email" type="email" autoComplete="email" required error={e.email} />
        <TextField defaultValue={v.phone} name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" required error={e.phone} placeholder="+91 98765 43210" />
        <TextField defaultValue={v.whatsapp} name="whatsapp" label="WhatsApp number" type="tel" inputMode="tel" error={e.whatsapp} hint="Leave empty if same as phone" />
        <NativeSelect name="degree" label="Degree" placeholder="Select degree" options={degrees} error={e.degree} defaultValue={v.degree} />
        <NativeSelect name="year" label="Year" placeholder="Select year" options={STUDY_YEARS.map((y) => ({ value: y, label: YEAR_LABEL[y] }))} error={e.year} defaultValue={v.year} />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">Your project</legend>
        <NativeSelect name="category" label="Project category" placeholder="Not sure yet" options={categories} error={e.category} defaultValue={v.category} />
        <TextField defaultValue={v.technology} name="technology" label="Preferred technology" placeholder="e.g. React + Node.js, Python, PHP" error={e.technology} />
        <TextAreaField
          name="features"
          defaultValue={v.features}
          label="Features required"
          required
          className="sm:col-span-2"
          error={e.features}
          placeholder="Describe the modules or features your synopsis needs…"
          maxLength={3000}
        />
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border px-4 text-sm font-medium sm:col-span-2">
          <input type="checkbox" name="aiRequired" defaultChecked={v.aiRequired === "on"} className="size-4 accent-[var(--primary)]" />
          I want AI features (chatbot, analysis, recommendations…)
        </label>
        <TextField defaultValue={v.budget} name="budget" label="Budget" placeholder="e.g. ₹8,000 – ₹12,000" error={e.budget} />
        <TextField defaultValue={v.deadline} name="deadline" label="Deadline" placeholder="e.g. 15 March / 6 weeks" error={e.deadline} />
        <TextAreaField defaultValue={v.additional} name="additional" label="Additional requirements" className="sm:col-span-2" error={e.additional} placeholder="University guidelines, documentation needs, anything else…" maxLength={3000} />
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" required defaultChecked={v.consent === "on"} className="mt-0.5 size-4 accent-[var(--primary)]" aria-invalid={e.consent ? true : undefined} aria-describedby={e.consent ? "consent-error" : undefined} />
          <span>
            I agree to be contacted about this request and accept the{" "}
            <Link href="/privacy-policy" className="font-medium text-primary underline-offset-2 hover:underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {e.consent && (
          <p id="consent-error" className="-mt-2 text-sm text-destructive">
            {e.consent}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70 sm:w-fit"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Sending…" : "Request Custom Project"}
        </button>
      </div>
    </form>
  );
}
