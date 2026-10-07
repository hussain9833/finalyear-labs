import { z } from "zod";
import {
  ACCENTS,
  ADMIN_ROLES,
  DIFFICULTIES,
  FAQ_SCOPES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  PLATFORMS,
  PROJECT_LEVELS,
  PROJECT_STATUSES,
  REQUEST_STATUSES,
  SLUG_PATTERN,
} from "@/lib/constants";
import { WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";

const text = (max: number) => z.string().trim().max(max);
const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** https URLs or site-relative paths only — rejects javascript:, data:, http:. */
export const safeUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\/[^\s]+$/i.test(v), "Use an https:// URL or a /relative path")
  .optional()
  .transform((v) => (v ? v : undefined));

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug is too short")
  .max(80)
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens");

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");
const stringList = (maxItems: number, maxLen: number) =>
  z
    .array(z.string().trim().max(maxLen))
    .max(maxItems)
    .transform((a) => [...new Set(a.filter(Boolean))]);

const faqList = z
  .array(z.object({ question: text(300).min(3), answer: text(3000).min(3) }))
  .max(30)
  .default([]);

const seoSchema = z.object({
  title: optText(120),
  description: optText(320),
  keywords: stringList(20, 60).default([]),
  ogImage: safeUrl,
  canonical: safeUrl,
  noindex: z.boolean().default(false),
  structuredData: z.boolean().default(true),
});

const imageSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .refine((v) => v.startsWith("/") || /^https:\/\//i.test(v), "Use an https:// URL"),
  alt: text(200).default(""),
  width: z.number().int().positive().max(10000).optional(),
  height: z.number().int().positive().max(10000).optional(),
  caption: optText(200),
});

export const projectInputSchema = z.object({
  name: text(120).min(3, "Name is required"),
  slug: slugSchema,
  shortDescription: text(300).min(10, "Add a short description (10+ characters)"),
  description: text(8000).default(""),
  category: objectId,
  categories: z.array(objectId).max(10).default([]),
  degrees: z.array(objectId).max(20).default([]),
  technologies: stringList(20, 40).default([]),
  tags: stringList(30, 40).default([]),
  priceFrom: z.number().int().min(0).max(10_000_000),
  currency: z.literal("INR").default("INR"),
  difficulty: z.enum(DIFFICULTIES),
  level: z.enum(PROJECT_LEVELS),
  platform: z.enum(PLATFORMS),
  isAI: z.boolean(),
  hasAdminPanel: z.boolean(),
  hasAuth: z.boolean(),
  features: z.array(z.object({ title: text(140).min(1), description: text(1200).default("") })).max(40).default([]),
  modules: z
    .array(z.object({ name: text(120).min(1), description: text(1200).default(""), items: stringList(30, 140).default([]) }))
    .max(30)
    .default([]),
  howItWorks: z.array(z.object({ title: text(140).min(1), description: text(1200).default("") })).max(15).default([]),
  whatYouGet: z
    .array(z.object({ title: text(140).min(1), description: text(600).default(""), included: z.boolean().default(true) }))
    .max(20)
    .default([]),
  documentation: z.object({ included: z.boolean(), items: stringList(40, 120).default([]), note: optText(600) }),
  customization: z.object({ available: z.boolean(), options: stringList(30, 140).default([]), note: optText(600) }),
  faqs: faqList,
  thumbnail: imageSchema.optional(),
  screenshots: z.array(imageSchema).max(20).default([]),
  demoUrl: safeUrl,
  videoUrl: safeUrl,
  repoUrl: safeUrl,
  showRepo: z.boolean().default(false),
  featured: z.boolean(),
  status: z.enum(PROJECT_STATUSES),
  sortWeight: z.number().int().min(-1000).max(1000).default(0),
  seo: seoSchema,
});
export type ProjectInput = z.infer<typeof projectInputSchema>;

const hubContent = z.object({
  intro: optText(2000),
  sections: z.array(z.object({ heading: text(160).min(1), body: text(6000).min(1) })).max(20).default([]),
});

export const categoryInputSchema = z.object({
  name: text(80).min(2),
  slug: slugSchema,
  shortName: text(40).min(1),
  description: text(400).default(""),
  priceFrom: z.number().int().min(0).max(10_000_000),
  examples: stringList(15, 80).default([]),
  icon: text(40).min(1),
  accent: z.enum(ACCENTS),
  whatsappRoute: z.enum(WHATSAPP_NUMBER_TYPES),
  isAI: z.boolean(),
  order: z.number().int().min(0).max(1000),
  published: z.boolean(),
  seo: seoSchema,
  content: hubContent,
  faqs: faqList,
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const degreeInputSchema = z.object({
  name: text(40).min(2),
  slug: slugSchema,
  fullName: text(120).min(2),
  shortIntro: text(400).default(""),
  order: z.number().int().min(0).max(1000),
  published: z.boolean(),
  seo: seoSchema,
  content: hubContent,
  faqs: faqList,
});
export type DegreeInput = z.infer<typeof degreeInputSchema>;

export const testimonialInputSchema = z.object({
  name: text(80).min(2),
  degree: optText(40),
  college: optText(120),
  quote: text(800).min(10),
  rating: z.number().int().min(1).max(5).optional(),
  projectSlug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]*$/)
    .optional()
    .transform((v) => (v ? v : undefined)),
  avatarUrl: safeUrl,
  consent: z.boolean(),
  published: z.boolean(),
  order: z.number().int().min(0).max(1000).default(0),
});

export const faqInputSchema = z.object({
  question: text(300).min(3),
  answer: text(3000).min(3),
  scope: z.enum(FAQ_SCOPES),
  order: z.number().int().min(0).max(1000).default(0),
  published: z.boolean(),
});

export const leadInputSchema = z.object({
  name: optText(100),
  phone: optText(20),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().email("Invalid email").optional()),
  degree: optText(60),
  project: optText(120),
  category: optText(80),
  whatsappType: z.enum(WHATSAPP_NUMBER_TYPES).optional().catch(undefined),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES),
  note: optText(2000),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  note: optText(2000),
});

export const requestStatusSchema = z.enum(REQUEST_STATUSES);

export const adminUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  name: text(80).default(""),
  role: z.enum(ADMIN_ROLES),
  password: z.string().min(8, "Password must be at least 8 characters").max(200).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(160),
  password: z.string().min(1, "Enter your password").max(200),
  next: z.string().max(200).optional(),
});
