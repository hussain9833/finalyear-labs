import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/types";
import { ProjectCard } from "./project-card";

export function ProjectGrid({
  projects,
  degree,
  className,
  priorityFirst = false,
}: {
  projects: ProjectSummary[];
  degree?: string;
  className?: string;
  priorityFirst?: boolean;
}) {
  return (
    <Stagger className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((p, i) => (
        <StaggerItem key={p.slug} className="h-full">
          <ProjectCard project={p} degree={degree} priority={priorityFirst && i === 0} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card" aria-hidden>
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="mt-4 h-11 w-full" />
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading projects">
      {Array.from({ length: count }, (_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
      <span className="sr-only">Loading projects…</span>
    </div>
  );
}
