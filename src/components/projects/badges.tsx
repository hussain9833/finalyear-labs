import { FlaskConical, Sparkles, Star } from "lucide-react";
import { DIFFICULTY_LABEL, type Difficulty } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AIBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-[oklch(0.55_0.22_300/0.12)] px-2.5 py-1 text-xs font-medium text-[oklch(0.5_0.2_300)] ring-1 ring-[oklch(0.55_0.22_300/0.25)] dark:text-[oklch(0.8_0.14_300)]", className)}>
      <Sparkles className="size-3" aria-hidden /> AI
    </span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.15_75/0.16)] px-2.5 py-1 text-xs font-medium text-[oklch(0.5_0.12_65)] ring-1 ring-[oklch(0.75_0.15_70/0.35)] dark:text-[oklch(0.85_0.13_80)]", className)}>
      <Star className="size-3 fill-current" aria-hidden /> Featured
    </span>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border", className)}
      title="Sample listing used for review — details may change."
    >
      <FlaskConical className="size-3" aria-hidden /> Sample listing
    </span>
  );
}

const LEVELS: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };

/** Difficulty shown with bars + text (never colour alone). */
export function DifficultyMeter({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  const level = LEVELS[difficulty];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-1 rounded-full", i === 1 ? "h-1.5" : i === 2 ? "h-2.5" : "h-3.5", i <= level ? "bg-primary" : "bg-border")} />
        ))}
      </span>
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  );
}
