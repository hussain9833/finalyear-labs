import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog, getFaqs, getTestimonials } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/marketing/hero";
import { Section, SectionHeading } from "@/components/marketing/section";
import { DegreeGrid } from "@/components/marketing/degree-grid";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { CtaBand, DocumentationSection, HowItWorks, TrustSection } from "@/components/marketing/content-sections";
import { FinderTeaser } from "@/components/marketing/finder-teaser";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";
import { StudentBenefits } from "@/components/marketing/student-benefits";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { ProjectGrid } from "@/components/projects/project-grid";

export const metadata = buildMetadata({
  title: `Final Year Projects for BCA, MCA, B.Tech & More | ${siteConfig.name}`,
  absoluteTitle: true,
  description:
    "Final-year and semester projects for BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech — Web, AI and E-Commerce projects with source code, live demos, documentation resources, customization and WhatsApp support.",
  path: "/",
});

export default async function HomePage() {
  const [{ projects, categories, degrees }, testimonials, faqs] = await Promise.all([
    getCatalog(),
    getTestimonials(),
    getFaqs("home"),
  ]);

  const degreeCounts = Object.fromEntries(
    degrees.map((d) => [d.slug, projects.filter((p) => p.degrees.some((x) => x.slug === d.slug)).length]),
  );
  const categoryCounts = Object.fromEntries(
    categories.map((c) => [c.slug, projects.filter((p) => p.categories.some((x) => x.slug === c.slug)).length]),
  );
  const featured = projects.filter((p) => p.featured);
  const showcase = (featured.length ? featured : projects).slice(0, 4);
  const highlighted = [...featured, ...projects.filter((p) => !p.featured)].slice(0, projects.length >= 6 ? 6 : 3);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero degrees={degrees} showcase={showcase} />

      <StatsStrip projects={projects.length} />

      <Section id="for-students" aria-labelledby="students-title">
        <SectionHeading
          id="students-title"
          eyebrow="For final-year students"
          title="Everything you need for your final-year project, in one place"
          description="No more searching GitHub for days. Choose a project, understand it, and get help right until your viva."
        />
        <StudentBenefits />
      </Section>

      <Section id="degrees" aria-labelledby="degrees-title">
        <SectionHeading
          id="degrees-title"
          eyebrow="Start with your degree"
          title="What's your degree?"
          description="Pick your programme to see projects that match its syllabus and expectations."
        />
        <DegreeGrid degrees={degrees} counts={degreeCounts} />
      </Section>

      <Section id="categories" className="pt-0 md:pt-0" aria-labelledby="categories-title">
        <SectionHeading
          id="categories-title"
          eyebrow="Browse by category"
          title="Projects for every level and budget"
          description="From your first static website to complete AI and e-commerce systems."
        />
        <CategoryGrid categories={categories} counts={categoryCounts} />
      </Section>

      {highlighted.length > 0 && (
        <Section className="bg-muted/30" aria-labelledby="featured-title">
          <SectionHeading
            id="featured-title"
            eyebrow={featured.length ? "Featured" : "Latest"}
            title="Projects students are exploring"
            action={
              <Link href="/projects" className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-5")}>
                View all projects <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <ProjectGrid projects={highlighted} />
        </Section>
      )}

      <Section id="how-it-works" aria-labelledby="how-title">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="From choosing to presenting — with help at every step"
          align="center"
        />
        <HowItWorks />
      </Section>

      <Section id="why-us" className="bg-muted/30" aria-labelledby="why-title">
        <SectionHeading
          id="why-title"
          eyebrow="Why choose us?"
          title={
            <>
              GitHub gives you repositories.
              <br className="hidden sm:block" /> We give you a complete project journey.
            </>
          }
          description="Don't just download code. Build a project you can understand, customize and confidently present."
        />
        <TrustSection />
      </Section>

      <Section aria-labelledby="docs-title">
        <DocumentationSection />
      </Section>

      <Section className="pt-0 md:pt-0" aria-labelledby="finder-title">
        <FinderTeaser degrees={degrees} categories={categories} />
      </Section>

      {testimonials.length > 0 && (
        <Section className="bg-muted/30" aria-labelledby="testimonials-title">
          <SectionHeading id="testimonials-title" eyebrow="Students" title="What students say" />
          <Testimonials items={testimonials} />
        </Section>
      )}

      {faqs.length > 0 && (
        <Section aria-labelledby="faq-title">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions students ask" description="Can't find your answer? Ask us on WhatsApp." />
            <Faq items={faqs} />
          </div>
        </Section>
      )}

      <Section className="pt-0 md:pt-0">
        <CtaBand />
      </Section>
    </>
  );
}
