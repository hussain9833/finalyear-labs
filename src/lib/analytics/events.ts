/** Client-safe event schema — the single definition of every first-party analytics event. */
import { z } from "zod";
import { CTA_LOCATIONS } from "@/lib/whatsapp/types";

const slug = z.string().trim().max(120).regex(/^[a-z0-9-]*$/);
const shortText = z.string().trim().max(120);

export const EVENT_SCHEMAS = {
  project_view: z.object({ projectSlug: slug, category: slug.optional() }),
  project_demo_click: z.object({ projectSlug: slug, ctaLocation: z.enum(CTA_LOCATIONS).optional() }),
  project_compare: z.object({ projectSlugs: z.array(slug).min(1).max(3) }),
  search: z.object({ query: shortText, results: z.number().int().min(0).max(10000) }),
  filter_used: z.object({ filter: z.string().max(30), value: shortText }),
  custom_project_submit: z.object({ category: slug.optional(), degree: slug.optional() }),
  degree_selected: z.object({ degree: slug, ctaLocation: shortText.optional() }),
  category_selected: z.object({ category: slug, ctaLocation: shortText.optional() }),
  cta_click: z.object({ cta: shortText, ctaLocation: shortText.optional(), target: z.string().max(200).optional() }),
  finder_submit: z.object({ degree: slug.optional(), category: slug.optional(), results: z.number().int().min(0).max(1000) }),
} as const;

export type EventName = keyof typeof EVENT_SCHEMAS;
export type EventProps<N extends EventName> = z.infer<(typeof EVENT_SCHEMAS)[N]>;
export const EVENT_NAMES = Object.keys(EVENT_SCHEMAS) as EventName[];

export const eventEnvelopeSchema = z.object({
  name: z.enum(EVENT_NAMES as [EventName, ...EventName[]]),
  props: z.record(z.string(), z.unknown()).default({}),
  path: z.string().max(300).startsWith("/").optional(),
});

export function parseEvent(input: unknown) {
  const env = eventEnvelopeSchema.safeParse(input);
  if (!env.success) return null;
  const props = EVENT_SCHEMAS[env.data.name].safeParse(env.data.props);
  if (!props.success) return null;
  return { name: env.data.name, props: props.data as Record<string, unknown>, path: env.data.path };
}
