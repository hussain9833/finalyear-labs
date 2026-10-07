"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUpRight, Check, Pause, Play } from "lucide-react";
import { ProjectCover } from "@/components/projects/project-cover";
import { AIBadge } from "@/components/projects/badges";
import { cn, formatPrice } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/types";

const INCLUDED = ["Source code", "Setup guide", "Project explanation", "Documentation template", "Customization", "WhatsApp support"];

/** Interactive, auto-rotating preview of featured projects (pauses on hover/focus, keyboard tabs). */
export function HeroShowcase({ projects }: { projects: ProjectSummary[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const paused = hovered || stopped;
  const count = projects.length;

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4800);
    return () => clearInterval(t);
  }, [reduce, paused, count]);

  if (!count) {
    return (
      <div className="relative mx-auto w-full max-w-lg rounded-3xl border border-border bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur">
        <p className="text-sm font-medium text-muted-foreground">Every project includes</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" aria-hidden />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const active = projects[index]!;

  return (
    <div
      className="relative mx-auto w-full max-w-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* Back cards for depth */}
      <div aria-hidden className="absolute inset-x-8 -top-4 h-full rounded-3xl border border-border bg-card/50 shadow-lg" />
      <div aria-hidden className="absolute inset-x-4 -top-2 h-full rounded-3xl border border-border bg-card/70 shadow-lg" />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={active.slug}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCover project={active} priority={index === 0} sizes="(min-width: 1024px) 560px, 100vw" className="group" />
            </m.div>
          </AnimatePresence>
          <div className="absolute top-3 left-3">{active.isAI && <AIBadge className="bg-background/90 backdrop-blur" />}</div>
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-border p-5">
          <div className="min-w-0" aria-live={paused ? "polite" : "off"}>
            <p className="text-xs font-medium text-primary">{active.category.name}</p>
            <p className="mt-1 truncate text-lg font-semibold">{active.name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{active.shortDescription}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">from</p>
            <p className="font-semibold">{formatPrice(active.priceFrom)}</p>
            <Link href={`/projects/${active.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View <ArrowUpRight className="size-3.5" aria-hidden />
              <span className="sr-only"> {active.name}</span>
            </Link>
          </div>
        </div>

        {count > 1 && (
          <div className="flex items-center gap-2 border-t border-border px-5 py-3">
            <div role="tablist" aria-label="Featured projects" className="flex flex-1 gap-1.5">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={p.name}
                  onClick={() => setIndex(i)}
                  className="group/tab flex h-6 flex-1 items-center"
                >
                  <span className={cn("h-1 w-full rounded-full transition-colors", i === index ? "bg-primary" : "bg-border group-hover/tab:bg-muted-foreground/40")} />
                </button>
              ))}
            </div>
            {!reduce && (
              <button
                type="button"
                onClick={() => setStopped((p) => !p)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label={stopped ? "Play showcase" : "Pause showcase"}
              >
                {stopped ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
