import type { CategoryDTO, DegreeDTO, ProjectSummary } from "@/lib/types";

const base = { seo: {}, content: { sections: [] }, faqs: [], updatedAt: "2026-01-01T00:00:00.000Z" };

export const degrees: DegreeDTO[] = [
  { ...base, id: "d1", name: "BCA", slug: "bca", fullName: "Bachelor of Computer Applications", shortIntro: "", order: 1 },
  { ...base, id: "d2", name: "MCA", slug: "mca", fullName: "Master of Computer Applications", shortIntro: "", order: 2 },
  { ...base, id: "d3", name: "B.Tech", slug: "btech", fullName: "Bachelor of Technology", shortIntro: "", order: 3 },
  { ...base, id: "d4", name: "BSc IT", slug: "bsc-it", fullName: "BSc IT", shortIntro: "", order: 4 },
];

const cat = (id: string, name: string, slug: string, shortName: string, isAI = false, whatsappRoute: CategoryDTO["whatsappRoute"] = "web"): CategoryDTO => ({
  ...base,
  id,
  name,
  slug,
  shortName,
  description: "",
  priceFrom: 1000,
  currency: "INR",
  examples: [],
  icon: "layers",
  accent: "iris",
  whatsappRoute,
  isAI,
  order: 1,
});

export const categories: CategoryDTO[] = [
  cat("c1", "AI-Integrated Websites", "ai", "AI", true, "ai"),
  cat("c2", "E-Commerce", "ecommerce", "E-Commerce", false, "ecommerce"),
  cat("c3", "Dynamic Websites", "dynamic-websites", "Dynamic"),
];

export function project(p: Partial<ProjectSummary> & Pick<ProjectSummary, "slug" | "name">): ProjectSummary {
  return {
    id: p.slug,
    shortDescription: "A project",
    category: { slug: "dynamic-websites", name: "Dynamic Websites", accent: "iris", icon: "layers", whatsappRoute: "web" },
    categories: [{ slug: "dynamic-websites", name: "Dynamic Websites" }],
    degrees: [{ slug: "bca", name: "BCA" }],
    technologies: ["PHP", "MySQL"],
    tags: [],
    priceFrom: 5000,
    currency: "INR",
    difficulty: "beginner",
    level: "both",
    platform: "web",
    isAI: false,
    hasAdminPanel: true,
    hasAuth: true,
    documentationIncluded: true,
    customizationAvailable: true,
    featured: false,
    isSample: false,
    sortWeight: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...p,
  };
}

export const projects: ProjectSummary[] = [
  project({
    slug: "ai-resume-analyzer",
    name: "AI Resume Analyzer",
    isAI: true,
    category: { slug: "ai", name: "AI-Integrated Websites", accent: "violet", icon: "sparkles", whatsappRoute: "ai" },
    categories: [{ slug: "ai", name: "AI-Integrated Websites" }],
    degrees: [{ slug: "bca", name: "BCA" }, { slug: "mca", name: "MCA" }],
    technologies: ["Next.js", "OpenAI API", "MongoDB"],
    priceFrom: 12000,
    difficulty: "intermediate",
    featured: true,
  }),
  project({
    slug: "smart-store",
    name: "Smart E-Commerce Store",
    isAI: true,
    category: { slug: "ecommerce", name: "E-Commerce", accent: "amber", icon: "shopping-bag", whatsappRoute: "ecommerce" },
    categories: [{ slug: "ecommerce", name: "E-Commerce" }],
    degrees: [{ slug: "mca", name: "MCA" }, { slug: "btech", name: "B.Tech" }],
    technologies: ["React", "Node.js"],
    priceFrom: 22000,
    difficulty: "advanced",
  }),
  project({ slug: "student-management", name: "Student Management System", technologies: ["PHP", "MySQL"], priceFrom: 6000, createdAt: "2026-03-01T00:00:00.000Z" }),
];
