import Link from "next/link";
import { SearchX } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-muted">
          <SearchX className="size-6 text-muted-foreground" aria-hidden />
        </span>
        <p className="mt-6 font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mt-3 max-w-md text-muted-foreground">The project may have moved or the link may be mistyped. Try searching, or browse projects by degree.</p>
        <form action="/projects" method="get" role="search" className="mt-8 flex w-full max-w-md gap-2">
          <label htmlFor="nf-search" className="sr-only">
            Search projects
          </label>
          <input
            id="nf-search"
            name="q"
            type="search"
            placeholder="Search projects…"
            className="h-12 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <button type="submit" className="h-12 rounded-xl bg-primary px-5 font-medium text-primary-foreground">
            Search
          </button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium hover:bg-muted">
            Go home
          </Link>
          <Link href="/projects" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium hover:bg-muted">
            All projects
          </Link>
          <WhatsAppButton intent="general" cta="not_found" variant="outline">
            Ask on WhatsApp
          </WhatsAppButton>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
