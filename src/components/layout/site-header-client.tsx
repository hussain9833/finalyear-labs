"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";
import type { Accent } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ACCENT_CLASSES, CategoryIcon } from "@/components/icon";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const SearchDialog = dynamic(() => import("@/components/projects/search-dialog").then((m) => m.SearchDialog), {
  ssr: false,
});

export type NavData = {
  categories: { slug: string; name: string; icon: string; accent: Accent; priceFrom: number; description: string; count: number }[];
  degrees: { slug: string; name: string; fullName: string }[];
  popular: string[];
};

const LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/custom-project", label: "Custom Project" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeaderClient({ nav }: { nav: NavData }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K / "/" opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openSearch() {
    setSearchMounted(true);
    setSearchOpen(true);
    setMenuOpen(false);
  }

  const isActive = (href: string) => !href.includes("#") && pathname?.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-border/70 bg-background/80 shadow-[0_1px_0_0_var(--border)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
            : "border-b border-transparent bg-background/0",
        )}
      >
        <div className="container-page flex h-16 items-center gap-3">
          <Logo className="mr-2 shrink-0" />

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
              <PopoverTrigger
                openOnHover
                delay={80}
                className={cn(
                  "inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[popup-open]:text-foreground",
                  pathname?.startsWith("/projects") && "text-foreground",
                )}
              >
                Projects
                <ChevronDown className="size-4 transition-transform duration-200 [[data-popup-open]_&]:rotate-180" aria-hidden />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={10} className="w-[min(92vw,44rem)] rounded-2xl p-0">
                <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
                  <div className="p-3">
                    <p className="px-2 pt-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Categories</p>
                    <ul className="grid gap-1">
                      {nav.categories.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/projects/${c.slug}`}
                            onClick={() => setProjectsOpen(false)}
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted"
                          >
                            <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ring-1", ACCENT_CLASSES[c.accent].bg, ACCENT_CLASSES[c.accent].ring)}>
                              <CategoryIcon name={c.icon} className={cn("size-[1.1rem]", ACCENT_CLASSES[c.accent].text)} />
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 text-sm font-medium">
                                {c.name}
                                <span className="text-xs font-normal text-muted-foreground">from {formatPrice(c.priceFrom)}</span>
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">{c.description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-border bg-muted/40 p-3 md:border-t-0 md:border-l">
                    <p className="px-2 pt-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">By degree</p>
                    <ul className="grid grid-cols-2 gap-1">
                      {nav.degrees.map((d) => (
                        <li key={d.slug}>
                          <Link
                            href={`/projects/${d.slug}`}
                            onClick={() => setProjectsOpen(false)}
                            className="block rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-background"
                            title={d.fullName}
                          >
                            {d.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 grid gap-1 border-t border-border pt-3">
                      <Link href="/projects" onClick={() => setProjectsOpen(false)} className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-primary hover:bg-background">
                        All projects <ArrowRight className="size-4" aria-hidden />
                      </Link>
                      <Link href="/project-finder" onClick={() => setProjectsOpen(false)} className="rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground">
                        Help me choose
                      </Link>
                      <Link href="/compare" onClick={() => setProjectsOpen(false)} className="rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground">
                        Compare projects
                      </Link>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive(l.href) && "text-foreground",
                )}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={openSearch}
              className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-muted/40 pr-2 pl-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden xl:inline">Search projects…</span>
              <span className="xl:hidden">Search</span>
              <kbd className="ml-2 hidden rounded-md border border-border bg-background px-1.5 font-mono text-[0.7rem] xl:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Search projects"
            >
              <Search className="size-[1.15rem]" />
            </button>
            <ThemeToggle />
            <WhatsAppButton intent="general" cta="navbar" size="sm" className="ml-1 hidden sm:inline-flex">
              WhatsApp
            </WhatsAppButton>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                className="inline-flex size-10 items-center justify-center rounded-xl text-foreground hover:bg-muted lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm gap-0 overflow-y-auto p-0">
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col gap-6 px-5 py-5">
                  <button
                    type="button"
                    onClick={openSearch}
                    className="flex h-12 items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 text-left text-muted-foreground"
                  >
                    <Search className="size-4" aria-hidden /> Search BCA, AI, e-commerce…
                  </button>

                  <div>
                    <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Categories</p>
                    <ul className="grid gap-1">
                      {nav.categories.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/projects/${c.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-12 items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted"
                          >
                            <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", ACCENT_CLASSES[c.accent].bg)}>
                              <CategoryIcon name={c.icon} className={cn("size-[1.05rem]", ACCENT_CLASSES[c.accent].text)} />
                            </span>
                            <span className="flex-1 text-[0.95rem] font-medium">{c.name}</span>
                            <span className="text-xs text-muted-foreground">from {formatPrice(c.priceFrom)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Degrees</p>
                    <ul className="flex flex-wrap gap-2">
                      {nav.degrees.map((d) => (
                        <li key={d.slug}>
                          <Link
                            href={`/projects/${d.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium hover:border-primary/50 hover:bg-accent"
                          >
                            {d.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ul className="grid border-t border-border pt-4">
                    {[{ href: "/projects", label: "All projects" }, { href: "/project-finder", label: "Help me choose" }, ...LINKS].map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex min-h-12 items-center justify-between rounded-xl px-2 text-[0.95rem] font-medium hover:bg-muted"
                        >
                          {l.label}
                          <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <WhatsAppButton intent="general" cta="navbar" size="lg" className="w-full">
                    Talk to us on WhatsApp
                  </WhatsAppButton>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {searchMounted && (
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} popular={nav.popular} categories={nav.categories} degrees={nav.degrees} />
      )}
    </>
  );
}
