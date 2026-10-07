import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { FinderAnswers, Recommendation } from "@/lib/recommend/types";
import { FinderTracker } from "./finder-tracker";

export function FinderResults({ submitted, results, answers }: { submitted: boolean; results: Recommendation[]; answers: FinderAnswers }) {
  if (!submitted) {
    return (
      <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border p-8 text-center">
        <Sparkles className="mx-auto size-8 text-primary" aria-hidden />
        <p className="mt-4 text-lg font-semibold">Your suggestions will appear here</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Pick as many or as few preferences as you like. Only degree and budget are treated as strict requirements.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="finder-results">
      <FinderTracker degree={answers.degree} category={answers.category} results={results.length} />
      <h2 id="finder-results" className="text-xl font-semibold">
        {results.length ? `${results.length} project${results.length === 1 ? "" : "s"} match your answers` : "No exact matches yet"}
      </h2>
      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Try widening your budget or removing a preference — or tell us what you need and we&apos;ll suggest or build a project for you.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/custom-project" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">
              Request a custom project
            </Link>
            <WhatsAppButton intent="general" cta="finder" degree={answers.degree} category={answers.category} variant="outline">
              Ask on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      ) : (
        <Stagger className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((r) => (
            <StaggerItem key={r.project.slug} className="flex flex-col gap-3">
              {r.reasons.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label={`Why ${r.project.name} matches`}>
                  {r.reasons.map((reason) => (
                    <li key={reason} className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      <Check className="size-3" aria-hidden /> {reason}
                    </li>
                  ))}
                </ul>
              )}
              <ProjectCard project={r.project} degree={answers.degree} className="flex-1" />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}
