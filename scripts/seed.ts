/**
 * Idempotent seed (upserts by slug).
 *   npm run seed            → categories, degrees, home FAQs
 *   npm run seed -- --demo  → also SAMPLE projects (flagged isSample, published) for development/review
 */
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { BlogPost, Category, Degree, Faq, Project } from "@/lib/db/models";
import {
  CATEGORIES,
  DEGREES,
  DEMO_PROJECTS,
  HOME_FAQS,
  STANDARD_DOC_ITEMS,
  STANDARD_WHAT_YOU_GET,
} from "./seed-data";
import { BLOG_POSTS, EXTRA_CATEGORIES, EXTRA_PROJECTS } from "./seed-data-extra";

async function main() {
  const demo = process.argv.includes("--demo");
  await connectDB();
  await Promise.all([Category.syncIndexes(), Degree.syncIndexes(), Project.syncIndexes(), Faq.syncIndexes()]);

  const allCategories = [...CATEGORIES, ...EXTRA_CATEGORIES];
  for (const c of allCategories) {
    await Category.updateOne({ slug: c.slug }, { $setOnInsert: { ...c, published: true } }, { upsert: true });
  }
  console.log(`✓ ${allCategories.length} categories`);

  for (const d of DEGREES) {
    await Degree.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, published: true } }, { upsert: true });
  }
  console.log(`✓ ${DEGREES.length} degrees`);

  if ((await Faq.countDocuments({ scope: "home" })) === 0) {
    await Faq.insertMany(HOME_FAQS.map((f, i) => ({ ...f, scope: "home", order: i, published: true })));
    console.log(`✓ ${HOME_FAQS.length} home FAQs`);
  }

  for (const post of BLOG_POSTS) {
    await BlogPost.updateOne(
      { slug: post.slug },
      { $setOnInsert: { ...post, status: "published", publishedAt: new Date() } },
      { upsert: true },
    );
  }
  console.log(`✓ ${BLOG_POSTS.length} blog posts`);

  if (demo) {
    const cats = new Map((await Category.find().lean()).map((c) => [c.slug, c._id]));
    const degs = new Map((await Degree.find().lean()).map((d) => [d.slug, d._id]));
    const allProjects = [...DEMO_PROJECTS, ...EXTRA_PROJECTS];
    let i = 0;
    for (const p of allProjects) {
      const doc = {
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        category: cats.get(p.category),
        categories: (p.categories ?? [p.category]).map((s) => cats.get(s)).filter(Boolean),
        degrees: p.degrees.map((s) => degs.get(s)).filter(Boolean),
        technologies: p.technologies,
        tags: p.tags,
        priceFrom: p.priceFrom,
        currency: "INR",
        difficulty: p.difficulty,
        level: p.level,
        platform: p.platform,
        isAI: p.isAI,
        hasAdminPanel: p.hasAdminPanel,
        hasAuth: p.hasAuth,
        featured: p.featured,
        features: p.features.map(([title, description]) => ({ title, description })),
        modules: p.modules.map(([name, description, items]) => ({ name, description, items })),
        howItWorks: p.howItWorks.map(([title, description]) => ({ title, description })),
        whatYouGet: STANDARD_WHAT_YOU_GET.map((w) => ({ ...w, included: true })),
        documentation: {
          included: true,
          items: STANDARD_DOC_ITEMS,
          note: "Templates are a starting point — adapt them to your implementation and your university's format.",
        },
        customization: {
          available: true,
          options: ["Add or remove modules", "Change the technology stack", "Custom branding & UI", "Features from your synopsis"],
        },
        faqs: (p.faqs ?? []).map(([question, answer]) => ({ question, answer })),
        status: "published",
        publishedAt: new Date(),
        sortWeight: allProjects.length - i++,
        isSample: true,
      };
      await Project.updateOne({ slug: p.slug }, { $setOnInsert: doc }, { upsert: true });
    }
    console.log(`✓ ${allProjects.length} SAMPLE projects (isSample=true) — replace with real listings before launch`);
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
