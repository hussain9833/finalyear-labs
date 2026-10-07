import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import type { DegreeDTO, ProjectSummary } from "@/lib/types";
import { HeroShowcase } from "./hero-showcase";

export function Hero({ degrees, showcase }: { degrees: DegreeDTO[]; showcase: ProjectSummary[] }) {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Background: engineering grid + soft brand glow */}
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)] blur-2xl" />

      <div className="container-page grid items-center gap-12 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-whatsapp opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-whatsapp" />
            </span>
            Source code · Live demos · Documentation · Support
          </p>

          <h1 id="hero-title" className="mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Your Final-Year Project <span className="text-gradient">Starts Here.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Explore modern Web, AI, E-Commerce, Mobile and Full-Stack projects built for technical students.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/projects" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-6 text-base shadow-lg shadow-primary/20")}>
              Explore Projects <ArrowRight className="size-4" aria-hidden />
            </Link>
            <WhatsAppButton intent="general" cta="hero" variant="outline" size="lg">
              Talk to Us on WhatsApp
            </WhatsAppButton>
          </div>

          {(siteConfig.trust.projectsCompleted > 0 || siteConfig.trust.studentsServed > 0) && (
            <p className="mt-6 text-sm text-muted-foreground">
              {[
                siteConfig.trust.projectsCompleted > 0 && `${siteConfig.trust.projectsCompleted}+ projects completed`,
                siteConfig.trust.studentsServed > 0 && `trusted by ${siteConfig.trust.studentsServed}+ students`,
                siteConfig.trust.colleges > 0 && `from ${siteConfig.trust.colleges}+ colleges`,
              ]
                .filter(Boolean)
                .join(" · ")
                .replace(/^./, (c) => c.toUpperCase())}
            </p>
          )}

          {degrees.length > 0 && (
            <nav aria-label="Supported degrees" className="mt-6">
              <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-medium text-muted-foreground">
                {degrees.map((d, i) => (
                  <li key={d.slug} className="flex items-center gap-1">
                    {i > 0 && <span aria-hidden className="text-border">•</span>}
                    <Link href={`/projects/${d.slug}`} className="rounded-md px-1.5 py-1 transition-colors hover:bg-muted hover:text-foreground">
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <HeroShowcase projects={showcase} />
      </div>
    </section>
  );
}
