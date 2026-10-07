import { Counter } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

/**
 * Track record (owner-supplied, via env — see siteConfig.trust) + live catalog count from the database.
 * Any stat with value 0 is hidden.
 */
export function StatsStrip({ projects }: { projects: number }) {
  const { projectsCompleted, studentsServed, colleges } = siteConfig.trust;
  const stats = [
    { value: projectsCompleted, suffix: "+", label: "Projects completed" },
    { value: studentsServed, suffix: "+", label: "Students trust us" },
    { value: colleges, suffix: "+", label: "Colleges" },
    { value: projects, suffix: "", label: "Projects available" },
  ].filter((s) => s.value > 0);
  if (!stats.length) return null;

  return (
    <div className="border-y border-border bg-muted/30">
      <dl className="container-page grid grid-cols-2 gap-y-6 py-6 md:grid-cols-4 md:divide-x md:divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col px-2 text-center sm:px-6">
            <dt className="text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
            <dd className="order-first text-2xl font-semibold tracking-tight sm:text-3xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
