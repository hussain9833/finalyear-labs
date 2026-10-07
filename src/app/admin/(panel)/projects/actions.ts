"use server";

import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Project } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { projectInputSchema } from "@/lib/validation/admin";
import { assertSlugAvailable } from "@/lib/services/slugs";
import { refreshCatalog, toActionError, type ActionResult } from "@/lib/services/action-result";

/** Create or update. The client sends the whole form as JSON (nested arrays) — validated here with Zod. */
export async function saveProject(id: string | null, payload: string): Promise<ActionResult<{ id: string }>> {
  try {
    const admin = await requireAdmin("catalog.edit");
    const input = projectInputSchema.parse(JSON.parse(payload));
    await connectDB();

    // Editors can draft; publishing/featuring requires the publish permission.
    const mayPublish = can(admin.role, "catalog.publish");
    const existing = id ? (isValidObjectId(id) ? await Project.findById(id) : null) : null;
    if (id && !existing) return { ok: false, error: "Project not found." };
    if (!mayPublish) {
      input.status = existing && existing.status !== "draft" ? (existing.status as typeof input.status) : "draft";
      input.featured = existing?.featured ?? false;
    }

    await assertSlugAvailable(input.slug, existing ? { kind: "project", id: existing._id } : undefined);
    const categories = [...new Set([input.category, ...input.categories])];

    if (existing) {
      const oldSlug = existing.slug;
      existing.set({ ...input, categories });
      if (input.status === "published" && !existing.publishedAt) existing.publishedAt = new Date();
      await existing.save();
      refreshCatalog(oldSlug, input.slug);
      return { ok: true, message: "Project saved.", data: { id: String(existing._id) } };
    }
    const created = await Project.create({ ...input, categories });
    refreshCatalog(input.slug);
    return { ok: true, message: "Project created.", data: { id: String(created._id) } };
  } catch (error) {
    return toActionError(error);
  }
}

export async function setProjectFlags(id: string, flags: { status?: "draft" | "published" | "archived"; featured?: boolean }): Promise<ActionResult> {
  try {
    await requireAdmin("catalog.publish");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid project." };
    await connectDB();
    const project = await Project.findById(id);
    if (!project) return { ok: false, error: "Project not found." };
    if (flags.status) {
      project.status = flags.status;
      if (flags.status === "published" && !project.publishedAt) project.publishedAt = new Date();
    }
    if (typeof flags.featured === "boolean") project.featured = flags.featured;
    await project.save();
    refreshCatalog(project.slug);
    return { ok: true, message: "Updated." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin("catalog.delete");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid project." };
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (project) refreshCatalog(project.slug);
    return { ok: true, message: "Project deleted." };
  } catch (error) {
    return toActionError(error);
  }
}
