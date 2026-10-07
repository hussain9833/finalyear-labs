import type { Difficulty, Platform } from "@/lib/constants";
import type { ProjectSummary } from "@/lib/types";

export const BUDGETS = [
  { key: "under-5k", label: "Under ₹5,000", max: 4999 },
  { key: "under-10k", label: "Up to ₹10,000", max: 10000 },
  { key: "under-20k", label: "Up to ₹20,000", max: 20000 },
  { key: "any", label: "₹20,000+ / flexible", max: Number.POSITIVE_INFINITY },
] as const;
export type BudgetKey = (typeof BUDGETS)[number]["key"];

export type FinderAnswers = {
  degree?: string;
  year?: "final" | "semi-final";
  technology?: string;
  category?: string;
  budget?: BudgetKey;
  difficulty?: Difficulty;
  ai?: "yes" | "no" | "either";
  platform?: Extract<Platform, "web" | "mobile"> | "either";
};

export type Recommendation = { project: ProjectSummary; score: number; reasons: string[] };

/** Swappable recommendation strategy (rule-based now; AI/embeddings later). */
export interface Recommender {
  recommend(answers: FinderAnswers, projects: ProjectSummary[], limit?: number): Recommendation[];
}
