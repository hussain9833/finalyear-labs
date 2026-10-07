"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { GitCompareArrows, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COMPARE_MAX, compareStore, useCompare } from "@/lib/compare-store";

/** Accessible toggle used on project cards and the detail page. */
export function CompareToggle({ slug, name, className, variant = "chip" }: { slug: string; name: string; className?: string; variant?: "chip" | "button" }) {
  const items = useCompare();
  const selected = items.some((i) => i.slug === slug);

  function onClick() {
    const result = compareStore.toggle({ slug, name });
    if (result === "full") toast.info(`You can compare up to ${COMPARE_MAX} projects. Remove one first.`);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium transition-colors",
        variant === "chip"
          ? "h-8 rounded-full border px-3 text-xs backdrop-blur-md"
          : "h-11 rounded-xl border px-4 text-sm",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/85 text-foreground hover:border-primary/50",
        className,
      )}
    >
      <GitCompareArrows className="size-3.5" aria-hidden />
      {selected ? "Comparing" : "Compare"}
      <span className="sr-only"> {name}</span>
    </button>
  );
}

/** Floating tray shown while 1–3 projects are selected. Sits above the mobile sticky CTA. */
export function CompareTray() {
  const items = useCompare();
  const pathname = usePathname();
  const onProjectPage = /^\/projects\/[^/]+$/.test(pathname ?? "");
  const visible = items.length > 0 && pathname !== "/compare";

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            "fixed inset-x-3 z-30 mx-auto max-w-xl md:bottom-5",
            onProjectPage ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]" : "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]",
          )}
          role="region"
          aria-label="Compare selection"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-popover/95 p-2 pl-3 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <ul className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-none">
              {items.map((i) => (
                <li key={i.slug} className="flex shrink-0 items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-xs font-medium">
                  <span className="max-w-[9rem] truncate">{i.name}</span>
                  <button
                    type="button"
                    onClick={() => compareStore.remove(i.slug)}
                    className="grid size-6 place-items-center rounded-full hover:bg-background"
                    aria-label={`Remove ${i.name} from comparison`}
                  >
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href={`/compare?p=${items.map((i) => i.slug).join(",")}`}
              aria-disabled={items.length < 2}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-sm font-medium transition-colors",
                items.length < 2 ? "pointer-events-none bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              <GitCompareArrows className="size-4" aria-hidden />
              Compare {items.length}/{COMPARE_MAX}
            </Link>
          </div>
          {items.length < 2 && <p className="mt-1.5 text-center text-xs text-muted-foreground">Select at least 2 projects to compare</p>}
        </m.div>
      )}
    </AnimatePresence>
  );
}
