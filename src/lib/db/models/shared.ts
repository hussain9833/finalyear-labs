import { Schema } from "mongoose";

export const seoSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 320 },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, trim: true },
    canonical: { type: String, trim: true },
    noindex: { type: Boolean, default: false },
    structuredData: { type: Boolean, default: true },
  },
  { _id: false },
);

export const faqItemSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true, maxlength: 3000 },
  },
  { _id: false },
);

export const contentSectionSchema = new Schema(
  {
    heading: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { _id: false },
);

export const hubContentSchema = new Schema(
  {
    intro: { type: String, trim: true, maxlength: 2000 },
    sections: { type: [contentSectionSchema], default: [] },
  },
  { _id: false },
);

export const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: "" },
    width: Number,
    height: Number,
    caption: { type: String, trim: true },
  },
  { _id: false },
);

export const utmSchema = new Schema(
  {
    source: { type: String, trim: true, maxlength: 100 },
    medium: { type: String, trim: true, maxlength: 100 },
    campaign: { type: String, trim: true, maxlength: 150 },
    term: { type: String, trim: true, maxlength: 150 },
    content: { type: String, trim: true, maxlength: 150 },
  },
  { _id: false },
);
