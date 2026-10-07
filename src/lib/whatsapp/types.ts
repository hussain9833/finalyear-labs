/** Client-safe WhatsApp types. Numbers themselves are server-only (see ./config.ts). */

export const WHATSAPP_INTENTS = ["project", "ai_project", "custom", "general", "support", "pricing"] as const;
export type WhatsAppIntent = (typeof WHATSAPP_INTENTS)[number];

export const WHATSAPP_NUMBER_TYPES = ["default", "sales", "ai", "web", "ecommerce", "support", "custom"] as const;
export type WhatsAppNumberType = (typeof WHATSAPP_NUMBER_TYPES)[number];

export const WHATSAPP_NUMBER_LABEL: Record<WhatsAppNumberType, string> = {
  default: "Default",
  sales: "Sales",
  ai: "AI projects",
  web: "Web projects",
  ecommerce: "E-commerce",
  support: "Support",
  custom: "Custom projects",
};

export const CTA_LOCATIONS = [
  "navbar",
  "hero",
  "project_card",
  "project_detail",
  "pricing",
  "custom_project",
  "mobile_sticky",
  "footer",
  "compare",
  "finder",
  "category_page",
  "degree_page",
  "contact_page",
  "faq",
  "cta_band",
  "not_found",
] as const;
export type CtaLocation = (typeof CTA_LOCATIONS)[number];

export const CTA_LOCATION_LABEL: Record<CtaLocation, string> = {
  navbar: "Navbar",
  hero: "Hero",
  project_card: "Project card",
  project_detail: "Project detail",
  pricing: "Pricing card",
  custom_project: "Custom project page",
  mobile_sticky: "Mobile sticky bar",
  footer: "Footer",
  compare: "Compare page",
  finder: "Project finder",
  category_page: "Category page",
  degree_page: "Degree page",
  contact_page: "Contact page",
  faq: "FAQ",
  cta_band: "CTA band",
  not_found: "404 page",
};
