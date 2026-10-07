import { ArrowRight } from "lucide-react";
import { ACCENT_CLASSES, CategoryIcon } from "@/components/icon";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { TrackedLink } from "@/components/projects/tracked-link";
import { cn, formatPrice } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/types";

export function CategoryGrid({ categories, counts }: { categories: CategoryDTO[]; counts: Record<string, number> }) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c) => {
        const accent = ACCENT_CLASSES[c.accent] ?? ACCENT_CLASSES.iris;
        return (
          <StaggerItem key={c.slug} className="h-full">
            <TrackedLink
              href={`/projects/${c.slug}`}
              event="category_selected"
              props={{ category: c.slug, ctaLocation: "category_grid" }}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-transparent hover:ring-1",
                accent.ring,
                accent.glow,
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `color-mix(in oklch, ${accent.from} 30%, transparent)` }}
              />
              <span className={cn("grid size-11 place-items-center rounded-xl ring-1", accent.bg, accent.ring)}>
                <CategoryIcon name={c.icon} className={cn("size-5", accent.text)} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Starting from <span className="font-semibold text-foreground">{formatPrice(c.priceFrom, c.currency)}</span>
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
                {c.examples.slice(0, 3).map((e) => (
                  <li key={e} className="flex items-center gap-2">
                    <span className={cn("size-1.5 rounded-full", accent.bg, "ring-2", accent.ring)} aria-hidden />
                    {e}
                  </li>
                ))}
              </ul>
              <span className="mt-auto flex items-center justify-between pt-6 text-sm font-medium">
                <span>{counts[c.slug] ? `${counts[c.slug]} project${counts[c.slug] === 1 ? "" : "s"}` : "Explore"}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </TrackedLink>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
