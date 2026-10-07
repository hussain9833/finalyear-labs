"use server";

import { headers } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Lead, ProjectRequest } from "@/lib/db/models";
import { getRequestContext, recordEvent } from "@/lib/analytics/server";
import { attributionToUtm } from "@/lib/analytics/attribution";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { customRequestSchema, zodErrors, type FormState } from "@/lib/validation/public";

export async function submitCustomRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  // Honeypot filled (bots) → pretend success, store nothing.
  if (typeof raw.website === "string" && raw.website.length > 0) return { ok: true, message: "Thanks! We'll be in touch soon." };

  const parsed = customRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: zodErrors(parsed.error), values: echo(raw) };
  }
  const data = parsed.data;

  const h = await headers();
  const limited = await rateLimit("custom_request", clientIp(h));
  if (!limited.ok) return { ok: false, message: "Too many requests, please try again in a little while.", values: echo(raw) };

  const ctx = await getRequestContext();
  const utm = attributionToUtm(ctx.attribution);

  try {
    await connectDB();
    const request = await ProjectRequest.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      degree: data.degree,
      year: data.year,
      category: data.category,
      technology: data.technology,
      features: data.features,
      aiRequired: data.aiRequired,
      budget: data.budget,
      deadline: data.deadline,
      additional: data.additional,
      utm,
      referrer: ctx.attribution.ref,
      landingPage: ctx.attribution.lp,
    });
    const lead = await Lead.create({
      name: data.name,
      phone: data.whatsapp ?? data.phone,
      email: data.email,
      degree: data.degree,
      category: data.category,
      source: "custom_form",
      status: "NEW",
      utm,
      referrer: ctx.attribution.ref,
      landingPage: ctx.attribution.lp,
      requestId: request._id,
    });
    request.leadId = lead._id;
    await request.save();
  } catch (error) {
    console.error("[custom-request] failed", error);
    return { ok: false, message: "Something went wrong saving your request. Please try again or contact us on WhatsApp.", values: echo(raw) };
  }

  await recordEvent({ name: "custom_project_submit", props: { category: data.category, degree: data.degree }, path: "/custom-project" }, ctx);

  return {
    ok: true,
    message: "Thanks! Your request has been received. We'll contact you shortly.",
    summary: {
      degree: data.degree,
      requirements: [data.category, data.technology, data.features].filter(Boolean).join(" — ").slice(0, 450),
    },
  };
}

function echo(raw: Record<string, FormDataEntryValue>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) if (typeof v === "string" && k !== "website" && !k.startsWith("$")) out[k] = v.slice(0, 3000);
  return out;
}
