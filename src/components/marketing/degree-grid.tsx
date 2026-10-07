import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TrackedLink } from "@/components/projects/tracked-link";
import type { DegreeDTO } from "@/lib/types";

export function DegreeGrid({ degrees, counts }: { degrees: DegreeDTO[]; counts: Record<string, number> }) {
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {degrees.map((d) => (
        <StaggerItem key={d.slug}>
          <TrackedLink
            href={`/projects/${d.slug}`}
            event="degree_selected"
            props={{ degree: d.slug, ctaLocation: "degree_grid" }}
            className="group relative flex h-full min-h-32 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <GraduationCap className="size-[1.1rem]" aria-hidden />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
            </div>
            <div className="mt-4">
              <p className="text-xl font-semibold tracking-tight">{d.name}</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{d.fullName}</p>
              <p className="mt-2 text-xs font-medium text-primary">
                {counts[d.slug] ? `${counts[d.slug]} project${counts[d.slug] === 1 ? "" : "s"}` : "Explore projects"}
              </p>
            </div>
          </TrackedLink>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
