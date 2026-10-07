import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleDot,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  Monitor,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getCatalog, getTestimonials } from "@/lib/data/catalog";
import { relatedProjects } from "@/lib/search/filters";
import { projectJsonLd } from "@/lib/seo/jsonld";
import { LEVEL_LABEL, PLATFORM_LABEL } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { ProjectDetail } from "@/lib/types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { AIBadge, DifficultyMeter, FeaturedBadge, SampleBadge } from "@/components/projects/badges";
import { CompareToggle } from "@/components/projects/compare-controls";
import { TrackedExternalLink } from "@/components/projects/tracked-link";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Faq } from "@/components/marketing/faq";
import { TestimonialCard } from "@/components/marketing/testimonials";
import { CtaBand } from "@/components/marketing/content-sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { Reveal } from "@/components/motion/reveal";
import { ProjectGallery } from "./project-gallery";
import { MobileStickyCta } from "./mobile-sticky-cta";
import { ProjectViewTracker } from "./project-view-tracker";
import { VideoEmbed } from "./video-embed";

export async function ProjectDetailView({ project }: { project: ProjectDetail }) {
  const [{ projects }, testimonials] = await Promise.all([getCatalog(), getTestimonials(project.slug)]);
  const related = relatedProjects(project, projects, 6);
  const primaryDegree = project.degrees[0];

  const facts = [
    { icon: GraduationCap, label: "Suitable for", value: project.degrees.map((d) => d.name).join(", ") || "All technical degrees" },
    { icon: Layers, label: "Level", value: LEVEL_LABEL[project.level] },
    { icon: Monitor, label: "Platform", value: PLATFORM_LABEL[project.platform] },
    { icon: ShieldCheck, label: "Admin panel", value: project.hasAdminPanel ? "Included" : "Not included" },
    { icon: Lock, label: "Authentication", value: project.hasAuth ? "Included" : "Not included" },
    { icon: FileText, label: "Documentation", value: project.documentation.included ? "Template included" : "On request" },
  ];

  return (
    <>
      <ProjectViewTracker slug={project.slug} category={project.category.slug} />
      {project.seo.structuredData !== false && <JsonLd data={projectJsonLd(project, testimonials)} />}

      <div className="container-page pt-6 pb-28 md:pt-10 md:pb-16">
        <Breadcrumbs
          items={[
            { name: "Projects", path: "/projects" },
            { name: project.category.name, path: `/projects/${project.category.slug}` },
            { name: project.name, path: `/projects/${project.slug}` },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          {/* ------------------------------ Main column ----------------------------- */}
          <article className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/projects/${project.category.slug}`} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/70">
                  {project.category.name}
                </Link>
                {project.isAI && <AIBadge />}
                {project.featured && <FeaturedBadge />}
                {project.isSample && <SampleBadge />}
              </div>
              <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{project.name}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{project.shortDescription}</p>

              {/* Mobile price + primary actions (desktop uses the sticky pricing card) */}
              <div className="mt-6 rounded-2xl border border-border bg-card p-4 lg:hidden">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Starting from
                    <span className="block text-2xl font-semibold tracking-tight text-foreground">{formatPrice(project.priceFrom, project.currency)}</span>
                  </p>
                  <DifficultyMeter difficulty={project.difficulty} />
                </div>
                <div id="inline-cta" className="mt-4 grid gap-2">
                  <WhatsAppButton intent="project" cta="project_detail" project={project.slug} degree={primaryDegree?.slug} size="lg">
                    Get This Project
                  </WhatsAppButton>
                  <div className="grid grid-cols-2 gap-2">
                    {project.demoUrl ? (
                      <TrackedExternalLink
                        href={project.demoUrl}
                        event="project_demo_click"
                        props={{ projectSlug: project.slug, ctaLocation: "project_detail" }}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                      >
                        Live demo <ExternalLink className="size-3.5" aria-hidden />
                      </TrackedExternalLink>
                    ) : (
                      <span className="inline-flex h-11 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">Demo on request</span>
                    )}
                    <CompareToggle slug={project.slug} name={project.name} variant="button" className="justify-center" />
                  </div>
                </div>
              </div>
            </header>

            <div className="mt-8">
              <ProjectGallery name={project.name} cover={project} screenshots={project.screenshots} />
            </div>

            {/* Quick facts */}
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl border border-border bg-card p-4">
                  <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                    <f.icon className="size-3.5" aria-hidden /> {f.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <DetailSection id="technologies" title="Technologies">
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-mono text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </DetailSection>

            {project.description && (
              <DetailSection id="overview" title="Overview">
                <div className="max-w-[68ch] space-y-4 leading-relaxed text-muted-foreground">
                  {project.description.split(/\n{2,}/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </DetailSection>
            )}

            {project.features.length > 0 && (
              <DetailSection id="features" title="Features">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-medium">{f.title}</span>
                        {f.description && <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{f.description}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {project.modules.length > 0 && (
              <DetailSection id="modules" title="Project modules">
                <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                  {project.modules.map((mod, i) => (
                    <details key={mod.name} className="group px-5 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
                      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-4">
                        <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-medium">{mod.name}</span>
                        <span className="text-xs text-muted-foreground">{mod.items.length ? `${mod.items.length} parts` : ""}</span>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
                      </summary>
                      <div className="pb-5 pl-8">
                        {mod.description && <p className="text-sm leading-relaxed text-muted-foreground">{mod.description}</p>}
                        {mod.items.length > 0 && (
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {mod.items.map((it) => (
                              <li key={it} className="flex items-center gap-2 text-sm">
                                <CircleDot className="size-3.5 text-primary" aria-hidden /> {it}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </DetailSection>
            )}

            {project.howItWorks.length > 0 && (
              <DetailSection id="how-it-works" title="How it works">
                <ol className="relative grid gap-6 border-l border-border pl-6">
                  {project.howItWorks.map((s, i) => (
                    <li key={s.title} className="relative">
                      <span className="absolute top-0 -left-[2.3rem] grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-4 ring-background">
                        {i + 1}
                      </span>
                      <p className="font-medium">{s.title}</p>
                      {s.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>}
                    </li>
                  ))}
                </ol>
              </DetailSection>
            )}

            {project.videoUrl && (
              <DetailSection id="video" title="Video walkthrough">
                <VideoEmbed url={project.videoUrl} title={`${project.name} walkthrough`} />
              </DetailSection>
            )}

            {project.whatYouGet.length > 0 && (
              <DetailSection id="what-you-get" title="What you get">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.whatYouGet.map((w) => (
                    <li key={w.title} className={cn("flex gap-3 rounded-xl border p-4", w.included ? "border-border bg-card" : "border-dashed border-border")}>
                      {w.included ? (
                        <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                      ) : (
                        <Wrench className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                      <span>
                        <span className="block font-medium">
                          {w.title}
                          {!w.included && <span className="ml-2 text-xs font-normal text-muted-foreground">(on request)</span>}
                        </span>
                        {w.description && <span className="mt-1 block text-sm text-muted-foreground">{w.description}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
                  Documentation and presentation templates are resources to help you get started. Adapt them to your actual
                  implementation and your institution&apos;s requirements.
                </p>
              </DetailSection>
            )}

            {project.documentation.included && project.documentation.items.length > 0 && (
              <DetailSection id="documentation" title="Documentation included">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="size-4 text-primary" aria-hidden /> Project-book template sections
                  </p>
                  <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {project.documentation.items.map((d) => (
                      <li key={d} className="flex items-center gap-2">
                        <Check className="size-3.5 text-success" aria-hidden /> {d}
                      </li>
                    ))}
                  </ul>
                  {project.documentation.note && <p className="mt-4 text-sm text-muted-foreground">{project.documentation.note}</p>}
                </div>
              </DetailSection>
            )}

            {project.customization.available && (
              <DetailSection id="customization" title="Customization options">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/[0.06] to-transparent p-5">
                  <p className="flex items-center gap-2 font-medium">
                    <Settings2 className="size-4 text-primary" aria-hidden /> Make it your own
                  </p>
                  {project.customization.options.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {project.customization.options.map((o) => (
                        <li key={o} className="flex items-center gap-2 text-sm">
                          <Check className="size-3.5 text-primary" aria-hidden /> {o}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 text-sm text-muted-foreground">
                    {project.customization.note || "Customization is quoted separately based on your requirements."}
                  </p>
                  <WhatsAppButton intent="project" cta="project_detail" project={project.slug} degree={primaryDegree?.slug} variant="outline" className="mt-5">
                    Discuss customization
                  </WhatsAppButton>
                </div>
              </DetailSection>
            )}

            {project.faqs.length > 0 && (
              <DetailSection id="faq" title="FAQ">
                <Faq items={project.faqs} />
              </DetailSection>
            )}

            {testimonials.length > 0 && (
              <DetailSection id="testimonials" title="What students say">
                <div className="grid gap-4 sm:grid-cols-2">
                  {testimonials.slice(0, 4).map((t) => (
                    <TestimonialCard key={t.id} t={t} />
                  ))}
                </div>
              </DetailSection>
            )}
          </article>

          {/* ---------------------------- Pricing rail ---------------------------- */}
          <aside className="hidden lg:block" aria-label="Pricing">
            <div id="pricing-card" className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">{formatPrice(project.priceFrom, project.currency)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Final price depends on customization and documentation needs.</p>
              <div className="mt-5 grid gap-2">
                <WhatsAppButton intent="project" cta="pricing" project={project.slug} degree={primaryDegree?.slug} size="lg" className="w-full">
                  Get This Project
                </WhatsAppButton>
                {project.demoUrl && (
                  <TrackedExternalLink
                    href={project.demoUrl}
                    event="project_demo_click"
                    props={{ projectSlug: project.slug, ctaLocation: "pricing" }}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                  >
                    View live demo <ExternalLink className="size-3.5" aria-hidden />
                  </TrackedExternalLink>
                )}
                <CompareToggle slug={project.slug} name={project.name} variant="button" className="justify-center" />
              </div>
              <ul className="mt-6 grid gap-2.5 border-t border-border pt-5 text-sm">
                {project.whatYouGet
                  .filter((w) => w.included)
                  .slice(0, 6)
                  .map((w) => (
                    <li key={w.title} className="flex items-center gap-2">
                      <Check className="size-4 text-success" aria-hidden /> {w.title}
                    </li>
                  ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <DifficultyMeter difficulty={project.difficulty} />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20">
            <Reveal className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 id="related-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
                Related projects
              </h2>
              <nav aria-label="More projects" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {primaryDegree && (
                  <Link href={`/projects/${primaryDegree.slug}`} className="font-medium text-primary hover:underline">
                    More {primaryDegree.name} projects
                  </Link>
                )}
                <Link href={`/projects/${project.category.slug}`} className="font-medium text-primary hover:underline">
                  More {project.category.name}
                </Link>
              </nav>
            </Reveal>
            <ProjectGrid projects={related} />
          </section>
        )}

        <div className="mt-20">
          <CtaBand title="Want this project with your own features?" body="Tell us what your synopsis needs. We can add modules, change the stack or build something new." cta="project_detail" />
        </div>
      </div>

      <MobileStickyCta slug={project.slug} name={project.name} price={formatPrice(project.priceFrom, project.currency)} degree={primaryDegree?.slug} />
    </>
  );
}

function DetailSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-14">
      <h2 id={`${id}-title`} className="mb-5 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}
