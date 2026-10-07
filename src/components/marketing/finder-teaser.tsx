import { ArrowRight, Compass } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { NativeSelect } from "@/components/forms/native-select";
import type { CategoryDTO, DegreeDTO } from "@/lib/types";
import { BUDGETS } from "@/lib/recommend/types";

/** "Not sure which project to choose?" — a no-JS GET form into the project finder. */
export function FinderTeaser({ degrees, categories }: { degrees: DegreeDTO[]; categories: CategoryDTO[] }) {
  return (
    <Reveal className="grid gap-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-card to-brand-2/[0.07] p-6 md:grid-cols-[1fr_1.3fr] md:items-center md:p-10">
      <div>
        <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Compass className="size-5" aria-hidden />
        </span>
        <h2 id="finder-title" className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
          Not sure which project to choose?
        </h2>
        <p className="mt-3 text-muted-foreground">
          Answer a few quick questions and we&apos;ll suggest projects that fit your degree, budget and interests.
        </p>
      </div>
      <form action="/project-finder" method="get" className="grid gap-3 sm:grid-cols-3">
        <NativeSelect name="degree" label="Degree" placeholder="Any degree" options={degrees.map((d) => ({ value: d.slug, label: d.name }))} />
        <NativeSelect name="category" label="Category" placeholder="Any category" options={categories.map((c) => ({ value: c.slug, label: c.name }))} />
        <NativeSelect name="budget" label="Budget" placeholder="Any budget" options={BUDGETS.map((b) => ({ value: b.key, label: b.label }))} />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:col-span-3"
        >
          Find my project <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>
    </Reveal>
  );
}
