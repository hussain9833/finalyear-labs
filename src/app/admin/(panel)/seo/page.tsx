import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { requireAdminPage } from "@/lib/auth/dal";
import { connectDB } from "@/lib/db/connect";
import { Category, Degree, Project } from "@/lib/db/models";
import { getSitemapEntries } from "@/lib/seo/sitemap";
import { absoluteUrl } from "@/lib/site";
import { PageHeader, Panel, StatCard } from "@/components/admin/ui";

export const metadata = { title: "SEO health" };

type Issue = { label: string; items: { name: string; href: string }[]; hint: string };

export default async function SeoDashboard() {
  await requireAdminPage("seo.view");
  await connectDB();
  const [projects, categories, degrees, sitemap] = await Promise.all([
    Project.find({ status: "published" }).select("name slug shortDescription seo thumbnail screenshots isSample").lean(),
    Category.find().select("name slug seo content published").lean(),
    Degree.find().select("name slug seo content published").lean(),
    getSitemapEntries(),
  ]);
  const p = (x: (typeof projects)[number]) => ({ name: x.name, href: `/admin/projects/${x._id}` });

  const issues: Issue[] = [
    { label: "Missing custom SEO title", items: projects.filter((x) => !x.seo?.title).map(p), hint: "Optional — an automatic title is generated from name + degrees." },
    { label: "Missing custom meta description", items: projects.filter((x) => !x.seo?.description).map(p), hint: "Optional — generated from the short description, stack and degrees." },
    { label: "Short description under 70 characters", items: projects.filter((x) => (x.shortDescription ?? "").length < 70).map(p), hint: "Short descriptions feed cards and default meta descriptions." },
    { label: "Missing OG image", items: projects.filter((x) => !x.seo?.ogImage).map(p), hint: "Optional — a branded social card is generated automatically." },
    { label: "Missing project image (thumbnail)", items: projects.filter((x) => !x.thumbnail?.url).map(p), hint: "A generated cover is shown, but real screenshots convert better." },
    { label: "No screenshots", items: projects.filter((x) => !(x.screenshots ?? []).length).map(p), hint: "Screenshots help students understand the project." },
    { label: "Custom canonical set", items: projects.filter((x) => x.seo?.canonical).map(p), hint: "These are excluded from the sitemap. Make sure the canonical is intentional." },
    { label: "noindex pages", items: [...projects.filter((x) => x.seo?.noindex).map(p), ...categories.filter((c) => c.seo?.noindex).map((c) => ({ name: `Category: ${c.name}`, href: `/admin/categories/${c._id}` })), ...degrees.filter((d) => d.seo?.noindex).map((d) => ({ name: `Degree: ${d.name}`, href: `/admin/degrees/${d._id}` }))], hint: "Hidden from search engines and the sitemap." },
    { label: "Sample listings still published", items: projects.filter((x) => x.isSample).map(p), hint: "Replace sample content with real projects before launch." },
    {
      label: "Hub pages with thin content (< 2 sections)",
      items: [
        ...categories.filter((c) => (c.content?.sections ?? []).length < 2).map((c) => ({ name: `Category: ${c.name}`, href: `/admin/categories/${c._id}` })),
        ...degrees.filter((d) => (d.content?.sections ?? []).length < 2).map((d) => ({ name: `Degree: ${d.name}`, href: `/admin/degrees/${d._id}` })),
      ],
      hint: "Degree/category pages should carry genuinely useful guidance.",
    },
  ];

  return (
    <>
      <PageHeader title="SEO health" description="Keep the catalog search-ready as it grows." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Published projects" value={projects.length} />
        <StatCard label="Sitemap URLs" value={sitemap.length} hint="Excludes noindex and canonicalised pages" />
        <StatCard label="Categories / degrees" value={`${categories.length} / ${degrees.length}`} />
        <StatCard label="noindex pages" value={issues[7]!.items.length} />
      </div>
      <Panel title="Sitemap & robots" className="mt-6">
        <p className="text-sm text-muted-foreground">
          Sitemap: <a className="text-primary hover:underline" href="/sitemap.xml" target="_blank" rel="noopener">{absoluteUrl("/sitemap.xml")}</a> · Robots:{" "}
          <a className="text-primary hover:underline" href="/robots.txt" target="_blank" rel="noopener">{absoluteUrl("/robots.txt")}</a>. Submit the sitemap in Google Search Console.
        </p>
      </Panel>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {issues.map((issue) => (
          <Panel
            key={issue.label}
            title={issue.label}
            action={issue.items.length ? <span className="inline-flex items-center gap-1 text-xs font-medium text-warning"><AlertTriangle className="size-3.5" aria-hidden /> {issue.items.length}</span> : <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="size-3.5" aria-hidden /> OK</span>}
          >
            <p className="text-xs text-muted-foreground">{issue.hint}</p>
            {issue.items.length > 0 && (
              <ul className="mt-3 grid gap-1 text-sm">
                {issue.items.slice(0, 8).map((i) => (
                  <li key={i.href + i.name}>
                    <Link href={i.href} className="hover:text-primary">{i.name}</Link>
                  </li>
                ))}
                {issue.items.length > 8 && <li className="text-xs text-muted-foreground">+{issue.items.length - 8} more</li>}
              </ul>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
}
