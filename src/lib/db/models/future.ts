/**
 * Future-ready models (see docs/TECHNICAL_ARCHITECTURE.md §5, §12).
 * Defined so the schema is agreed early; not used by MVP features yet.
 */
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { contentSectionSchema, seoSchema } from "./shared";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    degree: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    emailVerifiedAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const User: Model<InferSchemaType<typeof userSchema>> = models.User || model("User", userSchema);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    couponCode: { type: String, trim: true },
    provider: { type: String, enum: ["razorpay", "manual"], default: "manual" },
    providerOrderId: { type: String, trim: true },
    providerPaymentId: { type: String, trim: true },
    status: { type: String, enum: ["created", "paid", "failed", "refunded", "cancelled"], default: "created" },
  },
  { timestamps: true },
);
orderSchema.index({ status: 1, createdAt: -1 });
export const Order: Model<InferSchemaType<typeof orderSchema>> = models.Order || model("Order", orderSchema);

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "flat"], required: true },
    value: { type: Number, required: true, min: 0 },
    validFrom: Date,
    validTo: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Coupon: Model<InferSchemaType<typeof couponSchema>> = models.Coupon || model("Coupon", couponSchema);

const documentSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    title: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["report-template", "ppt", "setup-guide", "other"], default: "other" },
    storageKey: { type: String, required: true },
    mime: String,
    size: Number,
    access: { type: String, enum: ["public", "purchased", "admin"], default: "admin" },
  },
  { timestamps: true },
);
export const DocumentAsset: Model<InferSchemaType<typeof documentSchema>> =
  models.DocumentAsset || model("DocumentAsset", documentSchema);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true, maxlength: 400 },
    /** Structured blocks (no raw HTML) to keep rendering XSS-safe. */
    body: { type: [contentSectionSchema], default: [] },
    coverUrl: { type: String, trim: true },
    author: { type: String, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: Date,
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);
blogPostSchema.index({ status: 1, publishedAt: -1 });
export type BlogPostDoc = InferSchemaType<typeof blogPostSchema>;
export const BlogPost: Model<BlogPostDoc> = models.BlogPost || model("BlogPost", blogPostSchema);
