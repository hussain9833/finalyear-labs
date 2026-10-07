import { Check } from "lucide-react";
import { getCatalog, getFaqs } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CustomProjectForm } from "@/components/forms/custom-project-form";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { Faq } from "@/components/marketing/faq";

export const metadata = buildMetadata({
  title: "Custom Final Year Project Development",
  description:
    "Need a final-year project built around your own requirements? Share your degree, technology, features, budget and deadline — we'll help you plan, build and understand it.",
  path: "/custom-project",
});

const POINTS = [
  "Built around your synopsis and university guidelines",
  "Your choice of technology stack",
  "AI features on request",
  "Explanation so you can present it confidently",
  "Documentation resources you adapt to your project",
];

export default async function CustomProjectPage() {
  const [{ degrees, categories }, faqs] = await Promise.all([getCatalog(), getFaqs("custom-project")]);
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Custom project", path: "/custom-project" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Request a custom project</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Have a specific idea, or a synopsis your guide has already approved? Tell us what you need and we&apos;ll get back to you
            with a plan, timeline and quote.
          </p>
          <ul className="mt-8 grid gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5">
            <p className="font-medium">Prefer to chat?</p>
            <p className="mt-1 text-sm text-muted-foreground">Share your requirements directly on WhatsApp.</p>
            <WhatsAppButton intent="custom" cta="custom_project" variant="outline" className="mt-4">
              Discuss on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
        <CustomProjectForm degrees={degrees.map((d) => ({ value: d.slug, label: d.name }))} categories={categories.map((c) => ({ value: c.slug, label: c.name }))} />
      </div>
      {faqs.length > 0 && (
        <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.5fr]" aria-labelledby="custom-faq">
          <h2 id="custom-faq" className="text-2xl font-semibold tracking-tight">
            Custom project FAQs
          </h2>
          <Faq items={faqs} />
        </section>
      )}
    </div>
  );
}
