import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalog, getProjectDetail, projectsForCategory, projectsForDegree, resolveProjectsSlug } from "@/lib/data/catalog";
import { categoryMetadata, degreeMetadata, projectMetadata } from "@/lib/seo/metadata";
import { DegreeHub } from "@/components/hubs/degree-hub";
import { CategoryHub } from "@/components/hubs/category-hub";
import { ProjectDetailView } from "@/components/project-detail/project-detail-view";

/**
 * Shared namespace: /projects/bca (degree) · /projects/ai (category) · /projects/ai-resume-analyzer (project).
 * Slugs are unique across all three collections (enforced in the CMS).
 *
 * `params` is awaited at the top (not inside Suspense) so unknown slugs return a real HTTP 404 instead of a
 * soft-404 inside a 200 shell — important for SEO. Known slugs are prerendered via generateStaticParams;
 * new slugs render on first request and are then cached.
 */
export const instant = false;

export async function generateStaticParams() {
  try {
    const { projects, degrees, categories } = await getCatalog();
    const slugs = [...degrees.map((d) => d.slug), ...categories.map((c) => c.slug), ...projects.map((p) => p.slug)];
    // Cache Components requires at least one param; the placeholder resolves to notFound().
    return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "__placeholder__" }];
  } catch {
    return [{ slug: "__placeholder__" }];
  }
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProjectsSlug(slug);
  const { projects } = await getCatalog();
  switch (resolved.kind) {
    case "degree":
      return degreeMetadata(resolved.degree, projectsForDegree(projects, resolved.degree.slug).length);
    case "category":
      return categoryMetadata(resolved.category, projectsForCategory(projects, resolved.category.slug).length);
    case "project": {
      const project = await getProjectDetail(slug);
      return project ? projectMetadata(project) : {};
    }
    default:
      return {};
  }
}

export default async function ProjectsSlugPage({ params, searchParams }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const resolved = await resolveProjectsSlug(slug);

  switch (resolved.kind) {
    case "degree":
      return <DegreeHub degree={resolved.degree} searchParams={searchParams} />;
    case "category":
      return <CategoryHub category={resolved.category} searchParams={searchParams} />;
    case "project": {
      const project = await getProjectDetail(slug);
      if (!project) notFound();
      return <ProjectDetailView project={project} />;
    }
    default:
      notFound();
  }
}
