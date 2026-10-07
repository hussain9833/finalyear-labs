import { notFound } from "next/navigation";
import { getPost, getPublishedPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/marketing/content-sections";

export const instant = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts().catch(() => []);
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo.ogImage ?? post.coverUrl,
    noindex: post.seo.noindex,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Guides", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: post.author || siteConfig.name },
          publisher: { "@id": absoluteUrl("/#organization") },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />
      <article className="mx-auto mt-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-10 grid gap-8">
          {post.body.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              {s.body.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="mt-3 leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
      <div className="mt-20">
        <CtaBand />
      </div>
    </div>
  );
}
