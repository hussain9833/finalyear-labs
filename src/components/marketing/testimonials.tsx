import { Quote, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { TestimonialDTO } from "@/lib/types";

/** Renders only real, consented testimonials. Returns nothing when there are none. */
export function Testimonials({ items }: { items: TestimonialDTO[] }) {
  if (!items.length) return null;
  return (
    <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <StaggerItem key={t.id}>
          <TestimonialCard t={t} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function TestimonialCard({ t }: { t: TestimonialDTO }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <Quote className="size-5 text-primary" aria-hidden />
      {typeof t.rating === "number" && (
        <p className="mt-3 flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={i < t.rating! ? "size-4 fill-[oklch(0.8_0.15_80)] text-[oklch(0.8_0.15_80)]" : "size-4 text-border"} aria-hidden />
          ))}
        </p>
      )}
      <blockquote className="mt-3 flex-1 leading-relaxed">“{t.quote}”</blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-semibold">{t.name}</span>
        <span className="block text-muted-foreground">{[t.degree, t.college].filter(Boolean).join(" · ")}</span>
      </figcaption>
    </figure>
  );
}
