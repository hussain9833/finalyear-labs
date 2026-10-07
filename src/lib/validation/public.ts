import { z } from "zod";
import { STUDY_YEARS } from "@/lib/constants";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+?\d{10,15}$/, "Enter a valid phone number with country code if outside India"));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .optional()
    .transform((v) => (v ? v : undefined));

const slugish = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/)
  .optional()
  .transform((v) => (v ? v : undefined));

export const customRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(160),
  phone,
  whatsapp: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/[\s()-]/g, "") : undefined))
    .pipe(z.string().regex(/^\+?\d{10,15}$/, "Enter a valid WhatsApp number").optional()),
  degree: slugish,
  year: z.enum(STUDY_YEARS).optional().catch(undefined),
  category: slugish,
  technology: optionalText(200),
  features: z.string().trim().min(10, "Tell us a little about the features you need").max(3000),
  aiRequired: z
    .union([z.literal("on"), z.literal("true"), z.literal("yes"), z.literal("")])
    .optional()
    .transform((v) => v === "on" || v === "true" || v === "yes"),
  budget: optionalText(60),
  deadline: optionalText(60),
  additional: optionalText(3000),
  consent: z.literal("on", { error: "Please agree so we can contact you about your request" }),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional(),
});

export type CustomRequestInput = z.infer<typeof customRequestSchema>;

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Submitted values echoed back so React's post-action form reset doesn't wipe user input. */
  values?: Record<string, string>;
  /** Pre-filled requirements for the "Continue on WhatsApp" step. */
  summary?: { degree?: string; requirements?: string };
};

export function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
