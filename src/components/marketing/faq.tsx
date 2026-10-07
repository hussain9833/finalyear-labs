import { Plus } from "lucide-react";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import type { FaqItem } from "@/lib/types";

/**
 * Native <details> accordion: keyboard accessible, works without JS and keeps answers in the HTML.
 * Emits FAQPage JSON-LD only because these FAQs are visibly rendered here.
 */
export function Faq({ items, structuredData = true }: { items: FaqItem[]; structuredData?: boolean }) {
  if (!items.length) return null;
  return (
    <>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((f) => (
          <details key={f.question} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium">
              {f.question}
              <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" aria-hidden />
            </summary>
            <p className="pb-5 leading-relaxed whitespace-pre-line text-muted-foreground">{f.answer}</p>
          </details>
        ))}
      </div>
      {structuredData && <JsonLd data={faqJsonLd(items)} />}
    </>
  );
}
