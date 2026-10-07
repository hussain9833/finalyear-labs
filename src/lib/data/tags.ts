/** Cache tags for public data. Mutations must invalidate the matching tags. */
export const TAGS = {
  catalog: "catalog",
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  categories: "categories",
  degrees: "degrees",
  testimonials: "testimonials",
  faqs: "faqs",
  blog: "blog",
} as const;
