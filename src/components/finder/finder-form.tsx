import { Compass } from "lucide-react";
import { NativeSelect } from "@/components/forms/native-select";
import { BUDGETS, type FinderAnswers } from "@/lib/recommend/types";
import { DIFFICULTIES, DIFFICULTY_LABEL } from "@/lib/constants";

type Opt = { value: string; label: string };

/** Plain GET form — shareable result URLs and works without JavaScript. */
export function FinderForm({
  answers,
  degrees,
  categories,
  technologies,
}: {
  answers: FinderAnswers;
  degrees: Opt[];
  categories: Opt[];
  technologies: string[];
}) {
  return (
    <form action="/project-finder" method="get" className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
      <p className="flex items-center gap-2 font-semibold">
        <Compass className="size-4 text-primary" aria-hidden /> Your preferences
      </p>
      <div className="mt-5 grid gap-4">
        <NativeSelect name="degree" label="Degree" placeholder="Any degree" options={degrees} defaultValue={answers.degree} />
        <NativeSelect
          name="year"
          label="Year"
          placeholder="Any"
          options={[
            { value: "final", label: "Final year" },
            { value: "semi-final", label: "Semi-final year" },
          ]}
          defaultValue={answers.year}
        />
        <NativeSelect name="category" label="Category" placeholder="Any category" options={categories} defaultValue={answers.category} />
        <div className="grid gap-1.5">
          <label htmlFor="finder-tech" className="text-sm font-medium">
            Preferred technology
          </label>
          <input
            id="finder-tech"
            name="technology"
            list="finder-tech-list"
            defaultValue={answers.technology}
            placeholder="e.g. Python, React"
            maxLength={40}
            className="h-12 rounded-xl border border-input bg-background px-3.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          />
          <datalist id="finder-tech-list">
            {technologies.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <NativeSelect name="budget" label="Budget" placeholder="Any budget" options={BUDGETS.map((b) => ({ value: b.key, label: b.label }))} defaultValue={answers.budget} />
        <NativeSelect name="difficulty" label="Difficulty" placeholder="Any" options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))} defaultValue={answers.difficulty} />

        <fieldset>
          <legend className="mb-2 text-sm font-medium">AI features</legend>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "either", l: "Either" },
              { v: "yes", l: "Yes" },
              { v: "no", l: "No" },
            ].map((o) => (
              <label key={o.v} className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-border text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40">
                <input type="radio" name="ai" value={o.v} defaultChecked={(answers.ai ?? "either") === o.v} className="sr-only" />
                {o.l}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Platform</legend>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "either", l: "Either" },
              { v: "web", l: "Web" },
              { v: "mobile", l: "Mobile" },
            ].map((o) => (
              <label key={o.v} className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-border text-sm font-medium has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40">
                <input type="radio" name="platform" value={o.v} defaultChecked={(answers.platform ?? "either") === o.v} className="sr-only" />
                {o.l}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="mt-2 h-12 rounded-xl bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Show matching projects
        </button>
      </div>
    </form>
  );
}
