/** Client-safe enums shared by models, validation and UI. */

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const PROJECT_LEVELS = ["final", "semi-final", "both"] as const;
export type ProjectLevel = (typeof PROJECT_LEVELS)[number];
export const LEVEL_LABEL: Record<ProjectLevel, string> = {
  final: "Final year",
  "semi-final": "Semi-final year",
  both: "Final & semi-final year",
};

export const PLATFORMS = ["web", "mobile", "desktop", "cross"] as const;
export type Platform = (typeof PLATFORMS)[number];
export const PLATFORM_LABEL: Record<Platform, string> = {
  web: "Web",
  mobile: "Mobile",
  desktop: "Desktop",
  cross: "Web + Mobile",
};

export const PROJECT_STATUSES = ["draft", "published", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "FOLLOW_UP",
  "PURCHASED",
  "COMPLETED",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow-up",
  PURCHASED: "Purchased",
  COMPLETED: "Completed",
  LOST: "Lost",
};

export const LEAD_SOURCES = ["whatsapp", "custom_form", "contact", "manual", "other"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const REQUEST_STATUSES = ["new", "reviewed", "converted", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const ADMIN_ROLES = ["viewer", "editor", "admin", "owner"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ACCENTS = ["iris", "cyan", "amber", "rose", "emerald", "violet"] as const;
export type Accent = (typeof ACCENTS)[number];

export const FAQ_SCOPES = ["home", "global", "custom-project", "documentation"] as const;
export type FaqScope = (typeof FAQ_SCOPES)[number];

export const DEVICE_TYPES = ["mobile", "tablet", "desktop", "unknown"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export const STUDY_YEARS = ["final", "semi-final", "other"] as const;
export const YEAR_LABEL: Record<(typeof STUDY_YEARS)[number], string> = {
  final: "Final year",
  "semi-final": "Semi-final year",
  other: "Other",
};

/** Slugs that may never be used for degrees, categories or projects (they share /projects/[slug]). */
export const RESERVED_SLUGS = ["compare", "search", "page", "all", "new", "admin", "api", "edit", "finder"];

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
