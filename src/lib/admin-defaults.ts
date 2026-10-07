/** Empty form defaults for the admin CMS — shared by server pages and client forms (not a client module). */
import type { CategoryInput, DegreeInput, ProjectInput } from "@/lib/validation/admin";

type ProjectFormValues = ProjectInput;

export const DEFAULT_WHAT_YOU_GET = [
  { title: "Complete source code", description: "Well-structured, commented code for the full project.", included: true },
  { title: "Setup guide", description: "Step-by-step instructions to run the project on your machine.", included: true },
  { title: "Project explanation", description: "A walkthrough of the architecture, modules and key code.", included: true },
  { title: "Documentation / project-book template", description: "A structured template to adapt to your implementation and university format.", included: true },
  { title: "PPT resources", description: "Presentation outline and slides you can customize.", included: true },
  { title: "Screenshots & demo", description: "Screenshots for your report and demo access where available.", included: true },
  { title: "Technical guidance", description: "Help over WhatsApp while you set up and understand the project.", included: true },
  { title: "Customization options", description: "Add modules, change the stack or tailor features (quoted separately).", included: true },
];

export function emptyProject(): ProjectFormValues {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    categories: [],
    degrees: [],
    technologies: [],
    tags: [],
    priceFrom: 0,
    currency: "INR",
    difficulty: "intermediate",
    level: "both",
    platform: "web",
    isAI: false,
    hasAdminPanel: false,
    hasAuth: false,
    features: [],
    modules: [],
    howItWorks: [],
    whatYouGet: DEFAULT_WHAT_YOU_GET,
    documentation: { included: true, items: [], note: undefined },
    customization: { available: true, options: [], note: undefined },
    faqs: [],
    thumbnail: undefined,
    screenshots: [],
    demoUrl: undefined,
    videoUrl: undefined,
    repoUrl: undefined,
    showRepo: false,
    featured: false,
    status: "draft",
    sortWeight: 0,
    seo: { title: undefined, description: undefined, keywords: [], ogImage: undefined, canonical: undefined, noindex: false, structuredData: true },
  };
}


type Seo = CategoryInput["seo"];
const emptySeo = (): Seo => ({ title: undefined, description: undefined, keywords: [], ogImage: undefined, canonical: undefined, noindex: false, structuredData: true });

export const emptyCategory = (): CategoryInput => ({
  name: "",
  slug: "",
  shortName: "",
  description: "",
  priceFrom: 0,
  examples: [],
  icon: "layers",
  accent: "iris",
  whatsappRoute: "sales",
  isAI: false,
  order: 10,
  published: true,
  seo: emptySeo(),
  content: { intro: undefined, sections: [] },
  faqs: [],
});

export const emptyDegree = (): DegreeInput => ({
  name: "",
  slug: "",
  fullName: "",
  shortIntro: "",
  order: 10,
  published: true,
  seo: emptySeo(),
  content: { intro: undefined, sections: [] },
  faqs: [],
});

