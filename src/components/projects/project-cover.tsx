import Image from "next/image";
import { Bot, Check, Lock, ShieldCheck, ShoppingCart, Thermometer, User, Wifi } from "lucide-react";
import { ACCENT_CLASSES, CategoryIcon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/types";

type CoverProject = Pick<ProjectSummary, "name" | "thumbnail" | "category" | "technologies" | "isAI"> & { platform?: ProjectSummary["platform"] };
type Accent = (typeof ACCENT_CLASSES)[keyof typeof ACCENT_CLASSES];

/**
 * Project visual: the real thumbnail when one exists, otherwise a generated mock UI built from the
 * project's own data (never a fake screenshot). The mock varies by category type (chosen from the
 * category's icon key, so new categories added in the CMS get a matching style automatically).
 */
export function ProjectCover({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  project: CoverProject;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (project.thumbnail?.url) {
    return (
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", className)}>
        <Image
          src={project.thumbnail.url}
          alt={project.thumbnail.alt || `${project.name} screenshot`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const accent = ACCENT_CLASSES[project.category.accent] ?? ACCENT_CLASSES.iris;
  const variant = project.platform === "mobile" ? "mobile" : variantFor(project.category.icon);

  return (
    <div
      className={cn("relative aspect-[16/10] overflow-hidden bg-muted", className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 0% 0%, color-mix(in oklch, ${accent.from} 30%, transparent), transparent 60%), radial-gradient(90% 80% at 100% 100%, color-mix(in oklch, var(--brand-2) 20%, transparent), transparent 60%)`,
      }}
      role="img"
      aria-label={`${project.name} — ${project.category.name} project`}
    >
      <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      {variant === "mobile" ? <MobileMock project={project} accent={accent} /> : <WindowMock project={project} accent={accent} variant={variant} />}
    </div>
  );
}

type Variant = "chat" | "ml" | "store" | "mobile" | "dashboard" | "landing" | "iot" | "security";

function variantFor(icon: string): Variant {
  switch (icon) {
    case "sparkles":
    case "bot":
      return "chat";
    case "brain":
    case "bar-chart":
      return "ml";
    case "shopping-bag":
      return "store";
    case "smartphone":
      return "mobile";
    case "layout-template":
      return "landing";
    case "cpu":
      return "iot";
    case "shield":
      return "security";
    default:
      return "dashboard";
  }
}

/* ---------------------------------- Frames --------------------------------- */

function WindowMock({ project, accent, variant }: { project: CoverProject; accent: Accent; variant: Variant }) {
  return (
    <div className="absolute inset-x-[8%] top-[18%] bottom-0 flex flex-col overflow-hidden rounded-t-xl border border-border/80 bg-card/90 shadow-xl shadow-black/5 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2">
        <span className="size-2 rounded-full bg-[oklch(0.7_0.18_25)]" />
        <span className="size-2 rounded-full bg-[oklch(0.8_0.15_85)]" />
        <span className="size-2 rounded-full bg-[oklch(0.72_0.16_150)]" />
        <span className="ml-2 h-2 flex-1 rounded-full bg-muted" />
      </div>
      <div className="flex items-center gap-2.5 px-3 pt-2.5">
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg ring-1", accent.bg, accent.ring)}>
          <CategoryIcon name={project.category.icon} className={cn("size-3.5", accent.text)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.72rem] leading-tight font-semibold">{project.name}</p>
          <div className="mt-0.5 flex gap-1 overflow-hidden">
            {project.technologies.slice(0, 3).map((t) => (
              <span key={t} className="shrink-0 rounded bg-muted px-1 py-px font-mono text-[0.55rem] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 p-3 pt-2.5">
        {variant === "chat" && <ChatBody accent={accent} />}
        {variant === "ml" && <MlBody accent={accent} />}
        {variant === "store" && <StoreBody accent={accent} />}
        {variant === "landing" && <LandingBody accent={accent} />}
        {variant === "iot" && <IotBody accent={accent} />}
        {variant === "security" && <SecurityBody accent={accent} />}
        {variant === "dashboard" && <DashboardBody accent={accent} />}
      </div>
    </div>
  );
}

function MobileMock({ project, accent }: { project: CoverProject; accent: Accent }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-4 pt-[8%]">
      <div className="h-[92%] w-[30%] translate-y-[6%] rounded-t-[1.4rem] border-[3px] border-b-0 border-foreground/80 bg-card p-1.5 shadow-xl transition-transform duration-500 ease-out group-hover:translate-y-[3%]">
        <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-foreground/70" />
        <div className="flex items-center gap-1.5 px-1">
          <span className={cn("grid size-5 place-items-center rounded-md", accent.bg)}>
            <CategoryIcon name={project.category.icon} className={cn("size-3", accent.text)} />
          </span>
          <p className="truncate text-[0.55rem] font-semibold">{project.name}</p>
        </div>
        <div className={cn("mt-1.5 h-[22%] rounded-lg", accent.bg)} />
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-md bg-muted p-1">
              <div className="h-4 rounded bg-background/70" />
              <div className="mt-1 h-1 w-3/4 rounded-full bg-border" />
            </div>
          ))}
        </div>
        <div className={cn("mt-1.5 h-4 rounded-md", accent.bg, "ring-1", accent.ring)} />
      </div>
      <div className="hidden w-[24%] flex-col gap-1.5 self-center sm:flex">
        {project.technologies.slice(0, 3).map((t) => (
          <span key={t} className="truncate rounded-lg border border-border bg-card/90 px-2 py-1 font-mono text-[0.55rem] text-muted-foreground shadow-sm">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Bodies --------------------------------- */

const Line = ({ w, className }: { w: string; className?: string }) => <div className={cn("h-1.5 rounded-full bg-border", className)} style={{ width: w }} />;

function ChatBody({ accent }: { accent: Accent }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-end gap-1.5 self-end">
        <div className={cn("rounded-xl rounded-br-sm px-2 py-1.5", accent.bg)}>
          <Line w="4.5rem" className="bg-foreground/25" />
        </div>
        <User className="size-3 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex items-end gap-1.5">
        <Bot className={cn("size-3", accent.text)} aria-hidden />
        <div className="space-y-1 rounded-xl rounded-bl-sm bg-muted px-2 py-1.5">
          <Line w="7rem" />
          <Line w="5.5rem" />
          <Line w="3.5rem" />
        </div>
      </div>
      <div className="mt-auto flex items-center gap-1.5 rounded-lg border border-border px-2 py-1">
        <Line w="60%" />
        <span className={cn("ml-auto size-3 rounded-full", accent.bg, "ring-1", accent.ring)} />
      </div>
    </div>
  );
}

function MlBody({ accent }: { accent: Accent }) {
  const bars = [35, 55, 45, 70, 60, 85, 75];
  return (
    <div className="grid h-full grid-cols-[1fr_2fr] gap-2">
      <div className="space-y-1.5">
        {[
          ["Accuracy", "94%"],
          ["F1", "0.91"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md bg-muted px-1.5 py-1">
            <p className="text-[0.5rem] text-muted-foreground">{k}</p>
            <p className={cn("text-[0.7rem] font-semibold", accent.text)}>{v}</p>
          </div>
        ))}
      </div>
      <div className="flex h-full items-end gap-1 rounded-md bg-muted/60 p-1.5">
        {bars.map((h, i) => (
          <div key={i} className={cn("flex-1 rounded-t-sm", i === bars.length - 2 ? accent.bg : "bg-border", i === bars.length - 2 && "ring-1", i === bars.length - 2 && accent.ring)} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function StoreBody({ accent }: { accent: Accent }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Line w="35%" />
        <span className="relative">
          <ShoppingCart className={cn("size-3.5", accent.text)} aria-hidden />
          <span className="absolute -top-1 -right-1.5 grid size-2.5 place-items-center rounded-full bg-primary text-[0.4rem] text-primary-foreground">2</span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col rounded-md border border-border/70 p-1">
            <div className={cn("flex-1 rounded", i === 1 ? accent.bg : "bg-muted")} />
            <Line w="80%" className="mt-1" />
            <p className="mt-0.5 text-[0.5rem] font-semibold">₹{[499, 1299, 799][i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingBody({ accent }: { accent: Accent }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Line w="18%" className="bg-foreground/30" />
        <div className="flex gap-1">
          <Line w="1rem" />
          <Line w="1rem" />
          <Line w="1rem" />
        </div>
      </div>
      <div className="mt-1 grid flex-1 grid-cols-[3fr_2fr] gap-2">
        <div className="space-y-1.5 pt-1">
          <div className="h-2 w-[90%] rounded-full bg-foreground/30" />
          <div className="h-2 w-[65%] rounded-full bg-foreground/30" />
          <Line w="80%" />
          <div className={cn("mt-1 h-3.5 w-12 rounded-md ring-1", accent.bg, accent.ring)} />
        </div>
        <div className={cn("rounded-lg", accent.bg)} />
      </div>
    </div>
  );
}

function IotBody({ accent }: { accent: Accent }) {
  return (
    <div className="grid h-full grid-cols-3 gap-1.5">
      {[
        { label: "Temp", value: "27°", pct: 62 },
        { label: "Humidity", value: "54%", pct: 54 },
        { label: "Power", value: "ON", pct: 100 },
      ].map((g, i) => (
        <div key={g.label} className="flex flex-col items-center justify-center rounded-md bg-muted/70 p-1">
          <div className="relative size-9">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="18" cy="18" r="14" fill="none" stroke={accent.from} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(g.pct / 100) * 88} 88`} />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[0.5rem] font-semibold">{g.value}</span>
          </div>
          <span className="mt-0.5 flex items-center gap-0.5 text-[0.45rem] text-muted-foreground">
            {i === 0 ? <Thermometer className="size-2" aria-hidden /> : i === 2 ? <Wifi className="size-2" aria-hidden /> : null}
            {g.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SecurityBody({ accent }: { accent: Accent }) {
  return (
    <div className="grid h-full grid-cols-[1fr_2fr] gap-2">
      <div className={cn("grid place-items-center rounded-lg ring-1", accent.bg, accent.ring)}>
        <ShieldCheck className={cn("size-6", accent.text)} aria-hidden />
      </div>
      <div className="space-y-1 rounded-md bg-foreground/90 p-1.5 font-mono text-[0.48rem] leading-tight text-background">
        <p className="flex items-center gap-1">
          <Check className="size-2 text-[oklch(0.75_0.17_150)]" aria-hidden /> scan complete
        </p>
        <p className="flex items-center gap-1">
          <Lock className="size-2" aria-hidden /> AES-256 enabled
        </p>
        <p className="text-[oklch(0.8_0.15_80)]">! 2 risky links flagged</p>
        <p className="opacity-60">$ _</p>
      </div>
    </div>
  );
}

function DashboardBody({ accent }: { accent: Accent }) {
  return (
    <div className="grid h-full grid-cols-[1fr_4fr] gap-2">
      <div className="space-y-1.5 rounded-md bg-muted/70 p-1.5">
        <div className={cn("h-1.5 rounded-full", accent.bg, "ring-1", accent.ring)} />
        <Line w="80%" />
        <Line w="70%" />
        <Line w="85%" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md bg-muted/70 p-1">
              <Line w="60%" />
              <div className={cn("mt-1 h-2 w-1/2 rounded-sm", i === 0 ? accent.bg : "bg-foreground/20")} />
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-1 rounded-md border border-border/70 p-1.5">
          {[90, 75, 82].map((w, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-border" />
              <Line w={`${w}%`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
