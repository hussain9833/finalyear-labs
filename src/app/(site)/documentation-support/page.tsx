import { buildMetadata } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/data/catalog";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CtaBand, DocumentationSection } from "@/components/marketing/content-sections";
import { Faq } from "@/components/marketing/faq";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Final Year Project Report & Documentation Support",
  description:
    "Structured project-report templates and resources — abstract, system design, database design, modules, testing and more — that you adapt to your own project and university format.",
  path: "/documentation-support",
});

const STEPS = [
  { title: "Start from the structure", body: "Use the template's sections and headings as a checklist, then compare them with your university's prescribed format." },
  { title: "Describe your real implementation", body: "Rewrite each section around what you actually built — your problem statement, modules, database tables and screenshots." },
  { title: "Draw your own diagrams", body: "Update DFD, ER and UML diagrams to match your final design. Examiners often ask you to explain them." },
  { title: "Test and record results", body: "Document real test cases and outcomes from your project, including what failed and how you fixed it." },
  { title: "Prepare for the viva", body: "Use the project explanation to rehearse how the system works end-to-end, and be ready to discuss limitations and future scope." },
];

export default async function DocumentationSupportPage() {
  const faqs = await getFaqs("documentation");
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Documentation support", path: "/documentation-support" }]} />
      <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">Project report & documentation support</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        A strong report explains your project as clearly as your demo does. Our resources give you a solid structure — you make it yours.
      </p>

      <div className="mt-16">
        <DocumentationSection compact />
      </div>

      <section className="mt-20" aria-labelledby="adapt-title">
        <h2 id="adapt-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          How to adapt a template properly
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.05} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {faqs.length > 0 && (
        <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.5fr]" aria-labelledby="doc-faq">
          <h2 id="doc-faq" className="text-2xl font-semibold tracking-tight">
            Documentation FAQs
          </h2>
          <Faq items={faqs} />
        </section>
      )}

      <div className="mt-20">
        <CtaBand title="Need help with your project report?" body="Ask about documentation resources for a specific project, or for a project you're building yourself." />
      </div>
    </div>
  );
}
