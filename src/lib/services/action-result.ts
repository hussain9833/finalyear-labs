import "server-only";
import { ZodError } from "zod";
import { updateTag } from "next/cache";
import { AuthError } from "@/lib/auth/dal";
import { SlugConflictError } from "./slugs";
import { zodErrors } from "@/lib/validation/public";
import { TAGS } from "@/lib/data/tags";

export type ActionResult<T = undefined> = { ok: true; message?: string; data?: T } | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Maps known errors to user-facing results; logs and hides everything else. */
export function toActionError(error: unknown): ActionResult<never> {
  if (error instanceof AuthError || error instanceof SlugConflictError) return { ok: false, error: error.message };
  if (error instanceof ZodError) {
    const fieldErrors = Object.fromEntries(error.issues.map((i) => [i.path.join("."), i.message]));
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: { ...zodErrors(error), ...fieldErrors } };
  }
  if (error && typeof error === "object" && "code" in error && (error as { code: number }).code === 11000) {
    return { ok: false, error: "That value must be unique — it's already in use." };
  }
  console.error("[admin action]", error);
  return { ok: false, error: "Something went wrong. Please try again." };
}

/** Read-your-own-writes invalidation of public catalog caches after an admin mutation. */
export function refreshCatalog(...projectSlugs: (string | undefined)[]) {
  updateTag(TAGS.catalog);
  for (const slug of projectSlugs) if (slug) updateTag(TAGS.project(slug));
}

export function refreshTag(tag: string) {
  updateTag(tag);
}
