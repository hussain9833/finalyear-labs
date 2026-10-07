"use server";

import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Category, Degree, Project } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/dal";
import { categoryInputSchema, degreeInputSchema } from "@/lib/validation/admin";
import { assertSlugAvailable } from "@/lib/services/slugs";
import { refreshCatalog, toActionError, type ActionResult } from "@/lib/services/action-result";

export async function saveCategory(id: string | null, payload: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin("catalog.publish");
    const input = categoryInputSchema.parse(JSON.parse(payload));
    await connectDB();
    if (id && !isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await assertSlugAvailable(input.slug, id ? { kind: "category", id } : undefined);
    if (id) {
      const updated = await Category.findByIdAndUpdate(id, input, { runValidators: true });
      if (!updated) return { ok: false, error: "Category not found." };
      refreshCatalog();
      return { ok: true, message: "Category saved.", data: { id } };
    }
    const created = await Category.create(input);
    refreshCatalog();
    return { ok: true, message: "Category created.", data: { id: String(created._id) } };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin("catalog.delete");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await connectDB();
    const used = await Project.countDocuments({ categories: id });
    if (used) return { ok: false, error: `This category is used by ${used} project(s). Reassign them or unpublish the category instead.` };
    await Category.findByIdAndDelete(id);
    refreshCatalog();
    return { ok: true, message: "Category deleted." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function saveDegree(id: string | null, payload: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin("catalog.publish");
    const input = degreeInputSchema.parse(JSON.parse(payload));
    await connectDB();
    if (id && !isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await assertSlugAvailable(input.slug, id ? { kind: "degree", id } : undefined);
    if (id) {
      const updated = await Degree.findByIdAndUpdate(id, input, { runValidators: true });
      if (!updated) return { ok: false, error: "Degree not found." };
      refreshCatalog();
      return { ok: true, message: "Degree saved.", data: { id } };
    }
    const created = await Degree.create(input);
    refreshCatalog();
    return { ok: true, message: "Degree created.", data: { id: String(created._id) } };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteDegree(id: string): Promise<ActionResult> {
  try {
    await requireAdmin("catalog.delete");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await connectDB();
    const used = await Project.countDocuments({ degrees: id });
    if (used) return { ok: false, error: `This degree is used by ${used} project(s). Remove it from them or unpublish it instead.` };
    await Degree.findByIdAndDelete(id);
    refreshCatalog();
    return { ok: true, message: "Degree deleted." };
  } catch (error) {
    return toActionError(error);
  }
}
