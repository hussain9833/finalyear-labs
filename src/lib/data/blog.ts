import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db/connect";
import { BlogPost } from "@/lib/db/models";
import type { ContentSection, Seo } from "@/lib/types";
import { TAGS } from "./tags";

export type BlogPostDTO = {
  slug: string;
  title: string;
  excerpt: string;
  body: ContentSection[];
  coverUrl?: string;
  author?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  seo: Seo;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function map(doc: any): BlogPostDTO {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt ?? "",
    body: (doc.body ?? []).map((s: any) => ({ heading: s.heading, body: s.body })),
    coverUrl: doc.coverUrl || undefined,
    author: doc.author || undefined,
    tags: doc.tags ?? [],
    publishedAt: (doc.publishedAt ?? doc.createdAt ?? new Date(0)).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date(0)).toISOString(),
    seo: { title: doc.seo?.title, description: doc.seo?.description, ogImage: doc.seo?.ogImage, noindex: Boolean(doc.seo?.noindex) },
  };
}

export async function getPublishedPosts(): Promise<BlogPostDTO[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.blog);
  if (!isDatabaseConfigured()) return [];
  await connectDB();
  const docs = await BlogPost.find({ status: "published" }).sort({ publishedAt: -1 }).limit(200).lean();
  return docs.map(map);
}

export async function getPost(slug: string): Promise<BlogPostDTO | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.blog);
  if (!isDatabaseConfigured()) return null;
  await connectDB();
  const doc = await BlogPost.findOne({ slug, status: "published" }).lean();
  return doc ? map(doc) : null;
}
