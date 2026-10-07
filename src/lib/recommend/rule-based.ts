import { DIFFICULTY_LABEL } from "@/lib/constants";
import { techSlug } from "@/lib/search/filters";
import { BUDGETS, type FinderAnswers, type Recommendation, type Recommender } from "./types";

/**
 * Transparent, rule-based scoring. Hard constraints (budget, degree when given) filter; soft preferences
 * add points and produce human-readable reasons. Replace via getRecommender() for an AI implementation.
 */
export const ruleBasedRecommender: Recommender = {
  recommend(a: FinderAnswers, projects, limit = 6): Recommendation[] {
    const budget = a.budget ? BUDGETS.find((b) => b.key === a.budget) : undefined;
    const tech = a.technology ? techSlug(a.technology) : undefined;

    const scored: Recommendation[] = [];
    for (const p of projects) {
      const reasons: string[] = [];
      let score = 0;

      if (budget && p.priceFrom > budget.max) continue;
      if (budget && budget.key !== "any") reasons.push(`Fits your budget (from ₹${p.priceFrom.toLocaleString("en-IN")})`);

      if (a.degree) {
        const match = p.degrees.find((d) => d.slug === a.degree);
        if (!match) continue;
        score += 30;
        reasons.push(`Suitable for ${match.name}`);
      }
      if (a.category) {
        if (p.categories.some((c) => c.slug === a.category)) {
          score += 25;
          reasons.push(`In ${p.categories.find((c) => c.slug === a.category)!.name}`);
        } else score -= 10;
      }
      if (a.ai === "yes") {
        if (p.isAI) {
          score += 20;
          reasons.push("Includes AI features");
        } else score -= 15;
      } else if (a.ai === "no" && p.isAI) score -= 5;

      if (tech) {
        if (p.technologies.some((t) => techSlug(t).includes(tech) || tech.includes(techSlug(t)))) {
          score += 15;
          reasons.push(`Uses ${a.technology}`);
        }
      }
      if (a.difficulty) {
        if (p.difficulty === a.difficulty) {
          score += 10;
          reasons.push(`${DIFFICULTY_LABEL[p.difficulty]} difficulty`);
        } else score -= 3;
      }
      if (a.year) {
        if (p.level === a.year || p.level === "both") score += 8;
        else score -= 8;
      }
      if (a.platform && a.platform !== "either") {
        if (p.platform === a.platform || p.platform === "cross") {
          score += 8;
          reasons.push(a.platform === "mobile" ? "Mobile-ready" : "Web application");
        } else score -= 8;
      }
      if (p.featured) score += 3;
      if (p.customizationAvailable) score += 1;

      scored.push({ project: p, score, reasons: reasons.slice(0, 4) });
    }
    return scored.sort((x, y) => y.score - x.score || x.project.priceFrom - y.project.priceFrom).slice(0, limit);
  },
};

export function getRecommender(): Recommender {
  return ruleBasedRecommender;
}
