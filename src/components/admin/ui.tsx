import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/constants";

export const LEAD_STATUS_TONE: Record<LeadStatus, "blue" | "amber" | "violet" | "green" | "gray" | "red"> = {
  NEW: "blue",
  CONTACTED: "amber",
  INTERESTED: "violet",
  FOLLOW_UP: "amber",
  PURCHASED: "green",
  COMPLETED: "green",
  LOST: "gray",
};

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted">
      {children}
    </Link>
  );
}

export function StatusPill({ tone, children }: { tone: "green" | "amber" | "gray" | "blue" | "red" | "violet"; children: React.ReactNode }) {
  const tones = {
    green: "bg-success/12 text-success ring-success/25",
    amber: "bg-warning/15 text-[oklch(0.5_0.12_65)] ring-warning/30 dark:text-warning",
    gray: "bg-muted text-muted-foreground ring-border",
    blue: "bg-primary/10 text-primary ring-primary/25",
    red: "bg-destructive/10 text-destructive ring-destructive/25",
    violet: "bg-[oklch(0.6_0.2_300/0.12)] text-[oklch(0.5_0.2_300)] ring-[oklch(0.6_0.2_300/0.25)] dark:text-[oklch(0.8_0.14_300)]",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1", tones[tone])}>{children}</span>;
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{children}</p>;
}

/** Bar list (horizontal bars with labels) — accessible: values are in text, bars are decorative. */
export function BarList({ items, emptyText = "No data yet" }: { items: { label: string; value: number; href?: string }[]; emptyText?: string }) {
  if (!items.length) return <EmptyRow>{emptyText}</EmptyRow>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="grid gap-2.5">
      {items.map((i) => (
        <li key={i.label} className="grid gap-1">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            {i.href ? (
              <Link href={i.href} className="truncate hover:text-primary">
                {i.label}
              </Link>
            ) : (
              <span className="truncate">{i.label}</span>
            )}
            <span className="shrink-0 font-medium tabular-nums">{i.value.toLocaleString("en-IN")}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(2, (i.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
