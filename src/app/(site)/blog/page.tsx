import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getPublishedPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

// The index stays noindex until real posts exist (avoids an indexable thin page).
export async function generateMetadata() {
  const posts = await getPublishedPosts();
  return buildMetadata({
    title: "Final Year Project Guides",
    description: "Guides on choosing a final-year project, writing your project report, preparing for your viva and picking technologies.",
    path: "/blog",
    noindex: posts.length === 0,
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Guides", path: "/blog" }]} />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">Guides for final-year students</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Practical advice on choosing, building, documenting and presenting your project.</p>

      {posts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <BookOpen className="size-8 text-primary" aria-hidden />
          <p className="mt-4 text-lg font-semibold">Guides are coming soon</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We&apos;re writing guides on choosing a project, writing your report and preparing for your viva. Meanwhile, explore projects by degree.
          </p>
          <Link href="/projects" className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">
            Browse projects
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <p className="text-xs text-muted-foreground">
                  {new Date(p.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
