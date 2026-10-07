"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveCategory, saveDegree } from "@/app/admin/(panel)/taxonomy-actions";
import { ACCENTS } from "@/lib/constants";
import { WHATSAPP_NUMBER_LABEL, WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";
import { ICON_KEYS } from "@/components/icon";
import { DESCRIPTION_MAX, TITLE_MAX } from "@/lib/seo/metadata";
import { slugify } from "@/lib/utils";
import type { CategoryInput, DegreeInput } from "@/lib/validation/admin";
import { Area, FormSection, Repeater, Select, Tags, Text, Toggle } from "./form-kit";

type Props =
  | { kind: "category"; id: string | null; initial: CategoryInput }
  | { kind: "degree"; id: string | null; initial: DegreeInput };

export function HubForm(props: Props) {
  const router = useRouter();
  const [v, setV] = useState<CategoryInput | DegreeInput>(props.initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = (patch: Partial<CategoryInput & DegreeInput>) => setV((s) => ({ ...s, ...patch }) as typeof s);
  const cat = v as CategoryInput;
  const deg = v as DegreeInput;
  const base = props.kind === "category" ? "/admin/categories" : "/admin/degrees";

  function submit() {
    start(async () => {
      const res = props.kind === "category" ? await saveCategory(props.id, JSON.stringify(v)) : await saveDegree(props.id, JSON.stringify(v));
      if (res.ok) {
        setErrors({});
        toast.success(res.message ?? "Saved");
        if (!props.id && res.data?.id) router.replace(`${base}/${res.data.id}`);
        else router.refresh();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
      }
    });
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <FormSection title="Basics">
        <div className="grid gap-4 md:grid-cols-3">
          <Text id="name" label="Name" value={v.name} error={errors.name} onChange={(name) => set({ name, ...(props.id ? {} : { slug: slugify(name) }) })} />
          <Text id="slug" label="URL slug" value={v.slug} error={errors.slug} hint={`/projects/${v.slug || "…"}`} onChange={(slug) => set({ slug: slug.toLowerCase() })} />
          {props.kind === "category" ? (
            <Text id="shortName" label="Short name" value={cat.shortName} error={errors.shortName} hint="Used in phrases like “AI projects”" onChange={(shortName) => set({ shortName })} />
          ) : (
            <Text id="fullName" label="Full name" value={deg.fullName} error={errors.fullName} onChange={(fullName) => set({ fullName })} />
          )}
        </div>
        {props.kind === "category" ? (
          <>
            <Area id="description" label="Short description" rows={2} maxLength={400} value={cat.description} onChange={(description) => set({ description })} />
            <div className="grid gap-4 md:grid-cols-4">
              <Text id="price" label="Starting price (₹)" type="number" value={cat.priceFrom} onChange={(x) => set({ priceFrom: Math.max(0, Math.round(Number(x) || 0)) })} />
              <Select id="icon" label="Icon" value={cat.icon} options={ICON_KEYS.map((k) => ({ value: k, label: k }))} onChange={(icon) => set({ icon })} />
              <Select id="accent" label="Accent colour" value={cat.accent} options={ACCENTS.map((a) => ({ value: a, label: a }))} onChange={(accent) => set({ accent })} />
              <Select
                id="wa"
                label="WhatsApp route"
                value={cat.whatsappRoute}
                options={WHATSAPP_NUMBER_TYPES.map((n) => ({ value: n, label: WHATSAPP_NUMBER_LABEL[n] }))}
                onChange={(whatsappRoute) => set({ whatsappRoute })}
              />
            </div>
            <Tags id="examples" label="Examples" value={cat.examples} onChange={(examples) => set({ examples })} />
            <Toggle label="AI category" checked={cat.isAI} onChange={(isAI) => set({ isAI })} hint="Search treats “AI” queries as this category." />
          </>
        ) : (
          <Area id="shortIntro" label="Short intro" rows={2} maxLength={400} value={deg.shortIntro} onChange={(shortIntro) => set({ shortIntro })} />
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="order" label="Display order" type="number" value={v.order} onChange={(x) => set({ order: Math.max(0, Math.round(Number(x) || 0)) })} />
          <Toggle label="Published" checked={v.published} onChange={(published) => set({ published })} />
        </div>
      </FormSection>

      <FormSection title="Page content" description="Genuinely useful guidance shown on the hub page (helps students and SEO). Blank line = new paragraph.">
        <Area id="intro" label="Intro paragraph" rows={3} maxLength={2000} value={v.content.intro} onChange={(intro) => set({ content: { ...v.content, intro } })} />
        <Repeater
          label="Sections"
          items={v.content.sections}
          onChange={(sections) => set({ content: { ...v.content, sections } })}
          create={() => ({ heading: "", body: "" })}
          addLabel="Add section"
          max={20}
          render={(it, up, i) => (
            <div className="grid gap-3">
              <Text id={`sh-${i}`} label="Heading" value={it.heading} onChange={(heading) => up({ heading })} />
              <Area id={`sb-${i}`} label="Body" rows={4} value={it.body} onChange={(body) => up({ body })} />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="FAQs">
        <Repeater
          label="Questions"
          items={v.faqs}
          onChange={(faqs) => set({ faqs })}
          create={() => ({ question: "", answer: "" })}
          addLabel="Add FAQ"
          max={30}
          render={(it, up, i) => (
            <div className="grid gap-3">
              <Text id={`fq-${i}`} label="Question" value={it.question} onChange={(question) => up({ question })} />
              <Area id={`fa-${i}`} label="Answer" rows={2} value={it.answer} onChange={(answer) => up({ answer })} />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="SEO" description="Leave blank for automatic defaults.">
        <Text id="seo-title" label="SEO title" value={v.seo.title} maxLength={120} idealLength={TITLE_MAX} onChange={(title) => set({ seo: { ...v.seo, title } })} />
        <Area id="seo-desc" label="Meta description" rows={2} maxLength={320} idealLength={DESCRIPTION_MAX} value={v.seo.description} onChange={(description) => set({ seo: { ...v.seo, description } })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="seo-og" label="OG image URL" value={v.seo.ogImage} error={errors["seo.ogImage"]} onChange={(ogImage) => set({ seo: { ...v.seo, ogImage } })} />
          <Toggle label="noindex" checked={v.seo.noindex} onChange={(noindex) => set({ seo: { ...v.seo, noindex } })} />
        </div>
      </FormSection>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-70">
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Save
        </button>
      </div>
    </form>
  );
}
