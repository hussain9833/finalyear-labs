import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/types";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { ProjectCover } from "./project-cover";
import { AIBadge, DifficultyMeter, FeaturedBadge, SampleBadge } from "./badges";
import { CompareToggle } from "./compare-controls";
import { TrackedExternalLink } from "./tracked-link";

export function ProjectCard({
  project,
  priority = false,
  degree,
  className,
}: {
  project: ProjectSummary;
  priority?: boolean;
  /** Degree context (e.g. on /projects/bca) — included in the WhatsApp message. */
  degree?: string;
  className?: string;
}) {
  const href = `/projects/${project.slug}`;
  const extraTech = project.technologies.length - 3;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
        className,
      )}
    >
      <div className="relative">
        <ProjectCover project={project} priority={priority} />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {project.isAI && <AIBadge className="bg-background/90 backdrop-blur-md" />}
          {project.featured && <FeaturedBadge className="bg-background/90 backdrop-blur-md" />}
        </div>
        <div className="absolute top-3 right-3 z-10">
          <CompareToggle slug={project.slug} name={project.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-primary">{project.category.name}</span>
          <DifficultyMeter difficulty={project.difficulty} />
        </div>

        <h3 className="mt-2 text-lg leading-snug font-semibold">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50">
            {project.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.shortDescription}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, 3).map((t) => (
            <li key={t} className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground">
              {t}
            </li>
          ))}
          {extraTech > 0 && <li className="px-1 py-0.5 text-[0.7rem] text-muted-foreground">+{extraTech}</li>}
        </ul>

        {project.degrees.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            <span className="sr-only">Suitable for: </span>
            {project.degrees.map((d) => d.name).join(" · ")}
          </p>
        )}
        {project.isSample && <SampleBadge className="mt-3 self-start" />}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-2 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Starting from
              <span className="block text-lg font-semibold tracking-tight text-foreground">{formatPrice(project.priceFrom, project.currency)}</span>
            </p>
            {project.demoUrl && (
              <TrackedExternalLink
                href={project.demoUrl}
                event="project_demo_click"
                props={{ projectSlug: project.slug, ctaLocation: "project_card" }}
                className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Live demo of ${project.name} (opens in a new tab)`}
              >
                Live demo <ExternalLink className="size-3.5" aria-hidden />
              </TrackedExternalLink>
            )}
          </div>
          <div className="relative z-10 mt-3 grid grid-cols-2 gap-2">
            <Link
              href={href}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background text-sm font-medium transition-colors hover:bg-muted"
              tabIndex={-1}
              aria-hidden="true"
            >
              View project
            </Link>
            <WhatsAppButton intent="project" cta="project_card" project={project.slug} degree={degree} size="md" aria-label={`Get ${project.name} on WhatsApp`}>
              Get this
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </article>
  );
}
