import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { ContentSection } from "@/lib/types";

/** Long-form, genuinely useful hub content (editable in the CMS). Rendered as plain text paragraphs. */
export function HubContent({ title, sections }: { title: string; sections: ContentSection[] }) {
  if (!sections.length) return null;
  return (
    <section aria-labelledby="guide-title" className="grid gap-10 lg:grid-cols-[18rem_1fr]">
      <div>
        <h2 id="guide-title" className="text-2xl font-semibold tracking-tight md:text-3xl lg:sticky lg:top-24">
          {title}
        </h2>
      </div>
      <div className="grid gap-8">
        {sections.map((s) => (
          <Reveal key={s.heading} as="article" className="border-b border-border pb-8 last:border-0">
            <h3 className="text-lg font-semibold">{s.heading}</h3>
            <div className="mt-3 max-w-[68ch] space-y-3 leading-relaxed text-muted-foreground">
              {s.body.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function LinkPills({ title, links }: { title: string; links: { href: string; label: string; meta?: string }[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title}>
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
            >
              {l.label}
              {l.meta && <span className="text-xs font-normal text-muted-foreground">{l.meta}</span>}
              <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
