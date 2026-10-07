import {
  BarChart3,
  Bot,
  Brain,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers,
  LayoutTemplate,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Accent } from "@/lib/constants";

/** Icon keys admins can assign to categories (stored as strings in the DB). */
export const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  database: Database,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  "layout-template": LayoutTemplate,
  smartphone: Smartphone,
  brain: Brain,
  "bar-chart": BarChart3,
  cpu: Cpu,
  shield: ShieldCheck,
  cloud: Cloud,
  bot: Bot,
  code: Code2,
  workflow: Workflow,
};
export const ICON_KEYS = Object.keys(ICONS);

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Layers;
  return <Icon className={className} aria-hidden="true" />;
}

/** Accent token → utility classes (static strings so Tailwind can see them). */
export const ACCENT_CLASSES: Record<Accent, { text: string; bg: string; ring: string; glow: string; from: string }> = {
  iris: { text: "text-[oklch(0.55_0.2_277)] dark:text-[oklch(0.75_0.15_277)]", bg: "bg-[oklch(0.55_0.2_277/0.1)]", ring: "ring-[oklch(0.55_0.2_277/0.25)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.55_0.2_277/0.45)]", from: "oklch(0.55 0.2 277)" },
  cyan: { text: "text-[oklch(0.58_0.12_210)] dark:text-[oklch(0.8_0.12_205)]", bg: "bg-[oklch(0.68_0.14_205/0.12)]", ring: "ring-[oklch(0.68_0.14_205/0.3)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.68_0.14_205/0.5)]", from: "oklch(0.68 0.14 205)" },
  amber: { text: "text-[oklch(0.62_0.15_60)] dark:text-[oklch(0.82_0.14_75)]", bg: "bg-[oklch(0.75_0.16_70/0.14)]", ring: "ring-[oklch(0.75_0.16_70/0.3)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.75_0.16_70/0.5)]", from: "oklch(0.75 0.16 70)" },
  rose: { text: "text-[oklch(0.58_0.2_15)] dark:text-[oklch(0.78_0.15_15)]", bg: "bg-[oklch(0.64_0.2_15/0.12)]", ring: "ring-[oklch(0.64_0.2_15/0.3)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.64_0.2_15/0.45)]", from: "oklch(0.64 0.2 15)" },
  emerald: { text: "text-[oklch(0.55_0.13_160)] dark:text-[oklch(0.78_0.14_160)]", bg: "bg-[oklch(0.65_0.15_160/0.12)]", ring: "ring-[oklch(0.65_0.15_160/0.3)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.65_0.15_160/0.45)]", from: "oklch(0.65 0.15 160)" },
  violet: { text: "text-[oklch(0.55_0.22_300)] dark:text-[oklch(0.76_0.16_300)]", bg: "bg-[oklch(0.6_0.22_300/0.12)]", ring: "ring-[oklch(0.6_0.22_300/0.3)]", glow: "group-hover:shadow-[0_8px_40px_-12px_oklch(0.6_0.22_300/0.45)]", from: "oklch(0.6 0.22 300)" },
};
