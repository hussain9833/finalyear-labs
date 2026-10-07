import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  ADMIN_ROLES,
  DEVICE_TYPES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  REQUEST_STATUSES,
  STUDY_YEARS,
} from "@/lib/constants";
import { CTA_LOCATIONS, WHATSAPP_INTENTS, WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";
import { utmSchema } from "./shared";

/* --------------------------------- Lead ---------------------------------- */

const noteSchema = new Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    author: { type: String, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: true },
);

const leadSchema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    degree: { type: String, trim: true, maxlength: 60 },
    project: { type: String, trim: true, maxlength: 120 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    category: { type: String, trim: true, maxlength: 80 },
    whatsappType: { type: String, enum: WHATSAPP_NUMBER_TYPES },
    source: { type: String, enum: LEAD_SOURCES, default: "manual" },
    utm: { type: utmSchema, default: () => ({}) },
    referrer: { type: String, trim: true, maxlength: 200 },
    landingPage: { type: String, trim: true, maxlength: 300 },
    status: { type: String, enum: LEAD_STATUSES, default: "NEW" },
    notes: { type: [noteSchema], default: [] },
    requestId: { type: Schema.Types.ObjectId, ref: "ProjectRequest" },
    lastContactedAt: Date,
    assignedTo: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ source: 1, createdAt: -1 });
leadSchema.index({ project: 1 });

export type LeadDoc = InferSchemaType<typeof leadSchema>;
export const Lead: Model<LeadDoc> = models.Lead || model("Lead", leadSchema);

/* ---------------------------- Project request ---------------------------- */

const projectRequestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    whatsapp: { type: String, trim: true, maxlength: 20 },
    degree: { type: String, trim: true, maxlength: 60 },
    year: { type: String, enum: STUDY_YEARS },
    category: { type: String, trim: true, maxlength: 80 },
    technology: { type: String, trim: true, maxlength: 200 },
    features: { type: String, trim: true, maxlength: 3000 },
    aiRequired: { type: Boolean, default: false },
    budget: { type: String, trim: true, maxlength: 60 },
    deadline: { type: String, trim: true, maxlength: 60 },
    additional: { type: String, trim: true, maxlength: 3000 },
    status: { type: String, enum: REQUEST_STATUSES, default: "new" },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    utm: { type: utmSchema, default: () => ({}) },
    referrer: { type: String, trim: true, maxlength: 200 },
    landingPage: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true },
);
projectRequestSchema.index({ status: 1, createdAt: -1 });

export type ProjectRequestDoc = InferSchemaType<typeof projectRequestSchema>;
export const ProjectRequest: Model<ProjectRequestDoc> =
  models.ProjectRequest || model("ProjectRequest", projectRequestSchema);

/* ----------------------------- WhatsApp event ---------------------------- */
// A WhatsApp CTA click = lead intent. It is NOT a sale.

const whatsappEventSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    projectSlug: { type: String, trim: true },
    projectName: { type: String, trim: true },
    category: { type: String, trim: true },
    degree: { type: String, trim: true },
    intent: { type: String, enum: WHATSAPP_INTENTS, required: true },
    whatsappNumberType: { type: String, enum: WHATSAPP_NUMBER_TYPES, required: true },
    sourcePage: { type: String, trim: true, maxlength: 300 },
    ctaLocation: { type: String, enum: CTA_LOCATIONS, required: true },
    deviceType: { type: String, enum: DEVICE_TYPES, default: "unknown" },
    referrer: { type: String, trim: true, maxlength: 200 },
    utm: { type: utmSchema, default: () => ({}) },
    sessionId: { type: String, trim: true, maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
whatsappEventSchema.index({ createdAt: -1 });
whatsappEventSchema.index({ projectSlug: 1, createdAt: -1 });
whatsappEventSchema.index({ category: 1, createdAt: -1 });
whatsappEventSchema.index({ degree: 1, createdAt: -1 });
whatsappEventSchema.index({ ctaLocation: 1, createdAt: -1 });
whatsappEventSchema.index({ whatsappNumberType: 1, createdAt: -1 });
whatsappEventSchema.index({ "utm.source": 1, createdAt: -1 });
whatsappEventSchema.index({ "utm.campaign": 1, createdAt: -1 });

export type WhatsAppEventDoc = InferSchemaType<typeof whatsappEventSchema>;
export const WhatsAppEvent: Model<WhatsAppEventDoc> =
  models.WhatsAppEvent || model("WhatsAppEvent", whatsappEventSchema);

/* ---------------------------- Analytics event ---------------------------- */

const analyticsEventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    props: { type: Schema.Types.Mixed, default: {} },
    path: { type: String, trim: true, maxlength: 300 },
    deviceType: { type: String, enum: DEVICE_TYPES, default: "unknown" },
    utm: { type: utmSchema, default: () => ({}) },
    referrer: { type: String, trim: true, maxlength: 200 },
    sessionId: { type: String, trim: true, maxlength: 64 },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
analyticsEventSchema.index({ name: 1, createdAt: -1 });
analyticsEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AnalyticsEventDoc = InferSchemaType<typeof analyticsEventSchema>;
export const AnalyticsEvent: Model<AnalyticsEventDoc> =
  models.AnalyticsEvent || model("AnalyticsEvent", analyticsEventSchema);

/* --------------------------------- Admin --------------------------------- */

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true, maxlength: 80, default: "" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: "editor" },
    active: { type: Boolean, default: true },
    sessionVersion: { type: Number, default: 1 },
    lastLoginAt: Date,
    failedLogins: { type: Number, default: 0 },
    lockedUntil: Date,
  },
  { timestamps: true },
);

export type AdminDoc = InferSchemaType<typeof adminSchema>;
export const Admin: Model<AdminDoc> = models.Admin || model("Admin", adminSchema);

/* ------------------------------- Rate limit ------------------------------ */

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<InferSchemaType<typeof rateLimitSchema>> =
  models.RateLimit || model("RateLimit", rateLimitSchema);
