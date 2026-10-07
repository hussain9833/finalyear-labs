"use server";

import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Lead, ProjectRequest } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/dal";
import { leadInputSchema, leadUpdateSchema, requestStatusSchema } from "@/lib/validation/admin";
import { toActionError, type ActionResult } from "@/lib/services/action-result";

export async function createLead(payload: string): Promise<ActionResult<{ id: string }>> {
  try {
    const admin = await requireAdmin("leads.edit");
    const { note, ...input } = leadInputSchema.parse(JSON.parse(payload));
    await connectDB();
    const lead = await Lead.create({ ...input, notes: note ? [{ body: note, author: admin.email }] : [] });
    return { ok: true, message: "Lead created.", data: { id: String(lead._id) } };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateLead(id: string, payload: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin("leads.edit");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid lead." };
    const { status, note } = leadUpdateSchema.parse(JSON.parse(payload));
    await connectDB();
    const lead = await Lead.findById(id);
    if (!lead) return { ok: false, error: "Lead not found." };
    if (status && status !== lead.status) {
      lead.notes.push({ body: `Status: ${lead.status} → ${status}`, author: admin.email, at: new Date() });
      lead.status = status;
      if (status === "CONTACTED") lead.lastContactedAt = new Date();
    }
    if (note) lead.notes.push({ body: note, author: admin.email, at: new Date() });
    await lead.save();
    return { ok: true, message: "Lead updated." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function setRequestStatus(id: string, status: string): Promise<ActionResult> {
  try {
    await requireAdmin("requests.edit");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid request." };
    const parsed = requestStatusSchema.parse(status);
    await connectDB();
    await ProjectRequest.updateOne({ _id: id }, { $set: { status: parsed } });
    return { ok: true, message: "Request updated." };
  } catch (error) {
    return toActionError(error);
  }
}
