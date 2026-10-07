import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ACCENTS, DIFFICULTIES, FAQ_SCOPES, PLATFORMS, PROJECT_LEVELS, PROJECT_STATUSES } from "@/lib/constants";
import { WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";
import { faqItemSchema, hubContentSchema, imageSchema, seoSchema } from "./shared";

/* ------------------------------- Category -------------------------------- */

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortName: { type: String, trim: true, maxlength: 40 },
    description: { type: String, trim: true, maxlength: 400, default: "" },
    priceFrom: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: "INR" },
    examples: { type: [String], default: [] },
    icon: { type: String, default: "layers" },
    accent: { type: String, enum: ACCENTS, default: "iris" },
    whatsappRoute: { type: String, enum: WHATSAPP_NUMBER_TYPES, default: "sales" },
    isAI: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
    content: { type: hubContentSchema, default: () => ({}) },
    faqs: { type: [faqItemSchema], default: [] },
  },
  { timestamps: true },
);
categorySchema.index({ published: 1, order: 1 });

export type CategoryDoc = InferSchemaType<typeof categorySchema>;
export const Category: Model<CategoryDoc> = models.Category || model("Category", categorySchema);

/* -------------------------------- Degree --------------------------------- */

const degreeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, trim: true, maxlength: 120, default: "" },
    shortIntro: { type: String, trim: true, maxlength: 400, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
    content: { type: hubContentSchema, default: () => ({}) },
    faqs: { type: [faqItemSchema], default: [] },
  },
  { timestamps: true },
);
degreeSchema.index({ published: 1, order: 1 });

export type DegreeDoc = InferSchemaType<typeof degreeSchema>;
export const Degree: Model<DegreeDoc> = models.Degree || model("Degree", degreeSchema);

/* -------------------------------- Project -------------------------------- */

const titledSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 1200, default: "" },
  },
  { _id: false },
);

const moduleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1200, default: "" },
    items: { type: [String], default: [] },
  },
  { _id: false },
);

const whatYouGetSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 600, default: "" },
    included: { type: Boolean, default: true },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 8000, default: "" },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    categories: { type: [{ type: Schema.Types.ObjectId, ref: "Category" }], default: [] },
    degrees: { type: [{ type: Schema.Types.ObjectId, ref: "Degree" }], default: [] },
    technologies: { type: [String], default: [] },
    tags: { type: [String], default: [] },

    priceFrom: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    difficulty: { type: String, enum: DIFFICULTIES, default: "intermediate" },
    level: { type: String, enum: PROJECT_LEVELS, default: "both" },
    platform: { type: String, enum: PLATFORMS, default: "web" },
    isAI: { type: Boolean, default: false },
    hasAdminPanel: { type: Boolean, default: false },
    hasAuth: { type: Boolean, default: false },

    features: { type: [titledSchema], default: [] },
    modules: { type: [moduleSchema], default: [] },
    howItWorks: { type: [titledSchema], default: [] },
    whatYouGet: { type: [whatYouGetSchema], default: [] },
    documentation: {
      type: new Schema(
        {
          included: { type: Boolean, default: true },
          items: { type: [String], default: [] },
          note: { type: String, trim: true, maxlength: 600 },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    customization: {
      type: new Schema(
        {
          available: { type: Boolean, default: true },
          options: { type: [String], default: [] },
          note: { type: String, trim: true, maxlength: 600 },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    faqs: { type: [faqItemSchema], default: [] },

    thumbnail: { type: imageSchema },
    screenshots: { type: [imageSchema], default: [] },
    demoUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
    /** Private by default — never exposed publicly unless showRepo is true. */
    repoUrl: { type: String, trim: true },
    showRepo: { type: Boolean, default: false },

    featured: { type: Boolean, default: false },
    status: { type: String, enum: PROJECT_STATUSES, default: "draft" },
    publishedAt: Date,
    sortWeight: { type: Number, default: 0 },
    isSample: { type: Boolean, default: false },

    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1, featured: -1, sortWeight: -1 });
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ status: 1, categories: 1 });
projectSchema.index({ status: 1, degrees: 1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ status: 1, priceFrom: 1 });
projectSchema.index(
  { name: "text", technologies: "text", tags: "text", shortDescription: "text" },
  { weights: { name: 10, technologies: 5, tags: 5, shortDescription: 2 }, name: "project_text" },
);

projectSchema.pre("validate", function () {
  // The primary category is always part of `categories`.
  if (this.category && !this.categories.some((c) => String(c) === String(this.category))) {
    this.categories.unshift(this.category);
  }
  if (this.status === "published" && !this.publishedAt) this.publishedAt = new Date();
});

export type ProjectDoc = InferSchemaType<typeof projectSchema>;
export const Project: Model<ProjectDoc> = models.Project || model("Project", projectSchema);

/* ------------------------------ Testimonial ------------------------------ */

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    degree: { type: String, trim: true, maxlength: 40 },
    college: { type: String, trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 800 },
    rating: { type: Number, min: 1, max: 5 },
    projectSlug: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    /** Must be true (student agreed to publication) before publishing. */
    consent: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
testimonialSchema.index({ published: 1, order: 1 });
testimonialSchema.index({ projectSlug: 1, published: 1 });

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;
export const Testimonial: Model<TestimonialDoc> =
  models.Testimonial || model("Testimonial", testimonialSchema);

/* ---------------------------------- FAQ ---------------------------------- */

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 3000 },
    scope: { type: String, enum: FAQ_SCOPES, default: "home" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
faqSchema.index({ scope: 1, published: 1, order: 1 });

export type FaqDoc = InferSchemaType<typeof faqSchema>;
export const Faq: Model<FaqDoc> = models.Faq || model("Faq", faqSchema);
