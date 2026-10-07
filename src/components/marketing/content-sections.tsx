import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Code2,
  FileText,
  GitBranch,
  Headphones,
  LayoutDashboard,
  MessageCircle,
  MonitorPlay,
  Search,
  Settings2,
  Sparkles,
  Minus,
  Wrench,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CtaLocation } from "@/lib/whatsapp/types";

/* ------------------------------ How it works ----------------------------- */

const STEPS = [
  { icon: Search, title: "Choose", body: "Browse by degree, category or technology — or let the project finder suggest a match." },
  { icon: MonitorPlay, title: "Understand", body: "See the live demo, features, modules, tech stack and exactly what's included." },
  { icon: MessageCircle, title: "Talk to us", body: "Tap WhatsApp with a pre-filled message. Ask anything about pricing or customization." },
  { icon: Wrench, title: "Customize & learn", body: "Get the code, setup help and an explanation so you can adapt and present it confidently." },
];

export function HowItWorks() {
  return (
    <Stagger className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div aria-hidden className="absolute top-9 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
      {STEPS.map((s, i) => (
        <StaggerItem key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="relative grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <s.icon className="size-5" aria-hidden />
            </span>
            <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
          </div>
          <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ------------------------------- Why choose us --------------------------- */

const REPO = ["Source code", "You evaluate quality yourself", "Setup depends on the README", "Report & documentation are up to you", "Help depends on the community"];
const JOURNEY = [
  "Curated, degree-oriented projects",
  "Live demos & clear feature lists",
  "Setup guide + project explanation",
  "Documentation / project-book templates",
  "Customization & direct WhatsApp support",
];

const PILLARS = [
  { icon: Sparkles, title: "Curated projects", body: "Selected for modern stacks and real-world use cases." },
  { icon: MonitorPlay, title: "Live demos", body: "See it running before you decide." },
  { icon: Code2, title: "Modern technologies", body: "React, Next.js, Python, AI APIs and more." },
  { icon: FileText, title: "Documentation support", body: "Structured templates you adapt to your project." },
  { icon: BookOpenCheck, title: "Project explanation", body: "Understand the architecture and key code." },
  { icon: Settings2, title: "Customization", body: "Tailor features and stack to your synopsis." },
  { icon: Headphones, title: "Direct support", body: "Talk to a real person on WhatsApp." },
  { icon: LayoutDashboard, title: "Student-focused", body: "Built around how students actually choose projects." },
];

export function TrustSection() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <GitBranch className="size-4" aria-hidden /> A repository
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
              {REPO.map((r) => (
                <li key={r} className="flex items-start gap-2.5">
                  <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground">Great for reference and learning — we love open source.</p>
          </div>
          <div className="relative rounded-2xl border border-primary/30 bg-card p-6 shadow-xl shadow-primary/10 ring-1 ring-primary/10">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="size-4" aria-hidden /> A complete project journey
            </p>
            <ul className="mt-4 grid gap-3 text-sm">
              {JOURNEY.map((r) => (
                <li key={r} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
      <Stagger className="grid grid-cols-2 gap-x-6 gap-y-7">
        {PILLARS.map((p) => (
          <StaggerItem key={p.title}>
            <p.icon className="size-5 text-primary" aria-hidden />
            <h3 className="mt-2.5 text-sm font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

/* --------------------------- Documentation section ------------------------ */

export const DOC_SECTIONS = [
  "Abstract",
  "Introduction",
  "Problem statement",
  "Objectives",
  "Existing system",
  "Proposed system",
  "Methodology",
  "Technology stack",
  "System design",
  "Database design",
  "Modules",
  "Screenshots",
  "Testing",
  "Future scope",
  "Conclusion",
];

export function DocumentationSection({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <Reveal>
        <p className="mb-3 text-sm font-medium text-primary">Project book & documentation</p>
        <h2 id="docs-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
          Structured resources for your project report
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Get templates and resources that follow the structure most universities use — so you spend your time
          understanding and improving your project, not formatting a report from scratch.
        </p>
        <p className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          Templates are a starting point. Adapt every section to your actual implementation and to your
          university&apos;s format and guidelines — we don&apos;t guarantee acceptance by any institution.
        </p>
        {!compact && (
          <Link href="/documentation-support" className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 rounded-xl px-5")}>
            How documentation support works <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </Reveal>
      <Reveal delay={0.1}>
        <div className="rounded-3xl border border-border bg-card p-2 shadow-xl shadow-black/5">
          <div className="rounded-2xl bg-muted/40 p-5">
            <p className="font-mono text-xs text-muted-foreground">project-report.docx — table of contents</p>
            <ol className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              {DOC_SECTIONS.map((s, i) => (
                <li key={s} className="flex items-baseline gap-3">
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --------------------------------- CTA band ------------------------------- */

export function CtaBand({
  title = "Have a specific idea or requirement?",
  body = "Tell us your degree, technology and features. We'll help you plan a project you can build, understand and present.",
  cta = "cta_band",
  category,
  degree,
}: {
  title?: string;
  body?: string;
  cta?: CtaLocation;
  category?: string;
  degree?: string;
}) {
  return (
    <Reveal className="relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-xl shadow-primary/5 md:px-12 md:py-16">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div aria-hidden className="absolute -bottom-24 left-1/2 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_25%,transparent),transparent)]" />
      <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">{body}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/custom-project" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-6 text-base")}>
          Request a custom project <ArrowRight className="size-4" aria-hidden />
        </Link>
        <WhatsAppButton intent="general" cta={cta} category={category} degree={degree} variant="outline" size="lg">
          Ask on WhatsApp
        </WhatsAppButton>
      </div>
    </Reveal>
  );
}
