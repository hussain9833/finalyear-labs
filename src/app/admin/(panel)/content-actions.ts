"use server";

import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Faq, Testimonial } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/dal";
import { can } from "@/lib/auth/rbac";
import { faqInputSchema, testimonialInputSchema } from "@/lib/validation/admin";
import { refreshTag, toActionError, type ActionResult } from "@/lib/services/action-result";
import { TAGS } from "@/lib/data/tags";

export async function saveTestimonial(id: string | null, payload: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin("content.edit");
    const input = testimonialInputSchema.parse(JSON.parse(payload));
    if (!can(admin.role, "content.publish")) input.published = false;
    // Never publish a testimonial without the student's consent.
    if (input.published && !input.consent) return { ok: false, error: "A testimonial can only be published with the student's consent.", fieldErrors: { consent: "Consent required to publish" } };
    await connectDB();
    if (id) {
      if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
      await Testimonial.findByIdAndUpdate(id, input, { runValidators: true });
    } else await Testimonial.create(input);
    refreshTag(TAGS.testimonials);
    return { ok: true, message: "Testimonial saved." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireAdmin("content.publish");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await connectDB();
    await Testimonial.findByIdAndDelete(id);
    refreshTag(TAGS.testimonials);
    return { ok: true, message: "Deleted." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function saveFaq(id: string | null, payload: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin("content.edit");
    const input = faqInputSchema.parse(JSON.parse(payload));
    if (!can(admin.role, "content.publish")) input.published = false;
    await connectDB();
    if (id) {
      if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
      await Faq.findByIdAndUpdate(id, input, { runValidators: true });
    } else await Faq.create(input);
    refreshTag(TAGS.faqs);
    return { ok: true, message: "FAQ saved." };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    await requireAdmin("content.publish");
    if (!isValidObjectId(id)) return { ok: false, error: "Invalid id." };
    await connectDB();
    await Faq.findByIdAndDelete(id);
    refreshTag(TAGS.faqs);
    return { ok: true, message: "Deleted." };
  } catch (error) {
    return toActionError(error);
  }
}
