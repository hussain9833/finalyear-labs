"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save, Wand2 } from "lucide-react";
import { saveProject } from "@/app/admin/(panel)/projects/actions";
import { DIFFICULTIES, DIFFICULTY_LABEL, LEVEL_LABEL, PLATFORMS, PLATFORM_LABEL, PROJECT_LEVELS, PROJECT_STATUSES } from "@/lib/constants";
import { projectTitle, DESCRIPTION_MAX, TITLE_MAX } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { slugify, truncate } from "@/lib/utils";
import type { ProjectInput } from "@/lib/validation/admin";
import { Area, CheckboxGroup, FormSection, Lines, Repeater, Select, Tags, Text, Toggle } from "./form-kit";

type Opt = { value: string; label: string };
export type ProjectFormValues = ProjectInput;

export function ProjectForm({
  id,
  initial,
  categories,
  degrees,
  canPublish,
}: {
  id: string | null;
  initial: ProjectFormValues;
  categories: Opt[];
  degrees: Opt[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<ProjectFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [pending, start] = useTransition();
  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) => setV((s) => ({ ...s, [key]: value }));

  const degreeNames = useMemo(() => degrees.filter((d) => v.degrees.includes(d.value)).map((d) => ({ name: d.label })), [degrees, v.degrees]);
  const autoTitle = projectTitle({ name: v.name || "Project name", degrees: degreeNames.map((d) => ({ ...d, slug: "" })) });
  const shownTitle = v.seo.title || autoTitle;
  const shownDescription = v.seo.description || truncate(v.shortDescription || "Short description…", DESCRIPTION_MAX);

  function submit() {
    start(async () => {
      const res = await saveProject(id, JSON.stringify(v));
      if (res.ok) {
        setErrors({});
        toast.success(res.message ?? "Saved");
        if (!id && res.data?.id) router.replace(`/admin/projects/${res.data.id}`);
        else router.refresh();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="grid gap-6 pb-24"
    >
      <FormSection title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Text
            id="name"
            label="Project name"
            value={v.name}
            error={errors.name}
            maxLength={120}
            onChange={(name) => setV((s) => ({ ...s, name, slug: slugTouched ? s.slug : slugify(name) }))}
          />
          <Text
            id="slug"
            label="URL slug"
            value={v.slug}
            error={errors.slug}
            hint={`/projects/${v.slug || "…"} — must be unique across projects, degrees and categories`}
            onChange={(slug) => {
              setSlugTouched(true);
              set("slug", slug.toLowerCase());
            }}
          />
        </div>
        <Area id="shortDescription" label="Short description" rows={2} maxLength={300} idealLength={160} value={v.shortDescription} error={errors.shortDescription} onChange={(x) => set("shortDescription", x)} hint="Shown on cards and used for the default meta description." />
        <Area id="description" label="Full description" rows={6} maxLength={8000} value={v.description} onChange={(x) => set("description", x)} hint="Blank line = new paragraph." />
      </FormSection>

      <FormSection title="Classification">
        <div className="grid gap-4 md:grid-cols-2">
          <Select id="category" label="Primary category" value={v.category} placeholder="Select…" options={categories} error={errors.category} onChange={(x) => set("category", x)} />
          <Text id="priceFrom" label="Starting price (₹)" type="number" value={v.priceFrom} error={errors.priceFrom} onChange={(x) => set("priceFrom", Math.max(0, Math.round(Number(x) || 0)))} />
        </div>
        <CheckboxGroup label="Additional categories" options={categories.filter((c) => c.value !== v.category)} value={v.categories.filter((c) => c !== v.category)} onChange={(x) => set("categories", x)} />
        <CheckboxGroup label="Suitable degrees" options={degrees} value={v.degrees} onChange={(x) => set("degrees", x)} />
        <Tags id="technologies" label="Technologies" value={v.technologies} placeholder="Next.js, MongoDB, OpenAI API" onChange={(x) => set("technologies", x)} />
        <Tags id="tags" label="Search tags" value={v.tags} placeholder="resume, nlp, career" onChange={(x) => set("tags", x)} hint="Comma-separated. Helps search; not shown publicly." />
        <div className="grid gap-4 md:grid-cols-3">
          <Select id="difficulty" label="Difficulty" value={v.difficulty} options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))} onChange={(x) => set("difficulty", x)} />
          <Select id="level" label="Level" value={v.level} options={PROJECT_LEVELS.map((d) => ({ value: d, label: LEVEL_LABEL[d] }))} onChange={(x) => set("level", x)} />
          <Select id="platform" label="Platform" value={v.platform} options={PLATFORMS.map((d) => ({ value: d, label: PLATFORM_LABEL[d] }))} onChange={(x) => set("platform", x)} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle label="AI-integrated" checked={v.isAI} onChange={(x) => set("isAI", x)} hint="Shows the AI badge and routes WhatsApp AI templates." />
          <Toggle label="Admin panel" checked={v.hasAdminPanel} onChange={(x) => set("hasAdminPanel", x)} />
          <Toggle label="Authentication" checked={v.hasAuth} onChange={(x) => set("hasAuth", x)} />
        </div>
      </FormSection>

      <FormSection title="Features & modules">
        <Repeater
          label="Features"
          items={v.features}
          onChange={(x) => set("features", x)}
          create={() => ({ title: "", description: "" })}
          addLabel="Add feature"
          render={(it, up, i) => (
            <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
              <Text id={`f-t-${i}`} label="Title" value={it.title} onChange={(title) => up({ title })} />
              <Text id={`f-d-${i}`} label="Description" value={it.description} onChange={(description) => up({ description })} />
            </div>
          )}
        />
        <Repeater
          label="Modules"
          items={v.modules}
          onChange={(x) => set("modules", x)}
          create={() => ({ name: "", description: "", items: [] })}
          addLabel="Add module"
          render={(it, up, i) => (
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
                <Text id={`m-n-${i}`} label="Module name" value={it.name} onChange={(name) => up({ name })} />
                <Text id={`m-d-${i}`} label="Description" value={it.description} onChange={(description) => up({ description })} />
              </div>
              <Lines id={`m-i-${i}`} label="Parts / sub-features" rows={3} value={it.items} onChange={(items) => up({ items })} />
            </div>
          )}
        />
        <Repeater
          label="How it works (steps)"
          items={v.howItWorks}
          onChange={(x) => set("howItWorks", x)}
          create={() => ({ title: "", description: "" })}
          addLabel="Add step"
          max={15}
          render={(it, up, i) => (
            <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
              <Text id={`h-t-${i}`} label="Step" value={it.title} onChange={(title) => up({ title })} />
              <Text id={`h-d-${i}`} label="Description" value={it.description} onChange={(description) => up({ description })} />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="What you get, documentation & customization">
        <Repeater
          label="What you get"
          items={v.whatYouGet}
          onChange={(x) => set("whatYouGet", x)}
          create={() => ({ title: "", description: "", included: true })}
          addLabel="Add item"
          max={20}
          render={(it, up, i) => (
            <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end">
              <Text id={`w-t-${i}`} label="Item" value={it.title} onChange={(title) => up({ title })} />
              <Text id={`w-d-${i}`} label="Description" value={it.description} onChange={(description) => up({ description })} />
              <Toggle label="Included" checked={it.included} onChange={(included) => up({ included })} />
            </div>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <Toggle label="Documentation template included" checked={v.documentation.included} onChange={(included) => set("documentation", { ...v.documentation, included })} />
            <Lines id="doc-items" label="Documentation sections" value={v.documentation.items} onChange={(items) => set("documentation", { ...v.documentation, items })} placeholder={"Abstract\nIntroduction\nSystem design"} />
            <Area id="doc-note" label="Documentation note" rows={2} value={v.documentation.note} onChange={(note) => set("documentation", { ...v.documentation, note })} />
          </div>
          <div className="grid gap-3">
            <Toggle label="Customization available" checked={v.customization.available} onChange={(available) => set("customization", { ...v.customization, available })} />
            <Lines id="cust-options" label="Customization options" value={v.customization.options} onChange={(options) => set("customization", { ...v.customization, options })} />
            <Area id="cust-note" label="Customization note" rows={2} value={v.customization.note} onChange={(note) => set("customization", { ...v.customization, note })} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Media & links" description="Use https URLs (e.g. Cloudflare R2 / CDN). Add the host to NEXT_PUBLIC_ASSET_HOSTS for image optimization.">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Text id="thumb" label="Thumbnail URL" value={v.thumbnail?.url} error={errors["thumbnail.url"]} onChange={(url) => set("thumbnail", url ? { alt: "", caption: undefined, ...v.thumbnail, url } : undefined)} />
          <Text id="thumb-alt" label="Thumbnail alt text" value={v.thumbnail?.alt} hint="Describe what the image shows." onChange={(alt) => v.thumbnail && set("thumbnail", { ...v.thumbnail, alt })} />
        </div>
        <Repeater
          label="Screenshots"
          items={v.screenshots}
          onChange={(x) => set("screenshots", x)}
          create={() => ({ url: "", alt: "", caption: undefined })}
          addLabel="Add screenshot"
          max={20}
          render={(it, up, i) => (
            <div className="grid gap-3 md:grid-cols-3">
              <Text id={`s-u-${i}`} label="Image URL" value={it.url} error={errors[`screenshots.${i}.url`]} onChange={(url) => up({ url })} />
              <Text id={`s-a-${i}`} label="Alt text" value={it.alt} onChange={(alt) => up({ alt })} />
              <Text id={`s-c-${i}`} label="Caption" value={it.caption} onChange={(caption) => up({ caption })} />
            </div>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="demo" label="Live demo URL" value={v.demoUrl} error={errors.demoUrl} onChange={(x) => set("demoUrl", x)} />
          <Text id="video" label="Video URL (YouTube/Vimeo)" value={v.videoUrl} error={errors.videoUrl} onChange={(x) => set("videoUrl", x)} />
          <Text id="repo" label="Repository URL (private by default)" value={v.repoUrl} error={errors.repoUrl} onChange={(x) => set("repoUrl", x)} />
          <Toggle label="Show repository link publicly" checked={v.showRepo} onChange={(x) => set("showRepo", x)} hint="Leave off for private source repositories." />
        </div>
      </FormSection>

      <FormSection title="FAQs" description="Shown on the project page and emitted as FAQPage structured data.">
        <Repeater
          label="Questions"
          items={v.faqs}
          onChange={(x) => set("faqs", x)}
          create={() => ({ question: "", answer: "" })}
          addLabel="Add FAQ"
          max={30}
          render={(it, up, i) => (
            <div className="grid gap-3">
              <Text id={`q-${i}`} label="Question" value={it.question} onChange={(question) => up({ question })} />
              <Area id={`a-${i}`} label="Answer" rows={2} value={it.answer} onChange={(answer) => up({ answer })} />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="SEO" description="Leave blank to use sensible automatic defaults.">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Search preview</p>
          <p className="mt-1 truncate text-xs text-success">{`${siteConfig.url.replace(/^https?:\/\//, "")} › projects › ${v.slug || "…"}`}</p>
          <p className="truncate text-lg text-primary">{shownTitle}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{shownDescription}</p>
        </div>
        <Text id="seo-title" label="SEO title" value={v.seo.title} maxLength={120} idealLength={TITLE_MAX} placeholder={autoTitle} onChange={(title) => set("seo", { ...v.seo, title })} />
        <Area id="seo-desc" label="Meta description" rows={2} value={v.seo.description} maxLength={320} idealLength={DESCRIPTION_MAX} placeholder="Auto-generated from the short description, stack and degrees" onChange={(description) => set("seo", { ...v.seo, description })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="seo-og" label="OG image URL" value={v.seo.ogImage} error={errors["seo.ogImage"]} hint="Defaults to a generated social card." onChange={(ogImage) => set("seo", { ...v.seo, ogImage })} />
          <Text id="seo-canonical" label="Canonical URL override" value={v.seo.canonical} error={errors["seo.canonical"]} hint="Only if this content lives at another URL." onChange={(canonical) => set("seo", { ...v.seo, canonical })} />
        </div>
        <Tags id="seo-keywords" label="Keywords (optional)" value={v.seo.keywords} onChange={(keywords) => set("seo", { ...v.seo, keywords })} />
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle label="noindex" checked={v.seo.noindex} onChange={(noindex) => set("seo", { ...v.seo, noindex })} hint="Hide from search engines and the sitemap." />
          <Toggle label="Product structured data" checked={v.seo.structuredData} onChange={(structuredData) => set("seo", { ...v.seo, structuredData })} hint="Emit Product/Offer JSON-LD." />
        </div>
      </FormSection>

      <FormSection title="Publishing">
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            id="status"
            label="Status"
            value={v.status}
            options={PROJECT_STATUSES.map((s) => ({ value: s, label: s[0]!.toUpperCase() + s.slice(1) }))}
            onChange={(x) => set("status", x)}
          />
          <Text id="sortWeight" label="Sort weight" type="number" value={v.sortWeight} hint="Higher shows first in Recommended." onChange={(x) => set("sortWeight", Math.round(Number(x) || 0))} />
          <Toggle label="Featured" checked={v.featured} onChange={(x) => set("featured", x)} disabled={!canPublish} />
        </div>
        {!canPublish && <p className="text-sm text-muted-foreground">Your role can save drafts. An admin publishes and features projects.</p>}
      </FormSection>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur lg:left-64">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <p className="hidden text-sm text-muted-foreground sm:block">
            {Object.keys(errors).length ? <span className="text-destructive">{Object.keys(errors).length} field(s) need attention</span> : id ? "Editing project" : "New project"}
          </p>
          <div className="ml-auto flex gap-2">
            {!v.seo.description && v.shortDescription && (
              <button type="button" onClick={() => set("seo", { ...v.seo, description: truncate(v.shortDescription, DESCRIPTION_MAX) })} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm hover:bg-muted">
                <Wand2 className="size-4" aria-hidden /> Fill meta description
              </button>
            )}
            <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-70">
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
