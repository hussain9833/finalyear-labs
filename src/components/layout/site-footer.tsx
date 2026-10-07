import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { TAGS } from "@/lib/data/tags";
import { getCatalog } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/site";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { Logo } from "./logo";

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/custom-project", label: "Custom project" },
  { href: "/documentation-support", label: "Documentation support" },
  { href: "/project-finder", label: "Project finder" },
  { href: "/blog", label: "Guides" },
];

const LEGAL = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export async function SiteFooter() {
  // Cached (also makes the copyright year a cached value rather than a per-request clock read).
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.catalog);

  const { categories, degrees } = await getCatalog();
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
          <WhatsAppButton intent="general" cta="footer" variant="outline" className="mt-5">
            Chat with us
          </WhatsAppButton>
        </div>
        <FooterColumn
          title="Projects"
          className="md:col-span-3"
          links={[{ href: "/projects", label: "All projects" }, ...categories.map((c) => ({ href: `/projects/${c.slug}`, label: c.name }))]}
        />
        <FooterColumn title="Degrees" className="md:col-span-2" links={degrees.map((d) => ({ href: `/projects/${d.slug}`, label: `${d.name} projects` }))} />
        <FooterColumn title="Company" className="md:col-span-3" links={COMPANY} />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed">
            <strong className="font-medium text-foreground">Responsible use:</strong> {siteConfig.responsibleUse}
          </p>
          <nav aria-label="Legal" className="flex shrink-0 flex-wrap gap-x-4 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="container-page pb-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className }: { title: string; links: { href: string; label: string }[]; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 grid gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
